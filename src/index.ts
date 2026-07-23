import { Hono } from "hono";
import type { Env, QuestionnaireSubmission } from "./types";
import {
  authenticate,
  createJWT,
  verifyJWT,
  getUsers,
  addUser,
  removeUser,
  updateUserPassword,
  type AdminUser,
} from "./auth";
import { renderForm } from "./render/form";
import { renderAdminLogin, renderAdminDashboard } from "./render/admin";

const app = new Hono<{ Bindings: Env; Variables: { user: AdminUser } }>();

// ─── Cookie helpers ────────────────────────────────────────
function setCookie(c: string, value: string, maxAge: number): string {
  return `${c}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}
function getCookie(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

// ─── CSRF ──────────────────────────────────────────────────
function generateCsrfToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── R2 helpers ────────────────────────────────────────────
async function saveToR2(env: Env, submission: QuestionnaireSubmission): Promise<void> {
  await env.QUESTIONNAIRE_BUCKET.put(`submissions/${submission.id}.json`, JSON.stringify(submission), {
    httpMetadata: { contentType: "application/json" },
  });
}
async function listFromR2(env: Env): Promise<QuestionnaireSubmission[]> {
  const listed = await env.QUESTIONNAIRE_BUCKET.list({ prefix: "submissions/" });
  const objects = await Promise.all(
    listed.objects.map(async (obj) => {
      const body = await env.QUESTIONNAIRE_BUCKET.get(obj.key);
      if (!body) return null;
      return JSON.parse(await body.text()) as QuestionnaireSubmission;
    }),
  );
  return objects
    .filter((o): o is QuestionnaireSubmission => o !== null)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}
async function getFromR2(env: Env, id: string): Promise<QuestionnaireSubmission | null> {
  const body = await env.QUESTIONNAIRE_BUCKET.get(`submissions/${id}.json`);
  if (!body) return null;
  return JSON.parse(await body.text()) as QuestionnaireSubmission;
}
async function deleteFromR2(env: Env, id: string): Promise<void> {
  await env.QUESTIONNAIRE_BUCKET.delete(`submissions/${id}.json`);
}

// ─── Auth helpers ──────────────────────────────────────────
async function getAuthUser(c: any): Promise<AdminUser | null> {
  const token = getCookie(c.req.header("Cookie"), "admin_token");
  if (!token) return null;
  const payload = await verifyJWT(token, c.env.JWT_SECRET);
  if (!payload) return null;
  return { username: payload.username, role: payload.role, distributor: payload.distributor };
}
function requireAuth() {
  return async (c: any, next: any) => {
    const user = await getAuthUser(c);
    if (!user) return c.redirect("/admin/login");
    c.set("user", user);
    await next();
  };
}
function requireSuperadmin() {
  return async (c: any, next: any) => {
    const user = await getAuthUser(c);
    if (!user) return c.redirect("/admin/login");
    if (user.role !== "superadmin") return c.text("Forbidden: Superadmin access required", 403);
    c.set("user", user);
    await next();
  };
}

// ═══════════════════════════════════════════════════════════
//  PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════

app.get("/", (c) => c.html(renderForm()));

app.post("/api/submit", async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const submission: QuestionnaireSubmission = {
      id,
      submittedAt: new Date().toISOString(),
      distributor: "",
      general: body.general || {},
      appServices: body.appServices || {},
      zeroTrust: body.zeroTrust || {},
      developer: body.developer || {},
      additional: body.additional || {},
    };
    await saveToR2(c.env, submission);
    return c.json({ success: true, id });
  } catch {
    return c.json({ success: false, error: "Failed to save submission" }, 500);
  }
});

// ═══════════════════════════════════════════════════════════
//  ADMIN ROUTES
// ═══════════════════════════════════════════════════════════

app.get("/admin/login", (c) => c.html(renderAdminLogin()));

app.post("/admin/login", async (c) => {
  const formData = await c.req.formData();
  const username = (formData.get("username") as string) || "";
  const password = (formData.get("password") as string) || "";
  const user = await authenticate(c.env, username, password);
  if (!user) return c.html(renderAdminLogin("Invalid username or password"), 401);
  const token = await createJWT({ username: user.username, role: user.role, distributor: user.distributor }, c.env.JWT_SECRET);
  c.header("Set-Cookie", setCookie("admin_token", token, 86400));
  return c.redirect("/admin/dashboard");
});

app.get("/admin/logout", (c) => {
  c.header("Set-Cookie", setCookie("admin_token", "", 0));
  return c.redirect("/admin/login");
});

app.get("/admin/dashboard", requireAuth(), async (c) => {
  const user = c.get("user") as AdminUser;
  const [submissions, users] = await Promise.all([listFromR2(c.env), getUsers(c.env)]);
  const csrfToken = generateCsrfToken();
  c.header("Set-Cookie", setCookie("csrf_token", csrfToken, 3600));
  return c.html(renderAdminDashboard(submissions, users, user.role, user.username, user.distributor, csrfToken));
});

// Assign distributor (superadmin only)
app.post("/admin/api/assign-distributor", requireSuperadmin(), async (c) => {
  const csrfToken = getCookie(c.req.header("Cookie"), "csrf_token");
  if (c.req.header("X-CSRF-Token") !== csrfToken) return c.json({ error: "Invalid CSRF token" }, 403);
  const { id, distributor } = await c.req.json();
  if (!id) return c.json({ error: "Missing id" }, 400);
  const submission = await getFromR2(c.env, id);
  if (!submission) return c.json({ error: "Submission not found" }, 404);
  submission.distributor = distributor || "";
  await saveToR2(c.env, submission);
  return c.json({ success: true });
});

// Delete submission (superadmin only)
app.delete("/admin/api/delete/:id", requireSuperadmin(), async (c) => {
  const csrfToken = getCookie(c.req.header("Cookie"), "csrf_token");
  if (c.req.header("X-CSRF-Token") !== csrfToken) return c.json({ error: "Invalid CSRF token" }, 403);
  await deleteFromR2(c.env, c.req.param("id"));
  return c.json({ success: true });
});

// Export submission as JSON (superadmin only)
app.get("/admin/api/export/:id", requireSuperadmin(), async (c) => {
  const submission = await getFromR2(c.env, c.req.param("id"));
  if (!submission) return c.json({ error: "Not found" }, 404);
  return c.json(submission);
});

// ═══════════════════════════════════════════════════════════
//  USER MANAGEMENT (superadmin only)
// ═══════════════════════════════════════════════════════════

app.post("/admin/api/users/add", requireSuperadmin(), async (c) => {
  const csrfToken = getCookie(c.req.header("Cookie"), "csrf_token");
  if (c.req.header("X-CSRF-Token") !== csrfToken) return c.json({ error: "Invalid CSRF token" }, 403);
  const { username, password, role, distributor } = await c.req.json();
  if (!username || !password) return c.json({ error: "Username and password required" }, 400);
  if (role !== "superadmin" && role !== "user") return c.json({ error: "Invalid role" }, 400);
  const result = await addUser(c.env, username, password, role, distributor || undefined);
  if (!result.success) return c.json(result, 400);
  return c.json({ success: true });
});

app.post("/admin/api/users/remove", requireSuperadmin(), async (c) => {
  const csrfToken = getCookie(c.req.header("Cookie"), "csrf_token");
  if (c.req.header("X-CSRF-Token") !== csrfToken) return c.json({ error: "Invalid CSRF token" }, 403);
  const { username } = await c.req.json();
  if (!username) return c.json({ error: "Username required" }, 400);
  const result = await removeUser(c.env, username);
  if (!result.success) return c.json(result, 400);
  return c.json({ success: true });
});

app.post("/admin/api/users/password", requireSuperadmin(), async (c) => {
  const csrfToken = getCookie(c.req.header("Cookie"), "csrf_token");
  if (c.req.header("X-CSRF-Token") !== csrfToken) return c.json({ error: "Invalid CSRF token" }, 403);
  const { username, newPassword } = await c.req.json();
  if (!username || !newPassword) return c.json({ error: "Username and new password required" }, 400);
  const result = await updateUserPassword(c.env, username, newPassword);
  if (!result.success) return c.json(result, 400);
  return c.json({ success: true });
});

// Health check
app.get("/health", (c) => c.json({ status: "ok" }));

export default app;

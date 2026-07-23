import type { Env, UserRecord } from "./types";

// ─── Types ────────────────────────────────────────────────
export interface AdminUser {
  username: string;
  role: "superadmin" | "user";
  distributor?: string;
}

export interface JWTPayload {
  username: string;
  role: "superadmin" | "user";
  distributor?: string;
  exp: number;
}

const USERS_KEY = "config/users.json";

// ─── Base64URL helpers ─────────────────────────────────────
function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}

// ─── SHA-256 password hashing ─────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(password));
  const bytes = new Uint8Array(digest);
  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return hex;
}

// ─── HMAC-SHA256 via WebCrypto ─────────────────────────────
async function hmacSign(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const sigBytes = new Uint8Array(sig);
  let binary = "";
  for (const b of sigBytes) binary += String.fromCharCode(b);
  return base64UrlEncode(binary);
}
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

// ─── JWT ──────────────────────────────────────────────────
export async function createJWT(payload: Omit<JWTPayload, "exp">, secret: string, ttlSeconds = 86400): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body: JWTPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const data = `${header}.${base64UrlEncode(JSON.stringify(body))}`;
  const sig = await hmacSign(data, secret);
  return `${data}.${sig}`;
}
export async function verifyJWT(token: string, secret: string): Promise<JWTPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expectedSig = await hmacSign(`${header}.${body}`, secret);
  if (!timingSafeEqual(sig, expectedSig)) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(body)) as JWTPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}

// ─── R2-backed user store ─────────────────────────────────
// On first call, bootstraps from env vars ADMIN_USERS + ADMIN_PASSWORDS
// and writes to R2. Subsequent calls read from R2.

export async function getUsers(env: Env): Promise<UserRecord[]> {
  const obj = await env.QUESTIONNAIRE_BUCKET.get(USERS_KEY);
  if (obj) {
    try { return JSON.parse(await obj.text()) as UserRecord[]; } catch {}
  }
  // Bootstrap from env
  const bootstrapUsers: UserRecord[] = [];
  try {
    const adminUsers = JSON.parse(env.ADMIN_USERS) as AdminUser[];
    const passwords = JSON.parse(env.ADMIN_PASSWORDS) as Record<string, string>;
    for (const u of adminUsers) {
      const pw = passwords[u.username];
      if (pw) {
        bootstrapUsers.push({
          username: u.username,
          role: u.role,
          distributor: u.distributor,
          passwordHash: await hashPassword(pw),
        });
      }
    }
  } catch {}
  if (bootstrapUsers.length > 0) {
    await env.QUESTIONNAIRE_BUCKET.put(USERS_KEY, JSON.stringify(bootstrapUsers), {
      httpMetadata: { contentType: "application/json" },
    });
  }
  return bootstrapUsers;
}

export async function saveUsers(env: Env, users: UserRecord[]): Promise<void> {
  await env.QUESTIONNAIRE_BUCKET.put(USERS_KEY, JSON.stringify(users), {
    httpMetadata: { contentType: "application/json" },
  });
}

export async function addUser(env: Env, username: string, password: string, role: "superadmin" | "user", distributor?: string): Promise<{ success: boolean; error?: string }> {
  const users = await getUsers(env);
  if (users.find(u => u.username === username)) {
    return { success: false, error: "Username already exists" };
  }
  users.push({ username, role, distributor, passwordHash: await hashPassword(password) });
  await saveUsers(env, users);
  return { success: true };
}

export async function removeUser(env: Env, username: string): Promise<{ success: boolean; error?: string }> {
  const users = await getUsers(env);
  const idx = users.findIndex(u => u.username === username);
  if (idx === -1) return { success: false, error: "User not found" };
  if (users[idx].role === "superadmin" && users.filter(u => u.role === "superadmin").length <= 1) {
    return { success: false, error: "Cannot remove the last superadmin" };
  }
  users.splice(idx, 1);
  await saveUsers(env, users);
  return { success: true };
}

export async function updateUserPassword(env: Env, username: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  const users = await getUsers(env);
  const user = users.find(u => u.username === username);
  if (!user) return { success: false, error: "User not found" };
  user.passwordHash = await hashPassword(newPassword);
  await saveUsers(env, users);
  return { success: true };
}

export async function authenticate(env: Env, username: string, password: string): Promise<AdminUser | null> {
  const users = await getUsers(env);
  const user = users.find(u => u.username === username);
  if (!user) return null;
  const hash = await hashPassword(password);
  if (!timingSafeEqual(hash, user.passwordHash)) return null;
  return { username: user.username, role: user.role, distributor: user.distributor };
}

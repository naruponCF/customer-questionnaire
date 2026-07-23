// ─── Types ────────────────────────────────────────────────
import type { Env } from "./types";
export interface AdminUser {
  username: string;
  role: "superadmin" | "user";
  distributor?: string; // "SoftDebut" | "Nforce" — only for role=user
}

export interface JWTPayload {
  username: string;
  role: "superadmin" | "user";
  distributor?: string;
  exp: number;
}

// ─── Base64URL helpers ─────────────────────────────────────
function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}

// ─── HMAC-SHA256 via WebCrypto ─────────────────────────────
async function hmacSign(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
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
export async function createJWT(
  payload: Omit<JWTPayload, "exp">,
  secret: string,
  ttlSeconds = 86400,
): Promise<string> {
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
  } catch {
    return null;
  }
}

// ─── User store ───────────────────────────────────────────
// Users are defined in wrangler.toml [vars] ADMIN_USERS (JSON array).
// Passwords are stored in secret ADMIN_PASSWORDS (JSON map).

export function getAdminUsers(env: Env): AdminUser[] {
  try {
    return JSON.parse(env.ADMIN_USERS) as AdminUser[];
  } catch {
    return [];
  }
}

export function getAdminPasswords(env: Env): Record<string, string> {
  try {
    return JSON.parse(env.ADMIN_PASSWORDS) as Record<string, string>;
  } catch {
    return {};
  }
}

export function authenticate(
  env: Env,
  username: string,
  password: string,
): AdminUser | null {
  const users = getAdminUsers(env);
  const passwords = getAdminPasswords(env);
  const user = users.find((u) => u.username === username);
  if (!user) return null;
  const storedPw = passwords[username];
  if (!storedPw || !timingSafeEqual(password, storedPw)) return null;
  return user;
}

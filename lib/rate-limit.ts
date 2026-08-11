type RateLimitRecord = { count: number; resetAt: number };
type RateLimitStore = Map<string, RateLimitRecord>;

const globalRateLimit = globalThis as typeof globalThis & { simplifyRateLimitStore?: RateLimitStore };
const store = globalRateLimit.simplifyRateLimitStore ?? new Map<string, RateLimitRecord>();
globalRateLimit.simplifyRateLimitStore = store;

export function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anonymous";
}

export function limitRequest(identifier: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const current = store.get(identifier);
  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }
  current.count += 1;
  return { allowed: current.count <= maxRequests, remaining: Math.max(0, maxRequests - current.count), resetAt: current.resetAt };
}

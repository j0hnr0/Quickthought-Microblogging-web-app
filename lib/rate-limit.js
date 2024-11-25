// lib/rate-limit.js
export const rateLimit = {
  tokenCount: Symbol("tokenCount"),
  lastCheck: Symbol("lastCheck"),
};

export function rateLimiter(request) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const max = 100; // max requests per windowMs

  request[rateLimit.lastCheck] = request[rateLimit.lastCheck] ?? now;
  request[rateLimit.tokenCount] = request[rateLimit.tokenCount] ?? max;

  const elapsedMs = now - request[rateLimit.lastCheck];
  const tokensToAdd = (elapsedMs * max) / windowMs;

  request[rateLimit.tokenCount] = Math.min(
    max,
    request[rateLimit.tokenCount] + tokensToAdd
  );
  request[rateLimit.lastCheck] = now;

  if (request[rateLimit.tokenCount] < 1) {
    return false;
  }

  request[rateLimit.tokenCount] -= 1;
  return true;
}

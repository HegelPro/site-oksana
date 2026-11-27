const requestLimit = 8_192;
export const tooLarge = Symbol("oversized lead request");

export async function readLeadRequest(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length") ?? 0) > requestLimit) return tooLarge;

  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing request body");

  const data = new Uint8Array(requestLimit);
  let length = 0;
  try {
    for (;;) {
      const part = await reader.read();
      if (part.done) break;
      if (length + part.value.length > requestLimit) {
        void reader.cancel().catch(() => {});
        return tooLarge;
      }
      data.set(part.value, length);
      length += part.value.length;
    }
  } finally {
    reader.releaseLock();
  }

  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(data.subarray(0, length)));
}

const windowMs = 15 * 60 * 1000;
const buckets = new Map<string, { count: number; expiresAt: number }>();

export function takeLeadSlot(ip: string, now = Date.now()): number | undefined {
  // New buckets are appended in expiration order.
  for (const [key, value] of buckets) {
    if (value.expiresAt > now) break;
    buckets.delete(key);
  }

  const bucket = buckets.get(ip);
  if (bucket) {
    if (bucket.count >= 5) return Math.ceil((bucket.expiresAt - now) / 1000);
    bucket.count++;
  } else {
    if (buckets.size >= 10_000) return 60;
    buckets.set(ip, { count: 1, expiresAt: now + windowMs });
  }
  return undefined;
}

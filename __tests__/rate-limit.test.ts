import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    // Reset the internal map by allowing time window to pass
    // For tests, we use unique keys per test
  });

  it("allows requests within the limit", () => {
    const key = "test-allow-" + Date.now();
    expect(checkRateLimit(key, 3, 60000)).toBe(true);
    expect(checkRateLimit(key, 3, 60000)).toBe(true);
    expect(checkRateLimit(key, 3, 60000)).toBe(true);
  });

  it("blocks requests exceeding the limit", () => {
    const key = "test-block-" + Date.now();
    checkRateLimit(key, 2, 60000);
    checkRateLimit(key, 2, 60000);
    expect(checkRateLimit(key, 2, 60000)).toBe(false);
  });

  it("resets after the time window", async () => {
    const key = "test-reset-" + Date.now();
    checkRateLimit(key, 1, 50); // 50ms window
    expect(checkRateLimit(key, 1, 50)).toBe(false);

    await new Promise((r) => setTimeout(r, 60));
    expect(checkRateLimit(key, 1, 50)).toBe(true);
  });

  it("tracks different keys independently", () => {
    const key1 = "test-key1-" + Date.now();
    const key2 = "test-key2-" + Date.now();

    checkRateLimit(key1, 1, 60000);
    expect(checkRateLimit(key1, 1, 60000)).toBe(false);
    expect(checkRateLimit(key2, 1, 60000)).toBe(true);
  });
});

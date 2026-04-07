import { describe, it, expect } from "vitest";
import { posterUrl } from "@/lib/tmdb";

describe("posterUrl", () => {
  it("generates correct TMDB poster URL", () => {
    expect(posterUrl("/abc123.jpg")).toBe(
      "https://image.tmdb.org/t/p/w500/abc123.jpg"
    );
  });

  it("supports custom sizes", () => {
    expect(posterUrl("/abc.jpg", "w154")).toBe(
      "https://image.tmdb.org/t/p/w154/abc.jpg"
    );
  });

  it("returns null for null poster path", () => {
    expect(posterUrl(null)).toBe(null);
  });
});

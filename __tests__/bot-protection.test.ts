import { describe, it, expect } from "vitest";
import { isBot, getClientIp } from "@/lib/bot-protection";

describe("isBot", () => {
  it("detects common bot user agents", () => {
    expect(isBot("python-requests/2.28.0")).toBe(true);
    expect(isBot("curl/7.81.0")).toBe(true);
    expect(isBot("PostmanRuntime/7.29.2")).toBe(true);
    expect(isBot("axios/1.2.0")).toBe(true);
    expect(isBot("Scrapy/2.7.1")).toBe(true);
  });

  it("allows legitimate browser user agents", () => {
    expect(
      isBot(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15"
      )
    ).toBe(false);
    expect(
      isBot(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/108.0"
      )
    ).toBe(false);
  });

  it("allows search engine bots", () => {
    expect(isBot("Googlebot/2.1 (+http://www.google.com/bot.html)")).toBe(false);
    expect(isBot("Bingbot/2.0")).toBe(false);
  });

  it("blocks empty or short user agents", () => {
    expect(isBot(null)).toBe(true);
    expect(isBot("")).toBe(true);
    expect(isBot("short")).toBe(true);
  });

  it("allows social media preview bots", () => {
    expect(isBot("facebookexternalhit/1.1")).toBe(false);
    expect(isBot("Twitterbot/1.0")).toBe(false);
    expect(isBot("LinkedInBot/1.0")).toBe(false);
    expect(isBot("Slackbot-LinkExpanding 1.0")).toBe(false);
  });
});

describe("getClientIp", () => {
  it("extracts IP from x-forwarded-for", () => {
    const h = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(getClientIp(h)).toBe("1.2.3.4");
  });

  it("extracts IP from x-real-ip", () => {
    const h = new Headers({ "x-real-ip": "10.0.0.1" });
    expect(getClientIp(h)).toBe("10.0.0.1");
  });

  it("returns unknown when no IP headers", () => {
    const h = new Headers();
    expect(getClientIp(h)).toBe("unknown");
  });
});

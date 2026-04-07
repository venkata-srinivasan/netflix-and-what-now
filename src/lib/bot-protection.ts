import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";

const BOT_UA_PATTERNS = [
  /bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i, /wget/i,
  /python-requests/i, /httpx/i, /axios/i, /node-fetch/i,
  /go-http-client/i, /java\//i, /php\//i, /ruby/i, /perl/i,
  /libwww/i, /mechanize/i, /phantom/i, /headless/i, /selenium/i,
  /puppeteer/i, /playwright/i, /scrapy/i, /httpclient/i, /okhttp/i,
  /postman/i, /insomnia/i, /rest-client/i,
];

const ALLOWED_BOTS = [
  /googlebot/i, /bingbot/i, /yandexbot/i, /duckduckbot/i,
  /baiduspider/i, /slurp/i, /facebookexternalhit/i, /twitterbot/i,
  /linkedinbot/i, /whatsapp/i, /telegrambot/i, /discordbot/i,
  /slackbot/i, /vercel/i, /uptime/i,
];

export function isBot(userAgent: string | null): boolean {
  if (!userAgent || userAgent.length < 10) return true;
  if (ALLOWED_BOTS.some((p) => p.test(userAgent))) return false;
  return BOT_UA_PATTERNS.some((p) => p.test(userAgent));
}

export function getClientIp(headersList: Headers): string {
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}

export async function rateLimitEndpoint(
  endpoint: string,
  maxPerHour: number = 60
): Promise<NextResponse | null> {
  const h = await headers();
  const ua = h.get("user-agent");

  if (isBot(ua)) {
    return NextResponse.json(
      { error: "Automated requests are not allowed." },
      { status: 403 }
    );
  }

  const ip = getClientIp(h);
  const key = `api:${endpoint}:${ip}`;

  if (!checkRateLimit(key, maxPerHour, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  return null;
}

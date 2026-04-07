import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

/**
 * AI model selection with automatic fallback.
 *
 * Priority:
 * 1. Google Gemini 2.5 Flash (free tier, vision + chat, best price-performance)
 * 2. OpenAI GPT-4o (if OPENAI_API_KEY is set)
 *
 * Gemini 2.5 Flash is the default — it's free, fast, supports vision,
 * and has generous rate limits for personal use.
 */
export function getChatModel() {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return google("gemini-2.5-flash");
  }
  if (process.env.OPENAI_API_KEY) {
    return openai("gpt-4o");
  }
  return google("gemini-2.5-flash");
}

export function getVisionModel() {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return google("gemini-2.5-flash");
  }
  if (process.env.OPENAI_API_KEY) {
    return openai("gpt-4o");
  }
  return google("gemini-2.5-flash");
}

export function getProviderName(): string {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  return "gemini";
}

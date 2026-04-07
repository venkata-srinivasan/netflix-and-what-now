import { convertToModelMessages, streamText, UIMessage } from "ai";
import { getChatModel } from "@/lib/ai-provider";
import { rateLimitEndpoint } from "@/lib/bot-protection";

export const maxDuration = 60;

export async function POST(req: Request) {
  const limited = await rateLimitEndpoint("chat", 120);
  if (limited) return limited;

  const { messages, context }: { messages: UIMessage[]; context?: string } =
    await req.json();

  const systemPrompt = buildSystemPrompt(context);

  const result = streamText({
    model: getChatModel(),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}

function buildSystemPrompt(context?: string): string {
  let prompt = `You are "What Now", a friendly and knowledgeable AI companion that helps people while they watch TV shows and movies.

Your personality:
- Casual and fun, like a friend watching with them
- Give concise answers — they're watching something, don't write essays
- When identifying actors, mention their most famous roles
- Avoid major spoilers unless explicitly asked
- If you can see a screenshot from the show, describe what you observe and identify actors/scenes

Key capabilities:
- Identify actors and their filmographies
- Explain plot points and character motivations
- Recall what happened earlier in the show/movie
- Answer "who is that?" questions from screenshots
- Provide fun trivia and behind-the-scenes facts`;

  if (context) {
    prompt += `\n\nCurrent viewing context (show/movie metadata from TMDB):\n${context}`;
  }

  return prompt;
}

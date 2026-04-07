import { generateText } from "ai";
import { getVisionModel } from "@/lib/ai-provider";
import { rateLimitEndpoint } from "@/lib/bot-protection";

export const maxDuration = 30;

export async function POST(req: Request) {
  const limited = await rateLimitEndpoint("identify", 30);
  if (limited) return limited;

  const { image }: { image: string } = await req.json();

  if (!image) {
    return Response.json({ error: "No image provided" }, { status: 400 });
  }

  const { text } = await generateText({
    model: getVisionModel(),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: image,
          },
          {
            type: "text",
            text: `Look at this screenshot from a TV screen. Identify:
1. What show or movie is playing (title, season/episode if possible)
2. Any actors visible and their character names
3. A brief description of the scene

Return a JSON object with this structure:
{
  "title": "Show/Movie Name",
  "type": "tv" or "movie",
  "season": number or null,
  "episode": number or null,
  "actors": [{"name": "Actor Name", "character": "Character Name"}],
  "scene": "Brief scene description",
  "confidence": "high" | "medium" | "low"
}

Return ONLY the JSON, no markdown fences.`,
          },
        ],
      },
    ],
  });

  try {
    const parsed = JSON.parse(text);
    return Response.json(parsed);
  } catch {
    return Response.json({ raw: text, error: "Could not parse response" });
  }
}

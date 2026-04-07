import { isVocalBridgeEnabled, getAgentInfo, getAgentDocs } from "@/lib/vocalbridge";
import { rateLimitEndpoint } from "@/lib/bot-protection";

export async function GET() {
  const limited = await rateLimitEndpoint("voice", 60);
  if (limited) return limited;

  if (!isVocalBridgeEnabled()) {
    return Response.json({
      enabled: false,
      fallback: "webspeech",
      message: "VocalBridge not configured. Using Web Speech API. Set VOCALBRIDGE_API_KEY for premium voice.",
    });
  }

  try {
    const [agent, docs] = await Promise.all([getAgentInfo(), getAgentDocs()]);

    return Response.json({
      enabled: true,
      agent: {
        id: agent.id,
        name: agent.name,
        mode: agent.mode,
        status: agent.deployment_status,
        phoneNumber: agent.phone_number || null,
      },
      docs,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { enabled: false, fallback: "webspeech", error: message },
      { status: 500 }
    );
  }
}

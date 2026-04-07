import { rateLimitEndpoint } from "@/lib/bot-protection";

const VOCALBRIDGE_API = "https://vocalbridgeai.com";

export async function POST(req: Request) {
  const limited = await rateLimitEndpoint("voice-session", 30);
  if (limited) return limited;

  const apiKey = process.env.VOCALBRIDGE_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "VocalBridge not configured. Set VOCALBRIDGE_API_KEY.", mode: "webspeech" },
      { status: 400 }
    );
  }

  try {
    const { showContext } = await req.json();

    // Create a web call session with VocalBridge
    // This returns a LiveKit room token for real-time voice
    const res = await fetch(`${VOCALBRIDGE_API}/api/v1/calls`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        participant_name: "tv-viewer",
        // Pass show context so the agent knows what we're watching
        metadata: showContext ? JSON.stringify({ showContext }) : undefined,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return Response.json(
        { error: `VocalBridge session failed: ${text}`, mode: "webspeech" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return Response.json({
      mode: "vocalbridge",
      callId: data.call_id,
      roomName: data.room_name,
      livekitUrl: data.livekit_url,
      token: data.token, // LiveKit participant token
      status: data.status,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { error: message, mode: "webspeech" },
      { status: 500 }
    );
  }
}

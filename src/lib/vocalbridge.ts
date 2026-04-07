const VOCALBRIDGE_API = "https://vocalbridgeai.com";

function getApiKey(): string | null {
  return process.env.VOCALBRIDGE_API_KEY || null;
}

export function isVocalBridgeEnabled(): boolean {
  return !!getApiKey();
}

async function vbRequest(
  method: string,
  endpoint: string,
  body?: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("VOCALBRIDGE_API_KEY not set");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const res = await fetch(`${VOCALBRIDGE_API}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`VocalBridge API error (${res.status}): ${text}`);
  }

  return res.json();
}

export async function getAgentInfo(): Promise<Record<string, unknown>> {
  return vbRequest("GET", "/api/v1/agent");
}

export async function getAgentDocs(): Promise<string> {
  const result = await vbRequest("GET", "/api/v1/docs");
  return (result.docs as string) || "";
}

export async function listSessions(limit = 10): Promise<Record<string, unknown>> {
  return vbRequest("GET", `/api/v1/logs?limit=${limit}`);
}

export async function getSessionDetail(
  sessionId: string
): Promise<Record<string, unknown>> {
  return vbRequest("GET", `/api/v1/logs/${sessionId}`);
}

export async function updateAgentPrompt(prompt: string): Promise<void> {
  await vbRequest("PATCH", "/api/v1/agent/prompt", { prompt });
}

export interface VocalBridgeAgentConfig {
  name: string;
  mode: "conversational" | "interviewer" | "receptionist";
  prompt: string;
  greeting?: string;
  deployTargets?: "both" | "web" | "phone";
  apiTools?: Array<{
    name: string;
    description: string;
    url: string;
    method: string;
    headers?: Record<string, string>;
    parameters?: Record<string, unknown>;
  }>;
}

export async function createAgent(
  config: VocalBridgeAgentConfig
): Promise<Record<string, unknown>> {
  const body: Record<string, unknown> = {
    name: config.name,
    mode: config.mode,
    prompt: config.prompt,
    deploy_targets: config.deployTargets || "web",
  };

  if (config.greeting) body.greeting = config.greeting;
  if (config.apiTools) body.api_tools = config.apiTools;

  const result = await vbRequest("POST", "/api/v1/agents", body);
  return result.agent as Record<string, unknown>;
}

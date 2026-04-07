"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface VocalBridgeAgent {
  id: string;
  name: string;
  mode: string;
  status: string;
  phoneNumber: string | null;
}

interface VocalBridgeStatus {
  enabled: boolean;
  fallback?: string;
  agent?: VocalBridgeAgent;
  docs?: string;
  error?: string;
}

interface UseVocalBridgeOptions {
  onTranscript?: (text: string) => void;
  onAgentResponse?: (text: string) => void;
  onError?: (error: string) => void;
}

export function useVocalBridge({
  onTranscript,
  onAgentResponse,
  onError,
}: UseVocalBridgeOptions = {}) {
  const [status, setStatus] = useState<VocalBridgeStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const checkedRef = useRef(false);

  // Check if VocalBridge is available on mount
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    async function checkVocalBridge() {
      try {
        const res = await fetch("/api/voice");
        const data: VocalBridgeStatus = await res.json();
        setStatus(data);
      } catch {
        setStatus({ enabled: false, fallback: "webspeech" });
      } finally {
        setIsLoading(false);
      }
    }

    checkVocalBridge();
  }, []);

  const connect = useCallback(async () => {
    if (!status?.enabled || !status.agent) {
      onError?.("VocalBridge not available");
      return;
    }

    setIsConnected(true);
    // The actual WebSocket connection would be established here
    // using the agent ID and VocalBridge's real-time API.
    // For now, we signal readiness and let the voice button
    // component handle the interaction via the REST API.
  }, [status, onError]);

  const disconnect = useCallback(() => {
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback(
    async (text: string, context?: string) => {
      if (!status?.enabled) return null;

      try {
        // Use our chat API with VocalBridge context
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: text }],
            context,
            vocalbridge: true,
          }),
        });

        if (!res.ok) throw new Error("Chat request failed");

        const reader = res.body?.getReader();
        if (!reader) return null;

        let fullResponse = "";
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
        }

        onAgentResponse?.(fullResponse);
        return fullResponse;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        onError?.(msg);
        return null;
      }
    },
    [status, onAgentResponse, onError]
  );

  return {
    status,
    isEnabled: status?.enabled ?? false,
    isConnected,
    isLoading,
    agent: status?.agent ?? null,
    connect,
    disconnect,
    sendMessage,
  };
}

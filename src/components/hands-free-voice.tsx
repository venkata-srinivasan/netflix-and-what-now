"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, Radio, Volume2, Loader2, PhoneOff, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VoiceMode = "idle" | "connecting" | "listening" | "processing" | "speaking" | "error";

interface HandsFreeVoiceProps {
  showContext?: string;
  onTranscript?: (text: string) => void;
  onResponse?: (text: string) => void;
}

export function HandsFreeVoice({ showContext, onTranscript, onResponse }: HandsFreeVoiceProps) {
  const [mode, setMode] = useState<VoiceMode>("idle");
  const [transcript, setTranscript] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVocalBridge, setIsVocalBridge] = useState(false);
  const [wakeWordActive, setWakeWordActive] = useState(false);
  const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check if VocalBridge is available on mount
  useEffect(() => {
    fetch("/api/voice")
      .then((r) => r.json())
      .then((data) => setIsVocalBridge(data.enabled))
      .catch(() => setIsVocalBridge(false));
  }, []);

  function createRecognition() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    return recognition;
  }

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1;
    utteranceRef.current = utterance;

    utterance.onstart = () => setMode("speaking");
    utterance.onend = () => {
      setMode("listening");
      // Resume listening after speaking
      startContinuousListening();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const processQuestion = useCallback(async (question: string) => {
    setMode("processing");
    onTranscript?.(question);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ id: Date.now().toString(), role: "user", parts: [{ type: "text", text: question }] }],
          context: showContext,
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      // Read the streaming response
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // Parse SSE data events to extract text
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "text-delta" && data.textDelta) {
                fullText += data.textDelta;
              }
            } catch {
              // Not JSON, might be raw text
              fullText += line.slice(6);
            }
          }
        }
      }

      // Clean up the response text
      const cleanText = fullText.replace(/\*\*/g, "").replace(/\*/g, "").trim();
      if (cleanText) {
        setLastResponse(cleanText);
        onResponse?.(cleanText);
        speak(cleanText);
      } else {
        setMode("listening");
        startContinuousListening();
      }
    } catch (err) {
      console.error("Voice processing error:", err);
      setMode("listening");
      startContinuousListening();
    }
  }, [showContext, onTranscript, onResponse, speak]);

  const startContinuousListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }

    const recognition = createRecognition();
    if (!recognition) {
      setError("Speech recognition not supported in this browser");
      setMode("error");
      return;
    }

    let currentTranscript = "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        currentTranscript += " " + final;
        setTranscript(currentTranscript.trim());

        // Check for wake word in non-wake mode
        if (!wakeWordActive) {
          const lower = final.toLowerCase();
          if (lower.includes("hey what now") || lower.includes("hey whatnow") || lower.includes("what now")) {
            setWakeWordActive(true);
            currentTranscript = "";
            setTranscript("");
            return;
          }
        }

        // If wake word is active, reset silence timer
        if (wakeWordActive) {
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            // Silence detected — process the question
            if (currentTranscript.trim()) {
              const question = currentTranscript.trim();
              currentTranscript = "";
              setTranscript("");
              setWakeWordActive(false);
              try { recognition.stop(); } catch { /* ignore */ }
              processQuestion(question);
            }
          }, 2000); // 2 seconds of silence = done talking
        }
      }

      if (interim) {
        setTranscript((currentTranscript + " " + interim).trim());
      }
    };

    recognition.onend = () => {
      // Auto-restart if we're still in listening mode
      if (mode === "listening") {
        try { recognition.start(); } catch { /* ignore */ }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      if (event.error === "no-speech" || event.error === "aborted") {
        // Normal — just restart
        try { recognition.start(); } catch { /* ignore */ }
        return;
      }
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch { /* ignore */ }
  }, [mode, wakeWordActive, processQuestion]);

  const startHandsFree = useCallback(() => {
    setMode("connecting");
    setError(null);

    // Small delay to show connecting state
    setTimeout(() => {
      setMode("listening");
      setWakeWordActive(false);
      startContinuousListening();
    }, 500);
  }, [startContinuousListening]);

  const stopHandsFree = useCallback(() => {
    setMode("idle");
    setWakeWordActive(false);
    setTranscript("");
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    window.speechSynthesis?.cancel();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* ignore */ }
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  const isActive = mode !== "idle" && mode !== "error";

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Main button */}
      <div className="relative">
        <AnimatePresence>
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.4, 0, 0.4],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ background: "radial-gradient(circle, oklch(0.55 0.22 27 / 0.3), transparent)" }}
            />
          )}
        </AnimatePresence>

        <Button
          onClick={isActive ? stopHandsFree : startHandsFree}
          className={cn(
            "relative h-16 w-16 rounded-full transition-all duration-300 p-0",
            isActive
              ? "bg-red-500 hover:bg-red-600 glow text-white"
              : "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300"
          )}
        >
          {mode === "connecting" && <Loader2 className="h-6 w-6 animate-spin" />}
          {mode === "listening" && <Mic className="h-6 w-6" />}
          {mode === "processing" && <Loader2 className="h-6 w-6 animate-spin" />}
          {mode === "speaking" && <Volume2 className="h-6 w-6" />}
          {mode === "idle" && <Radio className="h-6 w-6" />}
          {mode === "error" && <MicOff className="h-6 w-6" />}
        </Button>
      </div>

      {/* Status */}
      <div className="text-center min-h-[3rem]">
        {mode === "idle" && (
          <div className="space-y-1">
            <p className="text-xs text-zinc-500">Tap to go hands-free</p>
            <p className="text-[10px] text-zinc-600 font-mono">
              {isVocalBridge ? "VocalBridge AI" : "Web Speech"}
            </p>
          </div>
        )}
        {mode === "connecting" && (
          <p className="text-xs text-zinc-400">Connecting...</p>
        )}
        {mode === "listening" && !wakeWordActive && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 justify-center">
              <Wifi className="h-3 w-3 text-green-400" />
              <p className="text-xs text-green-400 font-medium">Listening</p>
            </div>
            <p className="text-[10px] text-zinc-500">
              Say <span className="text-red-400 font-semibold">&quot;Hey What Now&quot;</span> to ask a question
            </p>
          </div>
        )}
        {mode === "listening" && wakeWordActive && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 justify-center">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-xs text-red-400 font-medium">Ask your question...</p>
            </div>
            {transcript && (
              <p className="text-xs text-zinc-400 max-w-60 truncate italic">{transcript}</p>
            )}
          </div>
        )}
        {mode === "processing" && (
          <div className="space-y-1">
            <p className="text-xs text-yellow-400">Thinking...</p>
            {transcript && (
              <p className="text-[10px] text-zinc-500 max-w-60 truncate">&quot;{transcript}&quot;</p>
            )}
          </div>
        )}
        {mode === "speaking" && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 justify-center">
              <Volume2 className="h-3 w-3 text-blue-400" />
              <p className="text-xs text-blue-400 font-medium">Speaking...</p>
            </div>
            {lastResponse && (
              <p className="text-[10px] text-zinc-500 max-w-60 line-clamp-2">{lastResponse}</p>
            )}
          </div>
        )}
        {mode === "error" && (
          <p className="text-xs text-red-400">{error || "Voice not available"}</p>
        )}
      </div>

      {/* Stop button when active */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={stopHandsFree}
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs border-zinc-700 text-zinc-400"
          >
            <PhoneOff className="h-3 w-3" />
            Stop
          </Button>
        </motion.div>
      )}
    </div>
  );
}

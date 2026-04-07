"use client";

import { Mic, MicOff, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  onStart: () => void;
  onStop: () => void;
  provider: "vocalbridge" | "webspeech";
}

export function VoiceButton({
  isListening,
  isSupported,
  transcript,
  onStart,
  onStop,
  provider,
}: VoiceButtonProps) {
  if (!isSupported) return null;

  const isVB = provider === "vocalbridge";

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {isListening && <div className="pulse-ring" />}
        <Button
          type="button"
          size="sm"
          variant={isListening ? "destructive" : "outline"}
          onClick={isListening ? onStop : onStart}
          className={cn(
            "h-10 w-10 p-0 rounded-full transition-all relative",
            isListening && "glow",
            isVB && !isListening && "border-primary/40 hover:border-primary hover:bg-primary/10"
          )}
          title={isListening ? "Stop listening" : `Ask with voice${isVB ? " (VocalBridge)" : ""}`}
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : isVB ? (
            <Radio className="h-4 w-4 text-primary" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
      </div>
      {isListening && transcript && (
        <span className="text-sm text-muted-foreground italic animate-in fade-in max-w-48 truncate">
          {transcript}...
        </span>
      )}
      {!isListening && isVB && (
        <span className="text-[10px] text-primary/60 font-mono hidden sm:block">
          VocalBridge
        </span>
      )}
    </div>
  );
}

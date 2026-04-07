"use client";

import { useState, useEffect } from "react";
import { AlertCircle, ExternalLink, Check, Key, Film, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppStatus {
  ready: boolean;
  providers: {
    ai: string | null;
    tmdb: boolean;
    vocalbridge: boolean;
  };
  missing: string[];
}

export function SetupGuide() {
  const [status, setStatus] = useState<AppStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((data) => setStatus(data))
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (status?.ready) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-lg w-full rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
            <Key className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Setup Required</h2>
            <p className="text-sm text-zinc-500">Add API keys to start using the app</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {/* Gemini */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${status?.providers.ai ? "bg-green-500/20" : "bg-red-500/20"}`}>
              {status?.providers.ai ? (
                <Check className="h-3 w-3 text-green-400" />
              ) : (
                <AlertCircle className="h-3 w-3 text-red-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">
                Google Gemini API Key
                <span className="text-red-400 ml-1 text-xs">(required)</span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Free — powers vision + chat. Get one in 30 seconds.
              </p>
              {!status?.providers.ai && (
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 mt-2 transition-colors"
                >
                  Get free API key
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          {/* TMDB */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${status?.providers.tmdb ? "bg-green-500/20" : "bg-zinc-700/50"}`}>
              {status?.providers.tmdb ? (
                <Check className="h-3 w-3 text-green-400" />
              ) : (
                <Film className="h-3 w-3 text-zinc-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">
                TMDB API Key
                <span className="text-zinc-500 ml-1 text-xs">(optional)</span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Free — enables show search, cast info, and episode details.
              </p>
            </div>
          </div>

          {/* VocalBridge */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${status?.providers.vocalbridge ? "bg-green-500/20" : "bg-zinc-700/50"}`}>
              {status?.providers.vocalbridge ? (
                <Check className="h-3 w-3 text-green-400" />
              ) : (
                <Mic className="h-3 w-3 text-zinc-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">
                VocalBridge API Key
                <span className="text-zinc-500 ml-1 text-xs">(optional)</span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Premium voice agent. Falls back to browser speech recognition.
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30 mb-6">
          <p className="text-xs text-zinc-400 font-mono leading-relaxed">
            <span className="text-zinc-500"># Self-hosting? Add keys to .env.local:</span>
            <br />
            cp .env.example .env.local
            <br />
            <span className="text-zinc-500"># Then restart the dev server</span>
            <br />
            <br />
            <span className="text-zinc-500"># Deploying to Vercel? Add via dashboard:</span>
            <br />
            vercel env add GOOGLE_GENERATIVE_AI_API_KEY
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/venkata-srinivasan/netflix-and-what-now#quick-start"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="outline" className="w-full gap-2 border-zinc-700 text-zinc-300 text-sm">
              View Setup Guide
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
          <Button
            onClick={() => window.location.reload()}
            className="flex-1 gap-2 bg-red-500 hover:bg-red-600 text-white border-0 text-sm"
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}

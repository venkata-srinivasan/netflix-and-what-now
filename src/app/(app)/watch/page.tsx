"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useCallback, useRef, useEffect } from "react";
import { Send, Tv, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CameraCapture } from "@/components/camera-capture";
import { VoiceButton } from "@/components/voice-button";
import { ShowContext } from "@/components/show-context";
import { useVoice } from "@/hooks/use-voice";
import { useVocalBridge } from "@/hooks/use-vocalbridge";
import { SetupGuide } from "@/components/setup-guide";
import { HandsFreeVoice } from "@/components/hands-free-voice";
import { cn } from "@/lib/utils";

interface ShowInfo {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
  vote_average?: number;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [currentShow, setCurrentShow] = useState<ShowInfo | null>(null);
  const [showDetails, setShowDetails] = useState<Record<string, unknown> | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [showSearch, setShowSearch] = useState("");
  const [searchResults, setSearchResults] = useState<ShowInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildContext = useCallback(() => {
    if (!currentShow && !showDetails) return undefined;
    const parts: string[] = [];
    if (currentShow) {
      parts.push(`Now watching: ${currentShow.title || currentShow.name}`);
      parts.push(`Type: ${currentShow.media_type}`);
      if (currentShow.overview) parts.push(`Overview: ${currentShow.overview}`);
    }
    if (showDetails) {
      const details = showDetails as Record<string, unknown>;
      const cast = details.cast as Array<{ name: string; character: string }> | undefined;
      if (cast) {
        parts.push(
          `Cast: ${cast.map((c) => `${c.name} as ${c.character}`).join(", ")}`
        );
      }
    }
    return parts.join("\n");
  }, [currentShow, showDetails]);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { context: buildContext() },
    }),
  });

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim() && !capturedImage) return;

      if (capturedImage) {
        sendMessage({
          text: text || "What's on the screen? Who are the actors?",
          files: [
            {
              type: "file" as const,
              mediaType: "image/jpeg",
              url: capturedImage,
            },
          ],
        });
        setCapturedImage(null);
      } else {
        sendMessage({ text });
      }
      setInput("");
    },
    [capturedImage, sendMessage]
  );

  const vocalBridge = useVocalBridge({
    onTranscript: (text) => {
      handleSend(text);
    },
    onAgentResponse: (text) => {
      // VocalBridge agent responded — speak it aloud
      if (voice.speak) voice.speak(text);
    },
  });

  const voice = useVoice({
    onResult: (transcript) => {
      handleSend(transcript);
    },
  });

  // Use VocalBridge if enabled, otherwise fall back to Web Speech
  const voiceProvider = vocalBridge.isEnabled ? "vocalbridge" : "webspeech";

  const identifyFromImage = useCallback(
    async (imageDataUrl: string) => {
      setCapturedImage(imageDataUrl);
      setIsIdentifying(true);
      try {
        const res = await fetch("/api/identify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageDataUrl }),
        });
        const data = await res.json();
        if (data.title && data.confidence !== "low") {
          // Search TMDB for the identified show
          const tmdbRes = await fetch(
            `/api/tmdb?q=${encodeURIComponent(data.title)}`
          );
          const tmdbData = await tmdbRes.json();
          if (tmdbData.results?.length > 0) {
            const match = tmdbData.results[0];
            setCurrentShow(match);
            await loadShowDetails(match);
          }
        }
      } catch (err) {
        console.error("Identification failed:", err);
      } finally {
        setIsIdentifying(false);
      }
    },
    []
  );

  const loadShowDetails = async (show: ShowInfo) => {
    try {
      const res = await fetch(`/api/tmdb?id=${show.id}&type=${show.media_type}`);
      const data = await res.json();
      setShowDetails(data.details);
    } catch (err) {
      console.error("Failed to load show details:", err);
    }
  };

  const searchShows = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/tmdb?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleShowSearchChange = (value: string) => {
    setShowSearch(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => searchShows(value), 400);
  };

  const selectShow = async (show: ShowInfo) => {
    setCurrentShow(show);
    setShowSearch("");
    setSearchResults([]);
    await loadShowDetails(show);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const isStreaming = status === "streaming";

  return (
    <div className="flex flex-col h-screen bg-background">
      <SetupGuide />
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Tv className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold tracking-tight">
            Netflix & What Now
          </h1>
          <Badge variant="secondary" className="text-[10px] font-mono">
            AI TV Companion
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/venkata-srinivasan/netflix-and-what-now"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — show selection */}
        <aside className="w-72 border-r border-border flex flex-col p-3 gap-3 hidden md:flex">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              What are you watching?
            </label>
            <Input
              placeholder="Search shows or movies..."
              value={showSearch}
              onChange={(e) => handleShowSearchChange(e.target.value)}
              className="mt-1.5 h-9 text-sm"
            />
          </div>

          {isSearching && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Searching...
            </div>
          )}

          {searchResults.length > 0 && (
            <ScrollArea className="flex-1">
              <div className="space-y-1">
                {searchResults.map((show) => (
                  <button
                    key={show.id}
                    onClick={() => selectShow(show)}
                    className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors text-sm"
                  >
                    <div className="font-medium leading-tight">
                      {show.title || show.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {show.media_type === "tv" ? "TV Show" : "Movie"}
                      {show.vote_average
                        ? ` - ${show.vote_average.toFixed(1)}/10`
                        : ""}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}

          {currentShow && (
            <>
              <Separator />
              <ShowContext
                show={currentShow}
                details={showDetails}
                onClear={() => {
                  setCurrentShow(null);
                  setShowDetails(null);
                }}
              />
            </>
          )}

          {!currentShow && searchResults.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <Tv className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                Search for a show or point your camera at the TV
              </p>
            </div>
          )}
        </aside>

        {/* Main chat area */}
        <main className="flex-1 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
                {/* Hands-free voice — the main feature */}
                <HandsFreeVoice
                  showContext={buildContext()}
                  onTranscript={(text) => handleSend(text)}
                />

                <div className="mt-8 mb-4">
                  <h2 className="text-lg font-semibold mb-1">
                    Your AI TV Companion
                  </h2>
                  <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                    Go hands-free or type a question below.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
                  {[
                    "Who is that actor on screen?",
                    "What just happened? I missed it",
                    "Is this character the same one from season 1?",
                    "Give me trivia about this movie",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSend(suggestion)}
                      className="text-left text-sm p-3 rounded-lg border border-border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border"
                      )}
                    >
                      {message.parts.map((part, i) => {
                        if (part.type === "text") {
                          return (
                            <span key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                              {part.text}
                            </span>
                          );
                        }
                        if (
                          part.type === "file" &&
                          part.mediaType?.startsWith("image/")
                        ) {
                          return (
                            <img
                              key={`${message.id}-${i}`}
                              src={part.url}
                              alt="Screenshot"
                              className="rounded-lg max-h-32 mt-1"
                            />
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ))}
                {isStreaming && (
                  <div className="flex gap-3 justify-start">
                    <div className="bg-card border border-border rounded-xl px-4 py-2.5">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input area */}
          <div className="border-t border-border p-3 space-y-3">
            {/* Camera / captured image */}
            <div className="flex items-center gap-2">
              <CameraCapture
                onCapture={identifyFromImage}
                capturedImage={capturedImage}
                onClear={() => setCapturedImage(null)}
              />
              {isIdentifying && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Identifying what&apos;s on screen...
                </div>
              )}
            </div>

            {/* Mobile show context */}
            {currentShow && (
              <div className="md:hidden">
                <ShowContext
                  show={currentShow}
                  details={showDetails}
                  onClear={() => {
                    setCurrentShow(null);
                    setShowDetails(null);
                  }}
                />
              </div>
            )}

            {/* Text + voice input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2"
            >
              {/* Mobile show search */}
              <div className="md:hidden">
                <Input
                  placeholder="What show?"
                  value={showSearch}
                  onChange={(e) => handleShowSearchChange(e.target.value)}
                  className="h-9 w-28 text-xs"
                />
              </div>

              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  capturedImage
                    ? "Ask about the screenshot..."
                    : "Ask anything about the show..."
                }
                disabled={isStreaming}
                className="flex-1 h-10"
              />

              <VoiceButton
                isListening={voice.isListening}
                isSupported={voice.isSupported}
                transcript={voice.transcript}
                onStart={voice.startListening}
                onStop={voice.stopListening}
                provider={voiceProvider}
              />

              <Button
                type="submit"
                size="sm"
                disabled={isStreaming || (!input.trim() && !capturedImage)}
                className="h-10 w-10 p-0 rounded-full"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Mobile search results dropdown */}
          {searchResults.length > 0 && (
            <div className="md:hidden border-t border-border p-2 max-h-48 overflow-y-auto">
              {searchResults.map((show) => (
                <button
                  key={show.id}
                  onClick={() => selectShow(show)}
                  className="w-full text-left p-2 rounded-md hover:bg-accent text-sm"
                >
                  <span className="font-medium">{show.title || show.name}</span>
                  <span className="text-muted-foreground ml-2 text-xs">
                    {show.media_type === "tv" ? "TV" : "Movie"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

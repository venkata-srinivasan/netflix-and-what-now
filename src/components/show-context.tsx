"use client";

import { Badge } from "@/components/ui/badge";
import { posterUrl } from "@/lib/tmdb";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShowContextProps {
  show: {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    poster_path: string | null;
    media_type: "movie" | "tv";
    vote_average?: number;
  } | null;
  details: Record<string, unknown> | null;
  onClear: () => void;
}

export function ShowContext({ show, details, onClear }: ShowContextProps) {
  if (!show) return null;

  const title = show.title || show.name || "Unknown";
  const poster = posterUrl(show.poster_path, "w154");
  const cast = (details as { cast?: Array<{ name: string; character: string }> })?.cast;

  return (
    <div className="flex gap-3 p-3 rounded-lg bg-card border border-border">
      {poster && (
        <img
          src={poster}
          alt={title}
          className="w-16 h-24 rounded object-cover flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm leading-tight">{title}</h3>
            <div className="flex gap-1.5 mt-1">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {show.media_type === "tv" ? "TV Show" : "Movie"}
              </Badge>
              {show.vote_average && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {show.vote_average.toFixed(1)} / 10
                </Badge>
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            className="h-6 w-6 p-0 text-muted-foreground"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        {cast && cast.length > 0 && (
          <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2 font-mono">
            {cast.slice(0, 5).map((c) => c.name).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}

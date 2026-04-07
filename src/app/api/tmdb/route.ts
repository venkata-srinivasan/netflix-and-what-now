import { searchMulti, getMovieDetails, getTVDetails, getSeasonDetails } from "@/lib/tmdb";
import { NextRequest } from "next/server";
import { rateLimitEndpoint } from "@/lib/bot-protection";

export async function GET(req: NextRequest) {
  const limited = await rateLimitEndpoint("tmdb", 200);
  if (limited) return limited;
  const query = req.nextUrl.searchParams.get("q");
  const id = req.nextUrl.searchParams.get("id");
  const type = req.nextUrl.searchParams.get("type");
  const season = req.nextUrl.searchParams.get("season");

  try {
    if (query) {
      const results = await searchMulti(query);
      return Response.json({ results: results.slice(0, 10) });
    }

    if (id && type) {
      const numId = parseInt(id, 10);
      if (type === "movie") {
        const details = await getMovieDetails(numId);
        return Response.json({ details });
      }
      if (type === "tv") {
        const details = await getTVDetails(numId);
        let seasonData = null;
        if (season) {
          seasonData = await getSeasonDetails(numId, parseInt(season, 10));
        }
        return Response.json({ details, season: seasonData });
      }
    }

    return Response.json({ error: "Provide ?q=search or ?id=123&type=tv" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

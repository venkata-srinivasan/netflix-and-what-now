const TMDB_BASE = "https://api.themoviedb.org/3";

function getApiKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY not set");
  return key;
}

export interface TMDBShow {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

export interface TMDBCredit {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TMDBEpisode {
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  air_date: string;
  still_path: string | null;
  guest_stars: TMDBCredit[];
}

export async function searchMulti(query: string): Promise<TMDBShow[]> {
  const res = await fetch(
    `${TMDB_BASE}/search/multi?api_key=${getApiKey()}&query=${encodeURIComponent(query)}&include_adult=false`
  );
  if (!res.ok) throw new Error(`TMDB search failed: ${res.status}`);
  const data = await res.json();
  return data.results.filter(
    (r: TMDBShow) => r.media_type === "movie" || r.media_type === "tv"
  );
}

export async function getMovieDetails(movieId: number) {
  const [details, credits] = await Promise.all([
    fetch(`${TMDB_BASE}/movie/${movieId}?api_key=${getApiKey()}`).then((r) => r.json()),
    fetch(`${TMDB_BASE}/movie/${movieId}/credits?api_key=${getApiKey()}`).then((r) => r.json()),
  ]);
  return {
    ...details,
    cast: credits.cast?.slice(0, 20) ?? [],
  };
}

export async function getTVDetails(tvId: number) {
  const [details, credits] = await Promise.all([
    fetch(`${TMDB_BASE}/tv/${tvId}?api_key=${getApiKey()}`).then((r) => r.json()),
    fetch(`${TMDB_BASE}/tv/${tvId}/credits?api_key=${getApiKey()}`).then((r) => r.json()),
  ]);
  return {
    ...details,
    cast: credits.cast?.slice(0, 20) ?? [],
  };
}

export async function getEpisodeDetails(
  tvId: number,
  season: number,
  episode: number
): Promise<TMDBEpisode> {
  const res = await fetch(
    `${TMDB_BASE}/tv/${tvId}/season/${season}/episode/${episode}?api_key=${getApiKey()}`
  );
  if (!res.ok) throw new Error(`TMDB episode fetch failed: ${res.status}`);
  return res.json();
}

export async function getSeasonDetails(tvId: number, season: number) {
  const res = await fetch(
    `${TMDB_BASE}/tv/${tvId}/season/${season}?api_key=${getApiKey()}`
  );
  if (!res.ok) throw new Error(`TMDB season fetch failed: ${res.status}`);
  return res.json();
}

export function posterUrl(path: string | null, size = "w500") {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

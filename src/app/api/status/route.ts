export async function GET() {
  const gemini = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const openai = !!process.env.OPENAI_API_KEY;
  const tmdb = !!process.env.TMDB_API_KEY;
  const vocalbridge = !!process.env.VOCALBRIDGE_API_KEY;

  const aiReady = gemini || openai;

  return Response.json({
    ready: aiReady,
    providers: {
      ai: gemini ? "gemini" : openai ? "openai" : null,
      tmdb,
      vocalbridge,
    },
    missing: [
      ...(!aiReady ? ["GOOGLE_GENERATIVE_AI_API_KEY or OPENAI_API_KEY"] : []),
      ...(!tmdb ? ["TMDB_API_KEY (optional)"] : []),
    ],
  });
}

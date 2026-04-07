import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Netflix & What Now — AI TV Companion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            📺
          </div>
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 800,
            color: "#fafafa",
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: "800px",
          }}
        >
          Netflix & What Now
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#a1a1aa",
            marginTop: "16px",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          Point your phone at the TV. Ask anything.
        </div>
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "40px",
            fontSize: "16px",
            color: "#71717a",
          }}
        >
          <span>Camera AI</span>
          <span>Voice Input</span>
          <span>Show Context</span>
          <span>Open Source</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

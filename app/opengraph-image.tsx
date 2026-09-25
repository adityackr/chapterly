import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: 96,
          background: "linear-gradient(135deg, #1e1b4b 0%, #6d28d9 55%, #c026d3 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, opacity: 0.85 }}>Chapterly</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 12 }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>
            Turn YouTube videos
          </div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>
            into proper courses
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, opacity: 0.8, marginTop: 24 }}>
          Timestamps → lessons · progress · resume · 100% private
        </div>
      </div>
    ),
    { ...size }
  );
}

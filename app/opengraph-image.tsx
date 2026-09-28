import { ImageResponse } from "next/og";

// Card shown when the link is posted in Telegram, WhatsApp, social networks.
export const alt = "KEL Studio - веб-студия полного цикла";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#0a0a0a",
          // Same violet wash as the hero.
          backgroundImage:
            "radial-gradient(ellipse at 50% 45%, rgba(139,92,246,0.35), transparent 65%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 104, fontWeight: 800, letterSpacing: -2 }}>
          KEL Studio
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 40,
            color: "#d4d4d8",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          Создаём цифровые продукты будущего
        </div>
        <div style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 220,
              height: 4,
              borderRadius: 2,
              background: "linear-gradient(to right, #22d3ee, #a78bfa, #e879f9)",
            }}
          />
        </div>
        <div style={{ marginTop: 40, fontSize: 32, color: "#a1a1aa" }}>kel.agency</div>
      </div>
    ),
    size
  );
}

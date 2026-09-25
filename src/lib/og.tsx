import { ImageResponse } from "next/og";

/**
 * Shared renderer for every Open Graph card.
 *
 * Generated at build time, so a share preview costs nothing at request time
 * and always matches the site rather than drifting from a hand-exported PNG.
 *
 * Deliberately plain: next/og runs Satori, which supports a subset of CSS —
 * no CSS variables, no Tailwind, explicit flex on every container. Values are
 * copied from the token file rather than referenced.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function renderOgImage({
  title,
  eyebrow,
  footer,
}: {
  title: string;
  eyebrow?: string;
  footer?: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#ffffff",
        padding: 80,
        fontFamily: "sans-serif",
      }}
    >
      {eyebrow ? (
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#9a9a92",
          }}
        >
          {eyebrow}
        </div>
      ) : (
        <div style={{ display: "flex" }} />
      )}

      <div
        style={{
          display: "flex",
          fontSize: title.length > 48 ? 64 : 80,
          lineHeight: 1.08,
          letterSpacing: -2,
          color: "#16150f",
          fontWeight: 600,
          maxWidth: 940,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 26,
          color: "#6a6a63",
        }}
      >
        <span style={{ display: "flex" }}>{footer ?? "Aryan Chillal"}</span>
        <span style={{ display: "flex", color: "#12b33f" }}>●</span>
      </div>
    </div>,
    OG_SIZE,
  );
}

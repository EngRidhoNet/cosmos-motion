import React from "react";

export interface SourceEntry {
  id: string;
  category: "DATA PETA" | "CITRA BUMI" | "ARSIP SEJARAH" | "SUMBER ILMIAH";
  title: string;
  citation: string;
  url?: string;
  license?: string;
}

export const SourceBadge: React.FC<{
  category?: "DATA PETA" | "CITRA BUMI" | "ARSIP SEJARAH" | "SUMBER ILMIAH";
  source?: string;
  detail?: string;
  citation?: string;
}> = ({ category = "SUMBER ILMIAH", source, detail, citation }) => (
  <div
    style={{
      position: "absolute",
      left: 52,
      bottom: 84,
      backgroundColor: "rgba(9, 13, 22, 0.94)",
      border: "2px solid rgba(125, 211, 252, 0.55)",
      borderLeft: "6px solid #FFD60A",
      padding: "8px 16px",
      borderRadius: 6,
      zIndex: 62,
      pointerEvents: "none",
      maxWidth: 976,
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.65)",
    }}
  >
    <span
      style={{
        color: "#FFD60A",
        fontSize: 14.5,
        fontWeight: 900,
        letterSpacing: 1.4,
      }}
    >
      {category}:{" "}
    </span>
    <span style={{ color: "#ffffff", fontSize: 15, fontWeight: 700 }}>
      {source || citation}
    </span>
    {detail && (
      <span style={{ color: "#cbd5e1", fontSize: 13.5, fontWeight: 600 }}>
        {" "}
        · {detail}
      </span>
    )}
  </div>
);

export const ReferenceEndCard: React.FC<{
  title?: string;
  sources: SourceEntry[];
}> = ({
  title = "DAFTAR PUSTAKA, PETA GEOGRAFIS & ARSIP ILMIAH TERVERIFIKASI:",
  sources,
}) => (
  <div
    style={{
      position: "absolute",
      left: 52,
      right: 52,
      bottom: 92,
      backgroundColor: "rgba(9, 14, 23, 0.97)",
      border: "3px solid #7dd3fc",
      borderLeft: "8px solid #FFD60A",
      borderRadius: 14,
      padding: "16px 22px",
      zIndex: 62,
      color: "#f8fafc",
      boxShadow: "0 18px 42px rgba(0,0,0,0.88)",
    }}
  >
    <div
      style={{
        color: "#FFD60A",
        fontSize: 17.5,
        fontWeight: 900,
        letterSpacing: 1.8,
        marginBottom: 8,
        fontFamily: "serif",
      }}
    >
      {title}
    </div>
    <div style={{ fontSize: 14.2, lineHeight: 1.48, color: "#e2e8f0" }}>
      {sources.map((s, idx) => (
        <div key={s.id} style={{ marginTop: idx === 0 ? 0 : 4 }}>
          <strong style={{ color: "#7dd3fc" }}>
            {idx + 1}. {s.title}:
          </strong>{" "}
          {s.citation}
          {s.license ? ` (${s.license})` : ""}
        </div>
      ))}
    </div>
  </div>
);

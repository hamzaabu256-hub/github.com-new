// Arabic one-word captions (Cairo, heavy white type, dark outline), same look as the English ones.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Cairo";
import { groupWords } from "../engine/Captions";
import type { Word } from "../engine/Captions";

const { fontFamily } = loadFont("normal", { weights: ["800", "900"], subsets: ["arabic"] });
export { fontFamily as arabicFont };

export const Captions3: React.FC<{ words: Word[]; y?: number; size?: number }> = ({ words, y = 0.8, size = 86 }) => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const t = frame / fps;
  const g = groupWords(words);
  const cur = g.find((w) => t >= w.start && t < w.end + 0.04);
  if (!cur) return null;
  const k = interpolate(t - cur.start, [0, 0.07, 0.13], [0.8, 1.08, 1], { extrapolateRight: "clamp" });
  const scale = Math.min(width, height) / 1080;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: height * y, left: 0, right: 0, textAlign: "center", direction: "rtl", transform: `translateY(-50%) scale(${k})` }}>
        <span style={{ fontFamily, fontWeight: 900, fontSize: size * scale, color: "#ffffff",
          WebkitTextStroke: `${12 * scale}px #111014`, paintOrder: "stroke fill", textShadow: `0 ${6 * scale}px ${10 * scale}px rgba(0,0,0,0.45)` }}>{cur.w}</span>
      </div>
    </AbsoluteFill>
  );
};

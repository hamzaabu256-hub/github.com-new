// Episode 3 (Asrar Al-Nafs): a bedroom at night with a small desk corner. Icons and screens are drawn live on canvases
// (no text except digits, so no font is needed inside the 3D scene; Arabic lives only in the captions overlay).
import React, { useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Box, Cyl, Ground } from "../engine/kit";
import { painted, planks, rng } from "../engine/tex";
import type { Look, V3 } from "../engine/Stage";

export const nightLook = (): Look => ({
  fog: "#14102a", fogNear: 14, fogFar: 42,
  sun: { pos: [2, 9, 7], color: "#9fa6ff", intensity: 0.5, shadow: 14 },
  hemi: { sky: "#7f7fd8", ground: "#3a2a5a", intensity: 0.62 },
  ambient: 0.14, exposure: 1.4, aperture: 0.5, warm: "#ffb070", cool: "#5a46d8", vignette: 0.6, saturation: 1.2,
});
export const calmLook = (): Look => ({ ...nightLook(), warm: "#ffc890", cool: "#46a0d8", exposure: 1.45 });

type Draw = (g: CanvasRenderingContext2D, t: number, w: number, h: number) => void;

// A flat panel whose picture is redrawn every frame
export const DrawPanel: React.FC<{ pos: V3; w: number; h: number; draw: Draw; px?: number; rotY?: number }> = ({ pos, w, h, draw, px = 512, rotY = 0 }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const W = px, H = Math.round((px * h) / w);
  const o = useMemo(() => {
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    return { g: c.getContext("2d")!, tex };
  }, [W, H]);
  draw(o.g, frame / fps, W, H); o.tex.needsUpdate = true;
  return (
    <mesh position={pos} rotation={[0, rotY, 0]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={o.tex} fog={false} transparent />
    </mesh>
  );
};

const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));
const card = (g: CanvasRenderingContext2D, w: number, h: number, bg: string, edge: string) => {
  g.clearRect(0, 0, w, h); g.fillStyle = bg; g.fillRect(0, 0, w, h); g.strokeStyle = edge; g.lineWidth = Math.max(6, w * 0.02); g.strokeRect(w * 0.02, w * 0.02, w * 0.96, h - w * 0.04);
};

// shot 1: the phone, a read-counter climbing to 10
export const phoneDraw: Draw = (g, t, w, h) => {
  g.clearRect(0, 0, w, h); g.fillStyle = "#0d1428"; g.fillRect(0, 0, w, h);
  g.fillStyle = "#2c3a6b"; g.fillRect(w * 0.08, h * 0.1, w * 0.6, h * 0.1);
  g.fillStyle = "#3d7aff"; g.fillRect(w * 0.3, h * 0.26, w * 0.62, h * 0.11); g.fillRect(w * 0.42, h * 0.42, w * 0.5, h * 0.09);
  g.strokeStyle = "#9fd0ff"; g.lineWidth = w * 0.015; g.lineCap = "round";
  for (const dx of [0, 0.05]) { g.beginPath(); g.moveTo(w * (0.8 + dx), h * 0.55); g.lineTo(w * (0.83 + dx), h * 0.575); g.lineTo(w * (0.88 + dx), h * 0.53); g.stroke(); }
  const n = Math.min(10, Math.floor(t * 2.3) + 1);
  g.fillStyle = "#ff4a6a"; g.beginPath(); g.arc(w * 0.5, h * 0.76, w * 0.24, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#ffffff"; g.font = `900 ${w * 0.26}px Arial`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("x" + n, w * 0.5, h * 0.77);
};
// shots 3-4: a spiral that keeps turning
export const loopDraw: Draw = (g, t, w, h) => {
  card(g, w, h, "#1a1030", "#ff8ac8");
  g.strokeStyle = "#ff8ac8"; g.lineWidth = w * 0.035; g.lineCap = "round"; g.beginPath();
  const cx = w / 2, cy = h / 2, a0 = t * 3;
  for (let i = 0; i <= 160; i++) { const k = i / 160, r = k * w * 0.36, a = a0 + k * Math.PI * 6; const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; if (i === 0) g.moveTo(x, y); else g.lineTo(x, y); }
  g.stroke();
  g.fillStyle = "#ffd0ec"; g.beginPath(); g.arc(cx, cy, w * 0.035, 0, Math.PI * 2); g.fill();
};
// shot 5: a magnifying glass hunting for the answer
export const searchDraw: Draw = (g, t, w, h) => {
  card(g, w, h, "#10203a", "#7fd0ff");
  g.fillStyle = "#274a7a"; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { g.beginPath(); g.arc(w * (0.2 + i * 0.15), h * (0.2 + j * 0.15), w * 0.018, 0, Math.PI * 2); g.fill(); }
  const x = w * (0.5 + 0.18 * Math.cos(t * 2.2)), y = h * (0.5 + 0.14 * Math.sin(t * 3.1));
  g.strokeStyle = "#ffe28a"; g.lineWidth = w * 0.04; g.lineCap = "round";
  g.beginPath(); g.arc(x, y, w * 0.14, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.moveTo(x + w * 0.1, y + w * 0.1); g.lineTo(x + w * 0.24, y + w * 0.24); g.stroke();
};
// shot 6: a dead end
export const deadEndDraw: Draw = (g, t, w, h) => {
  card(g, w, h, "#2a1018", "#ff5a6a");
  g.strokeStyle = "#7a2a38"; g.lineWidth = w * 0.03; g.lineCap = "round";
  g.beginPath(); g.moveTo(w * 0.15, h * 0.2); g.lineTo(w * 0.85, h * 0.2); g.lineTo(w * 0.85, h * 0.45); g.lineTo(w * 0.3, h * 0.45); g.lineTo(w * 0.3, h * 0.7); g.lineTo(w * 0.7, h * 0.7); g.stroke();
  const k = 1 + 0.06 * Math.sin(t * 8);
  g.save(); g.translate(w * 0.7, h * 0.7); g.scale(k, k); g.strokeStyle = "#ff4a5a"; g.lineWidth = w * 0.07;
  g.beginPath(); g.moveTo(-w * 0.13, -w * 0.13); g.lineTo(w * 0.13, w * 0.13); g.moveTo(w * 0.13, -w * 0.13); g.lineTo(-w * 0.13, w * 0.13); g.stroke(); g.restore();
};
// shot 7: the line that rises (worry and sadness)
export const chartDraw: Draw = (g, t, w, h) => {
  card(g, w, h, "#12162e", "#9fb0ff");
  g.strokeStyle = "#3a4a7a"; g.lineWidth = w * 0.012;
  g.beginPath(); g.moveTo(w * 0.1, h * 0.12); g.lineTo(w * 0.1, h * 0.86); g.lineTo(w * 0.92, h * 0.86); g.stroke();
  const pts = [[0.1, 0.78], [0.25, 0.72], [0.4, 0.6], [0.55, 0.52], [0.7, 0.32], [0.9, 0.16]];
  const prog = ease(t / 2.2) * (pts.length - 1);
  g.strokeStyle = "#ff5a8a"; g.lineWidth = w * 0.03; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(w * pts[0][0], h * pts[0][1]);
  let lx = pts[0][0], ly = pts[0][1];
  for (let i = 1; i < pts.length; i++) { const f = Math.min(1, Math.max(0, prog - (i - 1))); if (f <= 0) break; lx = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f; ly = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f; g.lineTo(w * lx, h * ly); }
  g.stroke(); g.fillStyle = "#ff5a8a"; g.beginPath(); g.arc(w * lx, h * ly, w * 0.035, 0, Math.PI * 2); g.fill();
};
// shot 9: a big question mark
export const questionDraw: Draw = (g, t, w, h) => {
  g.clearRect(0, 0, w, h); g.fillStyle = "rgba(20,16,42,0.0)"; g.fillRect(0, 0, w, h);
  const k = 1 + 0.05 * Math.sin(t * 4); g.save(); g.translate(w / 2, h / 2); g.scale(k, k);
  g.fillStyle = "#ffd27a"; g.shadowColor = "#ffb040"; g.shadowBlur = w * 0.08; g.font = `900 ${h * 0.9}px Arial`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("?", 0, 0); g.restore();
};
// shot 10: the paper being written on
export const paperDraw: Draw = (g, t, w, h) => {
  g.clearRect(0, 0, w, h); g.fillStyle = "#f4f2ea"; g.fillRect(0, 0, w, h);
  g.strokeStyle = "#c8c4b8"; g.lineWidth = 3; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(w * 0.08, h * (0.16 + i * 0.09)); g.lineTo(w * 0.92, h * (0.16 + i * 0.09)); g.stroke(); }
  const r = rng(11); g.strokeStyle = "#2a3a8a"; g.lineWidth = w * 0.012; g.lineCap = "round";
  const total = 6; const prog = Math.min(total, t * 1.6);
  for (let i = 0; i < total; i++) { const f = Math.min(1, Math.max(0, prog - i)); if (f <= 0) break; const y = h * (0.14 + i * 0.09), len = (0.4 + r() * 0.4) * f; g.beginPath(); g.moveTo(w * 0.1, y); for (let k = 1; k <= 14; k++) g.lineTo(w * (0.1 + (len * k) / 14), y - h * 0.012 * Math.sin(k * 2.2 + i)); g.stroke(); }
};
// shot 11: ten minutes, counting down
export const timerDraw: Draw = (g, t, w, h) => {
  card(g, w, h, "#10203a", "#7fd0ff");
  const sec = Math.max(0, 600 - Math.floor(t * 40));
  const mm = Math.floor(sec / 60), ss = sec % 60;
  g.strokeStyle = "#274a7a"; g.lineWidth = w * 0.06; g.beginPath(); g.arc(w / 2, h / 2, w * 0.34, 0, Math.PI * 2); g.stroke();
  g.strokeStyle = "#7fe0ff"; g.lineCap = "round"; g.beginPath(); g.arc(w / 2, h / 2, w * 0.34, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * sec) / 600); g.stroke();
  g.fillStyle = "#ffffff"; g.font = `900 ${w * 0.2}px Arial`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(`${mm}:${String(ss).padStart(2, "0")}`, w / 2, h / 2);
};
// numbered step badge
export const badge = (n: number): Draw => (g, t, w, h) => {
  g.clearRect(0, 0, w, h); const k = 1 + 0.06 * Math.sin(t * 5); g.save(); g.translate(w / 2, h / 2); g.scale(k, k);
  g.fillStyle = "#ffd27a"; g.beginPath(); g.arc(0, 0, w * 0.44, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#2a1a40"; g.font = `900 ${w * 0.6}px Arial`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(n), 0, w * 0.03); g.restore();
};
// shot 14: a wall clock stuck at three in the morning
export const clockDraw: Draw = (g, t, w, h) => {
  g.clearRect(0, 0, w, h); const cx = w / 2, cy = h / 2, R = w * 0.46;
  g.fillStyle = "#f4f2ea"; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill();
  g.strokeStyle = "#2a1a40"; g.lineWidth = w * 0.03; g.stroke();
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; g.beginPath(); g.moveTo(cx + Math.cos(a) * R * 0.82, cy + Math.sin(a) * R * 0.82); g.lineTo(cx + Math.cos(a) * R * 0.94, cy + Math.sin(a) * R * 0.94); g.stroke(); }
  g.lineCap = "round"; g.lineWidth = w * 0.035; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + R * 0.5, cy); g.stroke();   // hour hand at 3
  g.lineWidth = w * 0.022; const a = -Math.PI / 2 + t * 0.2; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * R * 0.78, cy + Math.sin(a) * R * 0.78); g.stroke();
};

export const Room: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const sky = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 512; c.height = 512; const g = c.getContext("2d")!; const r = rng(31);
    const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, "#0a0e2e"); gr.addColorStop(1, "#3a3f8f"); g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.6})`; g.fillRect(r() * 512, r() * 400, 2, 2); }
    g.fillStyle = "#f4efd8"; g.beginPath(); g.arc(340, 150, 62, 0, Math.PI * 2); g.fill();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, []);
  return (
    <group>
      <Ground map={painted("#3a3350", [6, 6], 700)} size={60} />
      <Box size={[20, 7, 0.4]} pos={[0, 3.5, -6.2]} map={painted("#3e3868", [5, 2], 600)} />
      <Box size={[0.4, 7, 16]} pos={[-10, 3.5, 1.8]} map={painted("#363060", [4, 2], 600)} />
      <Box size={[0.4, 7, 16]} pos={[10, 3.5, 1.8]} map={painted("#363060", [4, 2], 600)} />
      <Box size={[20, 0.4, 16]} pos={[0, 7.2, 1.8]} color="#201a3a" />
      {/* window with the moon */}
      <mesh position={[-0.3, 3.6, -5.98]}><planeGeometry args={[3.4, 3.4]} /><meshBasicMaterial map={sky} fog={false} /></mesh>
      <Box size={[3.7, 0.14, 0.14]} pos={[-0.3, 5.35, -5.95]} color="#1a1630" />
      <Box size={[3.7, 0.14, 0.2]} pos={[-0.3, 1.88, -5.9]} color="#1a1630" />
      <Box size={[0.14, 3.6, 0.14]} pos={[-2.1, 3.6, -5.95]} color="#1a1630" />
      <Box size={[0.14, 3.6, 0.14]} pos={[1.5, 3.6, -5.95]} color="#1a1630" />
      <Box size={[0.1, 3.4, 0.1]} pos={[-0.3, 3.6, -5.95]} color="#1a1630" />
      <pointLight position={[-0.3, 4, -4.5]} intensity={8} distance={12} decay={2} color="#8f9fff" />
      {/* bed */}
      <Box size={[3.4, 0.5, 4.2]} pos={[-5.2, 0.25, -3.7]} color="#4a3a5a" />
      <Box size={[3.2, 0.32, 4.0]} pos={[-5.2, 0.66, -3.7]} color="#bdb4e6" />
      <Box size={[3.2, 0.22, 2.6]} pos={[-5.2, 0.9, -2.9]} color="#6a5aa8" />
      <Box size={[1.3, 0.28, 0.8]} pos={[-5.2, 0.92, -5.4]} color="#e8e4f4" />
      <Box size={[3.4, 1.5, 0.2]} pos={[-5.2, 0.85, -5.9]} color="#3a2e4a" />
      {/* nightstand with the phone and a lamp */}
      <Box size={[1.1, 0.95, 0.9]} pos={[-2.5, 0.48, -5.3]} color="#4a3a5a" />
      <Box size={[0.62, 1.04, 0.06]} pos={[-2.2, 1.47, -5.05]} color="#10121a" />
      <DrawPanel pos={[-2.2, 1.47, -5.016]} w={0.54} h={0.96} draw={phoneDraw} px={400} />
      <Cyl r={0.12} h={0.5} pos={[-2.85, 1.2, -5.3]} color="#d8c8a8" />
      <Box size={[0.4, 0.3, 0.4]} pos={[-2.85, 1.58, -5.3]} color="#ffd9a0" emissive="#ffbf70" emissiveIntensity={1.0} />
      <pointLight position={[-2.85, 1.7, -4.9]} intensity={10} distance={6} decay={2} color="#ffbf7a" />
      {/* desk corner */}
      <Box size={[3.2, 0.12, 1.5]} pos={[3.4, 0.94, -4.8]} map={planks("#5a4636", [2, 1])} />
      <Box size={[0.12, 0.9, 1.3]} pos={[1.9, 0.45, -4.8]} color="#2a2430" />
      <Box size={[0.12, 0.9, 1.3]} pos={[4.9, 0.45, -4.8]} color="#2a2430" />
      <Cyl r={0.09} h={0.16} pos={[4.4, 1.08, -4.4]} color="#f0ece4" rough={0.4} />
      <Box size={[0.3, 0.06, 0.3]} pos={[2.5, 1.02, -4.3]} color="#2a2430" />
      <pointLight position={[3.4, 2.2, -3.6]} intensity={9} distance={7} decay={2} color="#ffbf7a" />
      {/* the door the hero walks out of (right wall) */}
      <Box size={[0.12, 3.2, 1.8]} pos={[9.8, 1.6, -2.4]} color="#fff0c8" emissive="#ffe0a0" emissiveIntensity={1.4} shadow={false} />
      <pointLight position={[9.2, 1.8, -2.4]} intensity={14} distance={9} decay={2} color="#ffd890" />
      {children}
    </group>
  );
};

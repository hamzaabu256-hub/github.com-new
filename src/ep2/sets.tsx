// Episode 2 (Goodchaos): a night-time open-plan office. Three monitors on the hero's desk (the screens are drawn live:
// chat, spinner, error, blank, email, code, counter, subscribe), a big window onto a city at night, background desks.
import React, { useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Box, Cyl, Ground } from "../engine/kit";
import { painted, planks, rng } from "../engine/tex";
import type { Look, V3 } from "../engine/Stage";

export const officeLook = (): Look => ({
  fog: "#0f1330", fogNear: 14, fogFar: 42,
  sun: { pos: [2, 9, 7], color: "#9fb0ff", intensity: 0.55, shadow: 14 },
  hemi: { sky: "#6f82d8", ground: "#3a2a5a", intensity: 0.62 },
  ambient: 0.12, exposure: 1.4, aperture: 0.5, warm: "#ffae5a", cool: "#4b46d8", vignette: 0.6, saturation: 1.2,
});
// the same room when everything is going wrong: redder shadows
export const alarmLook = (): Look => ({ ...officeLook(), hemi: { sky: "#d86f7f", ground: "#5a2a3a", intensity: 0.6 }, cool: "#c8464b", exposure: 1.35 });

export type ScreenKind = "off" | "chat" | "spinner" | "error" | "blank" | "email" | "code" | "count" | "subscribe";
const SW = 512, SH = 320;

const drawScreen = (g: CanvasRenderingContext2D, kind: ScreenKind, t: number) => {
  g.clearRect(0, 0, SW, SH);
  const blink = Math.floor(t * 2) % 2 === 0;
  g.textAlign = "center"; g.textBaseline = "middle";
  if (kind === "off") { g.fillStyle = "#05060c"; g.fillRect(0, 0, SW, SH); return; }
  if (kind === "blank") { g.fillStyle = "#0b0f1f"; g.fillRect(0, 0, SW, SH); if (blink) { g.fillStyle = "#9fb0ff"; g.fillRect(40, 50, 14, 30); } return; }
  if (kind === "chat") {
    g.fillStyle = "#12172e"; g.fillRect(0, 0, SW, SH);
    g.fillStyle = "#2c3a6b"; g.fillRect(30, 28, 300, 54); g.fillRect(30, 100, 220, 54);
    g.fillStyle = "#3d7a5a"; g.fillRect(190, 172, 290, 54);
    g.fillStyle = "#9fb0ff"; for (let i = 0; i < 2; i++) g.fillRect(48, 44 + i * 72, 200 - i * 40, 10);
    g.fillStyle = "#d8ffe8"; g.fillRect(210, 190, 220, 10);
    g.fillStyle = "#1d2547"; g.fillRect(24, 262, 464, 40);
    g.fillStyle = "#6f8cff"; g.fillRect(40, 278, 140, 8); if (blink) g.fillRect(190, 272, 6, 20);
    return;
  }
  if (kind === "spinner") {
    g.fillStyle = "#12172e"; g.fillRect(0, 0, SW, SH);
    g.lineWidth = 16; g.lineCap = "round"; g.strokeStyle = "#2c3a6b"; g.beginPath(); g.arc(256, 135, 54, 0, Math.PI * 2); g.stroke();
    const a = t * 6; g.strokeStyle = "#8fa6ff"; g.beginPath(); g.arc(256, 135, 54, a, a + Math.PI * 1.3); g.stroke();
    g.fillStyle = "#9fb0ff"; g.font = "700 30px Arial"; g.fillText("Loading...", 256, 245);
    return;
  }
  if (kind === "error") {
    g.fillStyle = "#2a0f16"; g.fillRect(0, 0, SW, SH);
    g.fillStyle = "#ff4a5a"; g.beginPath(); g.arc(256, 112, 60, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#2a0f16"; g.font = "900 90px Arial"; g.fillText("!", 256, 118);
    g.fillStyle = "#ffd0d6"; g.font = "700 30px Arial"; g.fillText("Service unavailable", 256, 222);
    g.fillStyle = "#ff8a96"; g.font = "600 22px Arial"; g.fillText("Please try again later", 256, 262);
    return;
  }
  if (kind === "email") {
    g.fillStyle = "#f2f2ee"; g.fillRect(0, 0, SW, SH);
    g.fillStyle = "#d4d4cc"; g.fillRect(0, 0, SW, 40);
    g.fillStyle = "#8a8a84"; g.fillRect(24, 16, 120, 8);
    g.fillStyle = "#c8c8c0"; g.fillRect(24, 64, 460, 3); g.fillRect(24, 100, 460, 3);
    g.fillStyle = "#555"; g.fillRect(24, 54, 70, 8); g.fillRect(24, 90, 110, 8);
    if (blink) { g.fillStyle = "#222"; g.fillRect(28, 130, 4, 30); }
    return;
  }
  if (kind === "code") {
    g.fillStyle = "#101420"; g.fillRect(0, 0, SW, SH);
    const r = rng(5); const cols = ["#7fd0ff", "#ff9ac8", "#c8f08a", "#ffd27a", "#b39cff"];
    for (let i = 0; i < 12; i++) { g.fillStyle = cols[i % 5]; g.fillRect(30 + (i % 3) * 28, 24 + i * 22, 60 + r() * 220, 9); }
    return;
  }
  if (kind === "count") {
    g.fillStyle = "#2a0f16"; g.fillRect(0, 0, SW, SH);
    const n = Math.round(35000 * Math.min(1, t / 1.6));
    g.fillStyle = "#ff6a78"; g.font = "900 96px Arial"; g.fillText(n.toLocaleString("en-US"), 256, 120);
    g.fillStyle = "#ffd0d6"; g.font = "700 34px Arial"; g.fillText("problems reported", 256, 210);
    return;
  }
  if (kind === "subscribe") {
    g.fillStyle = "#12172e"; g.fillRect(0, 0, SW, SH);
    const k = 1 + 0.04 * Math.sin(t * 6);
    g.save(); g.translate(256, 150); g.scale(k, k);
    g.fillStyle = "#e02a3a"; g.fillRect(-190, -52, 380, 104);
    g.fillStyle = "#ffffff"; g.font = "900 54px Arial"; g.fillText("SUBSCRIBE", 0, 4);
    g.restore();
    g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(330, 190); g.lineTo(330, 250); g.lineTo(346, 236); g.lineTo(360, 266); g.lineTo(372, 260); g.lineTo(358, 230); g.lineTo(380, 228); g.closePath(); g.fill();
  }
};

const useScreen = (kind: ScreenKind) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const o = useMemo(() => {
    const c = document.createElement("canvas"); c.width = SW; c.height = SH;
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    return { g: c.getContext("2d")!, tex };
  }, []);
  drawScreen(o.g, kind, frame / fps); o.tex.needsUpdate = true;
  return o.tex;
};

const GLOW: Record<ScreenKind, string> = { off: "#222222", chat: "#7f9bff", spinner: "#7f9bff", error: "#ff4a5a", blank: "#4a5aa0", email: "#ffffff", code: "#7fd0ff", count: "#ff4a5a", subscribe: "#ff5a6a" };

export const Monitor: React.FC<{ pos: V3; kind: ScreenKind; w?: number; light?: boolean; rotY?: number }> = ({ pos, kind, w = 1.5, light = true, rotY = 0 }) => {
  const tex = useScreen(kind); const h = w * 0.625; const cy = h / 2 + 0.5;
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <Box size={[w + 0.14, h + 0.14, 0.1]} pos={[0, cy, 0]} color="#14161d" />
      <mesh position={[0, cy, 0.056]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} fog={false} />
      </mesh>
      <Cyl r={0.06} h={0.45} pos={[0, 0.27, -0.05]} color="#14161d" />
      <Box size={[0.6, 0.05, 0.4]} pos={[0, 0.03, 0]} color="#14161d" />
      {light && kind !== "off" ? <pointLight position={[0, cy, 1.1]} intensity={5} distance={5} decay={2} color={GLOW[kind]} /> : null}
    </group>
  );
};

let cityCache: THREE.Texture | null = null;
const cityTex = () => {
  if (cityCache) return cityCache;
  const c = document.createElement("canvas"); c.width = 1024; c.height = 400; const g = c.getContext("2d")!; const r = rng(77);
  const sky = g.createLinearGradient(0, 0, 0, 400); sky.addColorStop(0, "#0a0e2e"); sky.addColorStop(1, "#3a3f8f");
  g.fillStyle = sky; g.fillRect(0, 0, 1024, 400);
  for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.6})`; g.fillRect(r() * 1024, r() * 160, 2, 2); }
  g.fillStyle = "#f4efd8"; g.beginPath(); g.arc(840, 80, 34, 0, Math.PI * 2); g.fill();
  for (let layer = 0; layer < 2; layer++) {
    let x = -20;
    while (x < 1044) {
      const w = 50 + r() * 80, h = 90 + r() * 200 + layer * 20; const top = 400 - h;
      g.fillStyle = layer ? "#141a3e" : "#0c1130"; g.fillRect(x, top, w, h);
      for (let wy = top + 12; wy < 392; wy += 18) for (let wx = x + 8; wx < x + w - 10; wx += 16) {
        if (r() < 0.42) { g.fillStyle = r() < 0.8 ? "#ffd27a" : "#9fd0ff"; g.fillRect(wx, wy, 7, 9); }
      }
      x += w + 4 + r() * 10;
    }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; cityCache = t; return t;
};

export const Office: React.FC<{ screens?: [ScreenKind, ScreenKind, ScreenKind]; bgScreens?: ScreenKind; children?: React.ReactNode }> = ({ screens = ["chat", "chat", "chat"], bgScreens = "blank", children }) => {
  const city = cityTex();
  const bgDesks = [-5.2, -7.6, 6.4, 8.0];
  return (
    <group>
      <Ground map={painted("#2b3050", [6, 6], 700)} size={60} />
      {/* walls + ceiling */}
      <Box size={[18, 7, 0.4]} pos={[0, 3.5, -6.2]} map={painted("#38426e", [5, 2], 600)} />
      <Box size={[0.4, 7, 16]} pos={[-9, 3.5, 1.8]} map={painted("#323a63", [4, 2], 600)} />
      <Box size={[0.4, 7, 16]} pos={[9, 3.5, 1.8]} map={painted("#323a63", [4, 2], 600)} />
      <Box size={[18, 0.4, 16]} pos={[0, 7.2, 1.8]} color="#202440" />
      {[-5, 0, 5].map((x) => <Box key={"cl" + x} size={[2.4, 0.06, 0.7]} pos={[x, 6.95, -1]} color="#dfe6ff" emissive="#cfd8ff" emissiveIntensity={0.9} shadow={false} />)}
      {/* window onto the city */}
      <mesh position={[0, 3.9, -5.98]}><planeGeometry args={[9, 3.6]} /><meshBasicMaterial map={city} fog={false} /></mesh>
      <Box size={[9.3, 0.15, 0.15]} pos={[0, 5.75, -5.95]} color="#1a1d30" />
      <Box size={[9.3, 0.15, 0.2]} pos={[0, 2.05, -5.9]} color="#1a1d30" />
      <Box size={[0.15, 3.8, 0.15]} pos={[-4.6, 3.9, -5.95]} color="#1a1d30" />
      <Box size={[0.15, 3.8, 0.15]} pos={[4.6, 3.9, -5.95]} color="#1a1d30" />
      <Box size={[0.1, 3.6, 0.1]} pos={[-1.5, 3.9, -5.95]} color="#1a1d30" />
      <Box size={[0.1, 3.6, 0.1]} pos={[1.5, 3.9, -5.95]} color="#1a1d30" />
      <pointLight position={[0, 4, -4]} intensity={9} distance={14} decay={2} color="#7f94ff" />
      {/* the hero's desk (centre x = 1.55) with three monitors */}
      <Box size={[4.8, 0.12, 1.5]} pos={[1.55, 0.94, -2.4]} map={planks("#5a4636", [2, 1])} />
      {[-0.7, 3.8].map((x) => <Box key={"lg" + x} size={[0.12, 0.9, 1.3]} pos={[x, 0.45, -2.4]} color="#2a2430" />)}
      <Box size={[0.8, 0.7, 1.2]} pos={[3.2, 0.5, -2.4]} color="#3a3248" />
      <Monitor pos={[0.0, 1.0, -2.75]} kind={screens[0]} />
      <Monitor pos={[1.55, 1.0, -2.75]} kind={screens[1]} />
      <Monitor pos={[3.1, 1.0, -2.75]} kind={screens[2]} />
      <Box size={[1.1, 0.04, 0.36]} pos={[1.2, 1.02, -2.05]} color="#1c1e28" />
      <Cyl r={0.09} h={0.16} pos={[2.5, 1.08, -2.0]} color="#f0ece4" rough={0.4} />
      <Cyl r={0.15} h={0.04} pos={[3.4, 1.02, -2.2]} color="#1c1e28" />
      <Box size={[0.07, 0.8, 0.07]} pos={[3.4, 1.42, -2.2]} color="#1c1e28" />
      <Box size={[0.45, 0.1, 0.3]} pos={[3.4, 1.86, -2.2]} color="#e8b04a" emissive="#ffbf5a" emissiveIntensity={1.2} />
      <pointLight position={[3.4, 1.75, -1.9]} intensity={12} distance={6} decay={2} color="#ffbf7a" />
      {/* an office chair pushed aside */}
      <Cyl r={0.05} h={0.5} pos={[4.6, 0.28, -0.9]} color="#1c1e28" />
      <Cyl r={0.36} h={0.06} pos={[4.6, 0.04, -0.9]} color="#1c1e28" />
      <Box size={[0.8, 0.1, 0.8]} pos={[4.6, 0.55, -0.9]} color="#2a2f48" />
      <Box size={[0.8, 0.9, 0.1]} pos={[4.6, 1.05, -1.3]} color="#2a2f48" />
      {/* background desks with dim monitors */}
      {bgDesks.map((x, i) => (
        <group key={"bd" + i}>
          <Box size={[2.4, 0.1, 1.2]} pos={[x, 0.94, -4.4]} map={planks("#4a3a30", [2, 1])} />
          <Box size={[0.1, 0.9, 1.0]} pos={[x - 1.1, 0.45, -4.4]} color="#2a2430" />
          <Box size={[0.1, 0.9, 1.0]} pos={[x + 1.1, 0.45, -4.4]} color="#2a2430" />
          <Monitor pos={[x, 1.0, -4.55]} kind={i === 0 ? "code" : bgScreens} w={1.3} light={false} />
        </group>
      ))}
      {/* plant */}
      <Cyl r={0.28} h={0.5} pos={[-3.2, 0.25, -3.0]} color="#8a4a3a" />
      {[0.9, 1.25, 1.55].map((y, i) => (
        <mesh key={"pl" + i} position={[-3.2 + (i - 1) * 0.12, y, -3.0]} castShadow><sphereGeometry args={[0.42 - i * 0.07, 12, 10]} /><meshStandardMaterial color="#3f7a4a" roughness={1} /></mesh>
      ))}
      {children}
    </group>
  );
};

// Glowing wall signs (self-lit so the text stays readable in the dark office)
const NeonSign: React.FC<{ lines: string[]; pos: V3; w: number; h: number; color: string; bg?: string }> = ({ lines, pos, w, h, color, bg = "#14122a" }) => {
  const tex = useMemo(() => {
    const W = 1024, H = Math.round((1024 * h) / w);
    const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d")!;
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = color; g.lineWidth = 14; g.strokeRect(20, 20, W - 40, H - 40);
    g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = color;
    let fs = Math.min(150, ((H - 90) / lines.length) * 0.82);
    g.font = `900 ${fs}px Arial`;
    const widest = Math.max(...lines.map((l) => g.measureText(l).width));
    if (widest > W - 120) { fs = (fs * (W - 120)) / widest; g.font = `900 ${fs}px Arial`; }
    g.shadowColor = color; g.shadowBlur = 24;
    lines.forEach((l, i) => g.fillText(l, W / 2, H / 2 + (i - (lines.length - 1) / 2) * fs * 1.18));
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, [lines.join("|"), color, bg, w, h]);
  return (
    <mesh position={pos}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} fog={false} />
    </mesh>
  );
};
export const BrainSign: React.FC = () => <NeonSign lines={["BRAIN", "FOR RENT", "LANDLORD", "OFFLINE"]} pos={[-6.2, 3.7, -5.9]} w={2.6} h={1.7} color="#ffd27a" />;
export const SurvivedSign: React.FC = () => <NeonSign lines={["ICE AGES", "PLAGUES", "DIAL-UP", "SURVIVED"]} pos={[6.8, 3.7, -5.9]} w={2.4} h={1.6} color="#9fffc8" bg="#0f2018" />;
export const LogoSign: React.FC = () => <NeonSign lines={["GOODCHAOS"]} pos={[0, 5.0, -5.8]} w={5} h={1.1} color="#ff6a7a" />;

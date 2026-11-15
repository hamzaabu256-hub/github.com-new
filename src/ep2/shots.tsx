// Episode 2 (Goodchaos) shot list: one entry per voice line (episodes/ep2/shots.json).
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { CamKeys, Look } from "../engine/Stage";
import { Toon } from "../engine/Toon";
import { Office, officeLook, alarmLook, BrainSign, SurvivedSign, LogoSign } from "./sets";
import type { ScreenKind } from "./sets";
import { C } from "./cast";

export type Shot = { look: Look; cam: CamKeys; focus: number; Body: React.FC<{ dur: number }> };
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };
const B = (fn: (t: number, dur: number) => React.ReactNode): React.FC<{ dur: number }> => ({ dur }) => { const t = useT(); return <>{fn(t, dur)}</>; };

const calm = officeLook();
const alarm = alarmLook();
type S3 = [ScreenKind, ScreenKind, ScreenKind];
const ERR: S3 = ["error", "error", "error"];
const HERO: [number, number, number] = [-1.2, 0, -1.5]; // the worker's spot, left of the desk

export const SHOTS: Record<number, Shot> = {
  // 1 "ChatGPT, Claude and Grok all crashed at the same time."  (three monitors go from chat to error)
  1: { look: calm, focus: 9, cam: { from: [1.55, 2.5, 9.4], to: [1.55, 2.1, 6.8], lookFrom: [1.55, 1.8, -2.7], fov: 50 },
    Body: B((t) => <Office screens={t < 1.3 ? ["chat", "chat", "chat"] : ERR} />) },
  // 2 "On September third. All three."  (pan across the three dead screens)
  2: { look: alarm, focus: 4, cam: { from: [0.2, 1.9, 1.3], to: [3.0, 1.9, 1.3], lookFrom: [0.0, 1.8, -2.7], lookTo: [3.1, 1.8, -2.7], fov: 50, ease: "linear" },
    Body: B(() => <Office screens={ERR} />) },
  // 3 "And suddenly, humanity had to use its own brain."
  3: { look: calm, focus: 3.0, cam: { from: [-0.8, 1.6, 2.1], to: [-1.1, 1.6, 1.3], lookFrom: [-1.0, 1.35, -1.5], fov: 45 },
    Body: B(() => (
      <Office screens={ERR}>
        <Toon spec={C.worker} pose={{ eyes: "wide", mouth: "o", armL: "shrug", armR: "shrug" }} pos={HERO} />
      </Office>
    )) },
  // 4 "Over thirty-five thousand people in America reported ChatGPT problems."  (a counter on the middle screen)
  4: { look: alarm, focus: 4.3, cam: { from: [1.55, 1.9, 2.3], to: [1.55, 1.95, 1.6], lookFrom: [1.55, 1.75, -2.7], fov: 48 },
    Body: B(() => <Office screens={["error", "count", "error"]} />) },
  // 5 "Not a war. Not a flood. Just a loading spinner."
  5: { look: calm, focus: 3.0, cam: { from: [1.55, 1.9, 1.8], to: [1.55, 1.9, 0.7], lookFrom: [1.55, 1.85, -2.7], fov: 46 },
    Body: B(() => <Office screens={["spinner", "spinner", "spinner"]} />) },
  // 6 "Picture one of them, staring at a blank screen."
  6: { look: calm, focus: 3.8, cam: { from: [-2.2, 1.5, 2.6], to: [-1.9, 1.55, 2.0], lookFrom: [-1.0, 1.4, -1.5], fov: 48 },
    Body: B(() => (
      <Office screens={["blank", "blank", "blank"]}>
        <Toon spec={C.worker} pose={{ eyes: "half", mouth: "flat", armL: "down", armR: "down" }} pos={HERO} />
      </Office>
    )) },
  // 7 "He has an email to write. He opens the chat. Nothing."
  7: { look: calm, focus: 4.2, cam: { from: [0.4, 1.8, 1.4], to: [1.0, 1.8, 0.9], lookFrom: [1.0, 1.8, -2.7], fov: 46 },
    Body: B((t) => <Office screens={["email", t < 1.6 ? "chat" : "spinner", "blank"]} />) },
  // 8 "He tries again. Nothing. He tries a third time, like that changes anything."
  8: { look: calm, focus: 3.1, cam: { from: [-0.6, 1.6, 1.6], to: [-0.9, 1.6, 1.2], lookFrom: [-1.1, 1.4, -1.5], fov: 46 },
    Body: B((t) => (
      <Office screens={["email", "spinner", "blank"]}>
        <Toon spec={C.worker} pose={{ eyes: t < 2 ? "half" : "angry", mouth: "frown", armR: "point", armL: "down" }} pos={HERO} />
      </Office>
    )) },
  // 9 "Somewhere, a developer remembers that code used to be typed by hand."
  9: { look: calm, focus: 3.8, cam: { from: [-3.6, 1.5, 1.2], to: [-4.2, 1.55, 0.6], lookFrom: [-5.0, 1.2, -2.6], fov: 48 },
    Body: B(() => (
      <Office screens={ERR} bgScreens="code">
        <Toon spec={C.dev} pose={{ eyes: "wide", mouth: "o", armL: "hold", armR: "hold" }} pos={[-5.0, 0, -2.6]} seed={2} />
      </Office>
    )) },
  // 10 "Meanwhile, the internet did what it does best."  (wide, the city outside)
  10: { look: calm, focus: 11, cam: { from: [0, 3.2, 9.0], to: [0, 2.7, 7.2], lookFrom: [0, 2.6, -3.0], fov: 52 },
    Body: B(() => <Office screens={ERR} />) },
  // 11 "It joked. If you rent your brain, what happens when the landlord goes offline?"
  11: { look: calm, focus: 6.2, cam: { from: [-5.5, 2.6, 1.5], to: [-5.9, 3.0, -0.3], lookFrom: [-6.2, 3.6, -6], fov: 50 },
    Body: B(() => <Office screens={ERR}><BrainSign /></Office>) },
  // 12 "Then the servers came back."
  12: { look: calm, focus: 5.0, cam: { from: [-0.2, 1.8, 4.0], to: [-0.6, 1.75, 3.2], lookFrom: [-0.4, 1.5, -2.0], fov: 50 },
    Body: B(() => (
      <Office screens={["chat", "chat", "chat"]}>
        <Toon spec={C.worker} pose={{ eyes: "happy", mouth: "grin", armL: "up", armR: "up" }} pos={HERO} />
      </Office>
    )) },
  // 13 "And we ran straight to them. Like nothing happened."
  13: { look: calm, focus: 3.9, cam: { from: [-2.6, 1.4, 3.4], to: [-1.0, 1.5, 2.4], lookFrom: [-3.0, 1.1, -0.2], lookTo: [-1.2, 1.1, -1.5], fov: 50 },
    Body: B(() => (
      <Office screens={["chat", "chat", "chat"]}>
        <Toon spec={C.worker} pose={{ eyes: "happy", mouth: "grin", armR: "wave", armL: "down" }} pos={HERO} path={{ from: [-3.6, 0, 0.2], to: [-1.2, 0, -1.5], start: 0, end: 1.8 }} />
      </Office>
    )) },
  // 14 "Humanity survived ice ages, plagues, and dial-up."
  14: { look: calm, focus: 6.0, cam: { from: [6.0, 2.9, 0.0], to: [6.5, 3.1, -1.4], lookFrom: [6.8, 3.7, -6], fov: 50 },
    Body: B(() => <Office screens={["chat", "chat", "chat"]}><SurvivedSign /></Office>) },
  // 15 "But one outage? Chaos."  (the screens flicker, everyone shakes)
  15: { look: alarm, focus: 3.0, cam: { from: [-0.6, 1.7, 1.9], to: [-1.0, 1.7, 1.4], lookFrom: [-1.1, 1.4, -1.5], fov: 46 },
    Body: B((t) => {
      const k: ScreenKind = Math.floor(t * 6) % 2 ? "error" : "blank";
      return (
        <Office screens={[k, "error", k]}>
          <Toon spec={C.worker} pose={{ eyes: "wide", mouth: "o", armL: "up", armR: "up", shiver: true }} pos={HERO} />
        </Office>
      );
    }) },
  // 16 "You see, we didn't lose a tool. We lost our excuse to think."
  16: { look: calm, focus: 2.6, cam: { from: [-0.7, 1.6, 1.7], to: [-1.0, 1.65, 1.0], lookFrom: [-1.1, 1.4, -1.5], fov: 44 },
    Body: B(() => (
      <Office screens={["blank", "blank", "blank"]}>
        <Toon spec={C.worker} pose={{ eyes: "half", mouth: "smile", armL: "hips", armR: "hips" }} pos={HERO} />
      </Office>
    )) },
  // 17 "Subscribe to Goodchaos, before your brain regrets it."
  17: { look: calm, focus: 5.5, cam: { from: [-0.2, 1.8, 3.8], to: [-0.2, 1.75, 3.0], lookFrom: [-0.2, 2.2, -2.0], fov: 52 },
    Body: B(() => (
      <Office screens={["subscribe", "chat", "chat"]}>
        <LogoSign />
        <Toon spec={C.worker} pose={{ eyes: "happy", mouth: "grin", armR: "wave", armL: "point" }} pos={[-0.9, 0, -1.4]} />
      </Office>
    )) },
};

// Episode 3 (Asrar Al-Nafs: overthinking). One entry per recorded line (episodes/ep3/shots.json).
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { CamKeys, Look } from "../engine/Stage";
import { Toon } from "../engine/Toon";
import { Room, DrawPanel, nightLook, calmLook, loopDraw, searchDraw, deadEndDraw, chartDraw, questionDraw, paperDraw, timerDraw, badge, clockDraw } from "./sets";
import { C } from "./cast";

export type Shot = { look: Look; cam: CamKeys; focus: number; Body: React.FC<{ dur: number }> };
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };
const B = (fn: (t: number, dur: number) => React.ReactNode): React.FC<{ dur: number }> => ({ dur }) => { const t = useT(); return <>{fn(t, dur)}</>; };

const night = nightLook();
const calm = calmLook();
const HERO: [number, number, number] = [-1.1, 0, -2.4];
const MIND: [number, number, number] = [0.2, 0, -2.4];
const WALL: [number, number, number] = [0, 3.0, -5.7];
const panelCam = (dx: number): CamKeys => ({ from: [dx, 2.8, 2.6], to: [-dx, 2.9, 1.5], lookFrom: [0, 3.0, -5.7], fov: 50 });

export const SHOTS: Record<number, Shot> = {
  // 1 "أرسلتَ رسالة… ثم قرأتَها عشر مرات؟"  (the phone, the read counter climbing to 10)
  1: { look: night, focus: 2.2, cam: { from: [-1.2, 1.6, -2.4], to: [-2.0, 1.5, -3.2], lookFrom: [-2.2, 1.45, -5.0], fov: 40 }, Body: B(() => <Room />) },
  // 2 "لا، هذا ليس غباءً."
  2: { look: night, focus: 2.8, cam: { from: [0.2, 1.6, 0.6], to: [-0.4, 1.6, -0.1], lookFrom: [-1.0, 1.3, -2.4], fov: 46 },
    Body: B(() => <Room><Toon spec={C.hero} pose={{ eyes: "happy", mouth: "smile", armL: "shrug", armR: "shrug" }} pos={HERO} /></Room>) },
  // 3 "اسمه الاجترار الذهني."  (a spiral that keeps turning)
  3: { look: night, focus: 7.5, cam: panelCam(0), Body: B(() => <Room><DrawPanel pos={WALL} w={3} h={3} draw={loopDraw} px={640} /></Room>) },
  // 4 "أن يعيد عقلك الفكرة نفسها مرارًا وتكرارًا."  (a thought bubble around the head)
  4: { look: night, focus: 3.6, cam: { from: [0.6, 2.0, 1.4], to: [0.0, 2.0, 0.9], lookFrom: [-0.7, 2.1, -2.4], fov: 50 },
    Body: B(() => (
      <Room>
        <Toon spec={C.hero} pose={{ eyes: "wide", mouth: "o", armL: "down", armR: "down" }} pos={HERO} />
        {[[-0.95, 2.15, 0.08], [-0.8, 2.35, 0.12], [-0.62, 2.6, 0.16]].map((p, i) => (
          <mesh key={"d" + i} position={[p[0], p[1], -2.4]}><sphereGeometry args={[p[2], 12, 10]} /><meshBasicMaterial color="#ffd0ec" /></mesh>
        ))}
        <DrawPanel pos={[-0.45, 3.15, -2.4]} w={1.3} h={1.3} draw={loopDraw} px={400} />
      </Room>
    )) },
  // 5 "يظن أنه يبحث عن حل،"
  5: { look: night, focus: 7.5, cam: panelCam(0.3), Body: B(() => <Room><DrawPanel pos={WALL} w={3} h={3} draw={searchDraw} px={640} /></Room>) },
  // 6 "لكنه لا يصل إلى شيء."
  6: { look: night, focus: 7.5, cam: panelCam(-0.3), Body: B(() => <Room><DrawPanel pos={WALL} w={3} h={3} draw={deadEndDraw} px={640} /></Room>) },
  // 7 "وتربط أبحاث كثيرة هذا الدوران بزيادة القلق والحزن."  (the rising line)
  7: { look: night, focus: 7.5, cam: panelCam(0), Body: B(() => <Room><DrawPanel pos={WALL} w={3.4} h={2.4} draw={chartDraw} px={640} /></Room>) },
  // 8 "فعقلك يظن أنه يحميك، وهو في الحقيقة يرهقك."  (the tiny employee salutes, the person is exhausted)
  8: { look: night, focus: 4.4, cam: { from: [-0.5, 1.3, 2.3], to: [-0.5, 1.25, 1.9], lookFrom: [-0.5, 0.95, -2.4], fov: 50 },
    Body: B(() => (
      <Room>
        <Toon spec={C.hero} pose={{ eyes: "half", mouth: "frown", armL: "down", armR: "down" }} pos={HERO} />
        <Toon spec={C.mind} pose={{ eyes: "wide", mouth: "grin", armR: "up", armL: "down" }} pos={MIND} h={1.0} seed={2} />
      </Room>
    )) },
  // 9 "فماذا نفعل؟"
  9: { look: night, focus: 4.6, cam: { from: [-0.5, 1.6, 2.8], to: [-0.5, 1.6, 2.2], lookFrom: [-0.5, 1.5, -2.4], fov: 50 },
    Body: B(() => (
      <Room>
        <DrawPanel pos={[-0.5, 3.4, -5.7]} w={2} h={2.4} draw={questionDraw} px={400} />
        <Toon spec={C.hero} pose={{ eyes: "dot", mouth: "o", armL: "shrug", armR: "shrug" }} pos={HERO} />
        <Toon spec={C.mind} pose={{ eyes: "dot", mouth: "flat", armL: "shrug", armR: "shrug" }} pos={MIND} h={1.0} seed={2} />
      </Room>
    )) },
  // 10 "أولًا، اكتب الفكرة على ورقة."  (step 1, a sheet fills with writing)
  10: { look: calm, focus: 4.4, cam: { from: [2.7, 1.8, 0.2], to: [2.7, 1.7, -0.4], lookFrom: [2.65, 1.7, -4.6], fov: 46 },
    Body: B(() => (
      <Room>
        <DrawPanel pos={[3.2, 1.7, -4.7]} w={1.0} h={1.3} draw={paperDraw} px={400} />
        <DrawPanel pos={[3.2, 3.0, -4.9]} w={0.9} h={0.9} draw={badge(1)} px={256} />
        <Toon spec={C.hero} pose={{ eyes: "dot", mouth: "flat", armR: "point", armL: "down" }} pos={[2.4, 0, -3.4]} />
      </Room>
    )) },
  // 11 "ثانيًا، خصّص لها عشر دقائق محددة في اليوم."  (step 2, a ten-minute timer)
  11: { look: calm, focus: 7.0, cam: { from: [3.0, 2.4, 1.8], to: [3.0, 2.5, 0.8], lookFrom: [3.0, 2.8, -5.8], fov: 50 },
    Body: B(() => (
      <Room>
        <DrawPanel pos={[3.4, 3.0, -5.8]} w={2.2} h={2.2} draw={timerDraw} px={512} />
        <DrawPanel pos={[2.0, 4.1, -5.8]} w={0.9} h={0.9} draw={badge(2)} px={256} />
        <Toon spec={C.hero} pose={{ eyes: "happy", mouth: "smile", armL: "hips", armR: "hips" }} pos={[2.6, 0, -3.4]} />
      </Room>
    )) },
  // 12 "وثالثًا، عندما ينتهي الوقت، قم وتحرّك."  (step 3, walk to the door)
  12: { look: calm, focus: 4.2, cam: { from: [5.4, 1.5, 1.4], to: [7.2, 1.5, 0.6], lookFrom: [6.0, 1.2, -2.4], lookTo: [8.2, 1.2, -2.4], fov: 52 },
    Body: B(() => (
      <Room>
        <DrawPanel pos={[9.72, 3.0, -2.4]} w={1.2} h={1.2} draw={badge(3)} px={256} rotY={-Math.PI / 2} />
        <Toon spec={C.hero} pose={{ eyes: "happy", mouth: "grin", armL: "down", armR: "down" }} pos={[4.6, 0, -2.4]} path={{ from: [4.6, 0, -2.4], to: [8.8, 0, -2.4], start: 0, end: 1.8 }} />
      </Room>
    )) },
  // 13 "عقلك ليس عدوك،"
  13: { look: calm, focus: 4.4, cam: { from: [-0.5, 1.4, 2.3], to: [-0.5, 1.35, 1.9], lookFrom: [-0.5, 0.95, -2.4], fov: 50 },
    Body: B(() => (
      <Room>
        <Toon spec={C.hero} pose={{ eyes: "happy", mouth: "grin", armR: "wave", armL: "down" }} pos={HERO} />
        <Toon spec={C.mind} pose={{ eyes: "happy", mouth: "grin", armL: "up", armR: "down" }} pos={MIND} h={1.0} seed={2} />
      </Room>
    )) },
  // 14 "هو فقط موظف مجتهد، لا يعرف متى يغادر."  (the employee at 3 a.m. with his coffee)
  14: { look: night, focus: 4.4, cam: { from: [3.3, 1.9, 0.8], to: [3.3, 1.85, 0.1], lookFrom: [3.4, 2.0, -4.0], fov: 50 },
    Body: B(() => (
      <Room>
        <DrawPanel pos={[3.4, 3.4, -5.8]} w={1.8} h={1.8} draw={clockDraw} px={400} />
        <Toon spec={C.mind} pose={{ eyes: "half", mouth: "flat", armR: "drink", armL: "down" }} pos={[3.4, 0, -3.6]} h={1.6} seed={2} />
      </Room>
    )) },
  // 15 "تابع أسرار النفس لتفهم عقلك أكثر."  (wide, both wave; the channel name is overlaid in Episode.tsx)
  15: { look: calm, focus: 6.5, cam: { from: [0, 2.0, 4.6], to: [0, 1.9, 3.6], lookFrom: [0, 1.8, -2.4], fov: 52 },
    Body: B(() => (
      <Room>
        <Toon spec={C.hero} pose={{ eyes: "happy", mouth: "grin", armR: "wave", armL: "down" }} pos={[-0.8, 0, -2.4]} />
        <Toon spec={C.mind} pose={{ eyes: "happy", mouth: "grin", armL: "wave", armR: "down" }} pos={[0.5, 0, -2.4]} h={1.0} seed={2} />
      </Room>
    )) },
};

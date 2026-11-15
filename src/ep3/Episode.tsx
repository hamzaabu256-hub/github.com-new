import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig, useCurrentFrame, interpolate } from "remotion";
import { Stage } from "../engine/Stage";
import { Captions3, arabicFont } from "./Captions3";
import { SHOTS } from "./shots";
import timing from "../../episodes/ep3/timing.json";

export const TAIL = 0.7; // seconds after the last word
export const totalFrames = (fps: number) => Math.ceil((timing.total + TAIL) * fps);

export const shotSpans = (fps: number) =>
  timing.shots.map((s, i) => {
    const a = i === 0 ? 0 : Math.round(s.start * fps);
    const b = i + 1 < timing.shots.length ? Math.round(timing.shots[i + 1].start * fps) : totalFrames(fps);
    return { id: s.id, from: a, dur: b - a };
  });

export const ShotView: React.FC<{ id: number; dur: number }> = ({ id, dur }) => {
  const S = SHOTS[id];
  return (
    <Stage look={S.look} cam={S.cam} dur={dur} focus={S.focus}>
      <S.Body dur={dur} />
    </Stage>
  );
};

// The channel name pops in over the last shot
const ChannelName: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame(); const { fps, height, width } = useVideoConfig();
  const k = interpolate(frame - from, [0, 8, 14], [0.6, 1.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < from) return null;
  const scale = Math.min(width, height) / 1080;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: height * 0.14, left: 0, right: 0, textAlign: "center", direction: "rtl", transform: `scale(${k})` }}>
        <span style={{ fontFamily: arabicFont, fontWeight: 900, fontSize: 150 * scale, color: "#ffd0ec", textShadow: `0 0 ${30 * scale}px #ff4aa8, 0 ${8 * scale}px ${14 * scale}px rgba(0,0,0,0.6)` }}>أسرار النفس</span>
      </div>
    </AbsoluteFill>
  );
};

export const Episode3: React.FC<{ captions?: boolean; music?: boolean }> = ({ captions = true, music = true }) => {
  const { fps } = useVideoConfig();
  const words = timing.shots.flatMap((s) => s.words);
  const spans = shotSpans(fps);
  const last = spans[spans.length - 1];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {spans.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={"shot " + s.id}>
          <ShotView id={s.id} dur={s.dur} />
        </Sequence>
      ))}
      <ChannelName from={last.from + 4} />
      {captions ? <Captions3 words={words} /> : null}
      <Audio src={staticFile(music ? "ep3/mix.wav" : "ep3/voice.wav")} />
    </AbsoluteFill>
  );
};

export const ShotStill3: React.FC<{ id: number }> = ({ id }) => {
  const { fps } = useVideoConfig();
  const s = shotSpans(fps).find((x) => x.id === id)!;
  return <ShotView id={id} dur={s.dur} />;
};

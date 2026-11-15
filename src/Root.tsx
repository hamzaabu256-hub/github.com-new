import React from "react";
import { Composition } from "remotion";
import { Episode, ShotStill, totalFrames } from "./ep1/Episode";
import { LongEpisode, longFrames } from "./ep1/Long";
import { Episode2, ShotStill2, totalFrames as totalFrames2 } from "./ep2/Episode";
import { Episode3, ShotStill3, totalFrames as totalFrames3 } from "./ep3/Episode";

export const Root: React.FC = () => (
  <>
    <Composition id="Short" component={Episode} width={1080} height={1920} fps={30} durationInFrames={totalFrames(30)} defaultProps={{ captions: true, music: true }} />
    <Composition id="Long" component={LongEpisode} width={1920} height={1080} fps={30} durationInFrames={longFrames(30)} />
    <Composition id="Short16x9" component={Episode} width={1920} height={1080} fps={30} durationInFrames={totalFrames(30)} defaultProps={{ captions: false, music: true }} />
    <Composition id="Shot" component={ShotStill} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    {/* Episode 2: Goodchaos (English) */}
    <Composition id="Short2" component={Episode2} width={1080} height={1920} fps={30} durationInFrames={totalFrames2(30)} defaultProps={{ captions: true, music: true }} />
    <Composition id="Shot2" component={ShotStill2} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
    {/* Episode 3: Asrar Al-Nafs (Arabic) */}
    <Composition id="Short3" component={Episode3} width={1080} height={1920} fps={30} durationInFrames={totalFrames3(30)} defaultProps={{ captions: true, music: true }} />
    <Composition id="Shot3" component={ShotStill3} width={1080} height={1920} fps={30} durationInFrames={300} defaultProps={{ id: 1 }} />
  </>
);

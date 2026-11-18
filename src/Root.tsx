import React from "react";
import { Composition, Still } from "remotion";
import { CharacterReferenceSheet } from "@cosmos-motion/characters";
import { DemoDocumentary, DEMO_TOTAL_FRAMES } from "./DemoDocumentary";
import { ReadmeCover } from "./ReadmeCover";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DemoDocumentary"
        component={DemoDocumentary}
        durationInFrames={DEMO_TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Still
        id="CharacterReferenceSheet"
        component={CharacterReferenceSheet}
        width={1080}
        height={1920}
      />
      <Still
        id="ReadmeCover"
        component={ReadmeCover}
        width={1280}
        height={640}
      />
    </>
  );
};

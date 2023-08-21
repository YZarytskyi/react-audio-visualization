import { initialCanvasSetup } from "./initialCanvasSetup.ts";
import { paintLine } from "./paintLine.ts";

import { DrawByLiveStreamParams, PickItem } from "../types/types.ts";

export const drawByLiveStream = ({
  audioData,
  unit,
  index,
  index2,
  index3,
  speed,
  canvas,
  isRecordingInProgress,
  picks,
  backgroundColor,
  barWidth,
  mainBarColor,
  rounded,
  animateCurrentPick,
}: DrawByLiveStreamParams) => {
  const canvasData = initialCanvasSetup({ canvas, backgroundColor });
  if (!canvasData) return;

  const { context, height, width } = canvasData;

  if (audioData?.length && isRecordingInProgress) {
    const maxPick = Math.max(...audioData);

    paintLineFromCenterToRight();

    // animate current pick
    if (animateCurrentPick) {
      paintLine({
        context,
        rounded,
        color: mainBarColor,
        x: width / 2,
        y: height - (maxPick / 260) * height,
        h: -height + (maxPick / 260) * height * 2,
        w: barWidth,
      });
    }

    // picks visualisation
    let x = width / 2 - index2.current;
    picks.forEach((pick) => {
      if (pick) {
        paintLine({
          context,
          color: mainBarColor,
          rounded,
          x,
          y: pick.startY,
          h: pick.height,
          w: barWidth,
        });
      }
      x -= barWidth;
    });

    if (index3.current >= speed) {
      index2.current += 1;
      index3.current = 0;

      if (index2.current >= barWidth) {
        index2.current = 0;

        const newPick: PickItem | null =
          index.current === barWidth
            ? {
                startY: height - (maxPick / 260) * height,
                height: -height + (maxPick / 260) * height * 2,
              }
            : null;

        if (index.current >= unit) {
          index.current = barWidth;
        } else {
          index.current += barWidth;
        }

        // quantity of picks enough for visualisation
        if (picks.length > width / 2 / barWidth) {
          picks.pop();
        }
        picks.unshift(newPick);
      }
    }

    index3.current += 1;
  } else {
    paintLineFromCenterToRight();
  }

  function paintLineFromCenterToRight() {
    paintLine({
      context,
      color: "#505050",
      rounded,
      x: width / 2 + barWidth / 2,
      y: height / 2 - 1,
      h: 2,
      w: width - (width / 2 + barWidth / 2),
    });
  }
};

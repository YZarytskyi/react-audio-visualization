import { getDataForCanvas } from "./getDataForCanvas.ts";
import { paintLine } from "./paintLine.ts";

import { DrawByLiveStreamParams, PickItem } from "../types/types.ts";

export const drawByLiveStream = ({
  audioData,
  index,
  canvas,
  isRecording,
  picks,
  speed,
  backgroundColor,
  barWidth,
  mainLineColor,
  secondaryLineColor,
  rounded,
  animateCurrentPick,
}: DrawByLiveStreamParams) => {
  const canvasData = getDataForCanvas({ canvas, backgroundColor });
  if (!canvasData) return;

  const { context, height, width } = canvasData;

  const paintLineFromCenterToRight = () => {
    paintLine({
      context,
      color: secondaryLineColor,
      rounded,
      x: width / 2 + barWidth / 2,
      y: height / 2 - 1,
      h: 2,
      w: width - (width / 2 + barWidth / 2),
    });
  };

  if (audioData?.length && isRecording) {
    const maxPick = Math.max(...audioData);
    const newPick: PickItem | null =
      index === 0
        ? {
            startY: height - (maxPick / 255) * height,
            height: -height + (maxPick / 255) * height * 2,
          }
        : null;

    // quantity of picks enough for visualisation
    if (picks.length > width / 2 / speed) {
      picks.pop();
    }
    picks.unshift(newPick);

    paintLineFromCenterToRight();

    // animate current pick
    if (animateCurrentPick) {
      paintLine({
        context,
        rounded,
        color: mainLineColor,
        x: width / 2,
        y: height - (maxPick / 255) * height,
        h: -height + (maxPick / 255) * height * 2,
        w: barWidth,
      });
    }

    // picks visualisation
    let x = width / 2; // width / 2 - barWidth
    picks.forEach((pick) => {
      if (pick) {
        paintLine({
          context,
          color: mainLineColor,
          rounded,
          x,
          y: pick.startY,
          h: pick.height,
          w: barWidth,
        });
      }
      x -= speed;
    });
  } else {
    paintLineFromCenterToRight();
  }
};

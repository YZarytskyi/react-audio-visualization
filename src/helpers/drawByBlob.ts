import { getDataForCanvas } from "./getDataForCanvas.ts";
import { paintLine } from "./paintLine.ts";

import { DrawByBlob } from "../types/types.ts";

export const drawByBlob = ({
  barsData,
  canvas,
  barWidth,
  gap,
  backgroundColor,
  mainLineColor,
  secondaryLineColor,
  currentAudioTime = 0,
  rounded,
  duration,
}: DrawByBlob): void => {
  const canvasData = getDataForCanvas({ canvas, backgroundColor });
  if (!canvasData) return;

  const { context, height } = canvasData;
  const playedPercent = currentAudioTime / duration;

  barsData.forEach((barData, i) => {
    const mappingPercent = i / barsData.length;
    const played = playedPercent > mappingPercent;

    paintLine({
      context,
      color: played ? secondaryLineColor : mainLineColor,
      rounded,
      x: i * (barWidth + gap * barWidth),
      y: height / 2 + barData.min,
      h: barData.max - barData.min,
      w: barWidth,
    });
  });
};

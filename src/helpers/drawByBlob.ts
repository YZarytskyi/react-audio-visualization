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
  currentTime = 0,
  duration,
}: DrawByBlob): void => {
  const canvasData = getDataForCanvas({ canvas, backgroundColor });
  if (!canvasData) return;

  const { context, height, width } = canvasData;
  console.log(width);
  const playedPercent = currentTime / duration;

  barsData.forEach((barData, i) => {
    const mappingPercent = i / barsData.length;
    const played = playedPercent > mappingPercent;

    paintLine({
      context,
      color: played && secondaryLineColor ? secondaryLineColor : mainLineColor,
      x: i * (barWidth + gap * 3),
      y: height / 2 + barData.min,
      h: height / 2 + barData.max - (height / 2 + barData.min),
      w: barWidth,
    });
  });
};

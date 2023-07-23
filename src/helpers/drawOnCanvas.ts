import { BarsData, DrawOnCanvasParams } from "../types/types.ts";

export const drawOnCanvas = ({
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
  animateCurrentPick,
}: DrawOnCanvasParams) => {
  const height = canvas.height;
  const width = canvas.width;
  const context = canvas.getContext("2d");
  if (!context) return;

  context.clearRect(0, 0, width, height);
  if (backgroundColor !== "transparent") {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);
  }
  context.lineWidth = barWidth;

  if (audioData?.length && isRecording) {
    const maxPick = Math.max(...audioData);
    const picksLength = picks.length;
    const newPick =
      index === 0
        ? {
            startY: height - (maxPick / 255) * height,
            height: -height + (maxPick / 255) * height * 2,
            lineToY: (maxPick / 255) * height,
          }
        : { startY: 0, height: 0, lineToY: 0 };

    // quantity of picks enough for visualisation
    if (picksLength > width / 2 / speed) {
      picks.pop();
    }
    picks.unshift(newPick);

    // string from right to center with secondary color
    context.beginPath();
    context.strokeStyle = secondaryLineColor;
    context.lineWidth = 1;
    context.moveTo(width / 2 + barWidth / 2, height / 2);
    context.lineTo(width, height / 2);
    context.stroke();

    // animate current pick
    if (animateCurrentPick) {
      context.beginPath();
      context.strokeStyle = mainLineColor;
      context.lineWidth = barWidth;
      context.moveTo(width / 2, (maxPick / 255) * height);
      context.lineTo(width / 2, height - (maxPick / 255) * height);
      context.stroke();
    }

    // picks visualisation
    context.beginPath();
    context.fillStyle = mainLineColor;
    let x = width / 2 - barWidth;
    picks.forEach(({ startY, height, lineToY }) => {
      const y = startY;
      const w = barWidth;
      const h = height;

      context.beginPath();
      if (context.roundRect && context.fill) {
        // if roundRect and fill are supported by the browser
        context.roundRect(x, y, w, h, 50);
        context.fill();
      } else {
        // fallback for browsers that do not support roundRect or fill
        context.strokeStyle = mainLineColor;
        context.lineWidth = barWidth;
        context.moveTo(x, startY);
        context.lineTo(x, lineToY);
        context.stroke();
      }
      x -= speed;
    });
  } else {
    picks.length = 0;
    context.beginPath();
    context.strokeStyle = secondaryLineColor;
    context.moveTo(width / 2, height / 2);
    context.lineTo(width, height / 2);
    context.stroke();
  }
  return;
};

export const drawBlob = (
  data: BarsData[],
  canvas: HTMLCanvasElement,
  barWidth: number,
  gap: number,
  backgroundColor: string,
  barColor: string,
  barPlayedColor?: string,
  currentTime = 0,
  duration = 1,
): void => {
  const height = canvas.height;
  const width = canvas.width;
  const context = canvas.getContext("2d");
  if (!context) return;

  context.clearRect(0, 0, width, height);

  if (backgroundColor !== "transparent") {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);
  }

  const playedPercent = (currentTime || 0) / duration;

  data.forEach((barData, i) => {
    const mappingPercent = i / data.length;
    const played = playedPercent > mappingPercent;
    context.fillStyle = played && barPlayedColor ? barPlayedColor : barColor;

    const x = i * (barWidth + gap);
    const y = height / 2 + barData.min;
    const w = barWidth;
    const h = height / 2 + barData.max - y;

    context.beginPath();
    if (context.roundRect) {
      // making sure roundRect is supported by the browser
      context.roundRect(x, y, w, h, 50);
      context.fill();
    } else {
      // fallback for browsers that do not support roundRect
      context.fillRect(x, y, w, h);
    }
  });
};

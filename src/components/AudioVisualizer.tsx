import { FC, useEffect, useRef, useState } from "react";

import { drawBlob, drawOnCanvas } from "../helpers/drawOnCanvas.ts";
import { getBarsData } from "../helpers/getBarsData.ts";

import { Controls, PickItem } from "../types/types.ts";
import { formatTime } from "../helpers/formatTime.ts";

interface AudioVisualiserProps {
  controls: Controls;
  speed?: number;
  height?: number;
  width?: number;
  backgroundColor?: string;
  mainLineColor?: string;
  secondaryLineColor?: string;
  barWidth?: number;
  gap?: number;
  animateCurrentPick?: boolean;
}

export const AudioVisualiser: FC<AudioVisualiserProps> = ({
  controls: { audioData, isRecording, recordedBlob, recordingTime },
  speed = 0.5,
  height = 300,
  width = 1700,
  backgroundColor = "transparent",
  mainLineColor = "#FFFFFF",
  secondaryLineColor = "#494848",
  barWidth = 1,
  gap = 0,
  animateCurrentPick = true,
}) => {
  const [duration, setDuration] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const picksRef = useRef<PickItem[]>([]);
  const indexRef = useRef<number>(0);

  useEffect(() => {
    if (!recordedBlob || !canvasRef.current) return;

    const processBlob = async () => {
      const audioBuffer = await recordedBlob.arrayBuffer();
      const audioContext = new AudioContext();
      await audioContext.decodeAudioData(audioBuffer, (buffer) => {
        setDuration(buffer.duration);
        const barsData = getBarsData(buffer, height, width, barWidth, gap);

        if (!canvasRef.current) return;

        drawBlob(
          barsData,
          canvasRef.current,
          barWidth,
          gap * 2,
          backgroundColor,
          mainLineColor,
          secondaryLineColor,
          0,
          duration,
        );
      });
    };

    processBlob();
  }, [recordedBlob]);

  useEffect(() => {
    if (!canvasRef.current) return;
    drawOnCanvas({
      audioData,
      index: indexRef.current,
      canvas: canvasRef.current,
      isRecording,
      backgroundColor,
      mainLineColor,
      picks: picksRef.current,
      secondaryLineColor,
      speed,
      barWidth,
      animateCurrentPick,
    });
  }, [canvasRef.current]);

  if (canvasRef.current && !recordedBlob) {
    if (indexRef.current >= (gap / speed) * 2 * barWidth) {
      indexRef.current = 0;
    } else {
      indexRef.current += 1;
    }

    drawOnCanvas({
      audioData,
      index: indexRef.current,
      canvas: canvasRef.current,
      picks: picksRef.current,
      isRecording,
      backgroundColor,
      mainLineColor,
      secondaryLineColor,
      speed,
      barWidth,
      animateCurrentPick,
    });
  }

  return (
    <>
      <canvas height={height} width={width} ref={canvasRef}>
        Your browser does not support HTML5 Canvas.
      </canvas>
      {isRecording && <p>Time: {formatTime(recordingTime)}</p>}
      {duration ? <p>Duration: {duration}s</p> : null}
    </>
  );
};

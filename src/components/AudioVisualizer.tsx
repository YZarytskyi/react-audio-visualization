import { FC, useEffect, useRef, useState } from "react";

import { drawByLiveStream } from "../helpers/drawByLiveStream.ts";
import { drawByBlob } from "../helpers/drawByBlob.ts";
import { getBarsData } from "../helpers/getBarsData.ts";
import { formatTime } from "../helpers/formatTime.ts";

import { Controls, PickItem } from "../types/types.ts";

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
  rounded?: number;
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
  barWidth = 2,
  gap = 1,
  rounded = 50,
  animateCurrentPick = true,
}) => {
  const [duration, setDuration] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const picksRef = useRef<Array<PickItem | null>>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (indexRef.current >= (gap / speed) * 2 * barWidth) {
      indexRef.current = 0;
    } else {
      indexRef.current += 1;
    }

    drawByLiveStream({
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
      rounded,
      animateCurrentPick,
    });
  }, [canvasRef.current, audioData]);

  useEffect(() => {
    if (!recordedBlob || !canvasRef.current) return;

    const processBlob = async () => {
      picksRef.current = [];

      try {
        const audioBuffer = await recordedBlob.arrayBuffer();
        const audioContext = new AudioContext();
        const buffer = await audioContext.decodeAudioData(audioBuffer);
        const barsData = getBarsData(buffer, height, width, barWidth, gap);
        setDuration(buffer.duration);

        if (!canvasRef.current) return;

        drawByBlob({
          barsData,
          canvas: canvasRef.current,
          barWidth,
          gap,
          backgroundColor,
          mainLineColor,
          secondaryLineColor,
          rounded,
          duration,
        });
      } catch (error) {
        console.error("Error processing the audio blob:", error);
      }
    };

    void processBlob();
  }, [recordedBlob]);

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

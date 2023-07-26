import { FC, useEffect, useRef, useState } from "react";

import { drawByLiveStream } from "../helpers/drawByLiveStream.ts";
import { drawByBlob } from "../helpers/drawByBlob.ts";
import { getBarsData } from "../helpers/getBarsData.ts";
import { formatTime } from "../helpers/formatTime.ts";

import { BarsData, Controls, PickItem } from "../types/types.ts";

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
  speed = 1,
  height = 300,
  width = 1500,
  backgroundColor = "transparent",
  mainLineColor = "#FFFFFF",
  secondaryLineColor = "#5e5e5e",
  barWidth = 2,
  gap = 2,
  rounded = 10,
  animateCurrentPick = true,
}) => {
  const [duration, setDuration] = useState(0);
  const [controlsX, setControlsX] = useState(0);
  const [audioSrc, setAudioSrc] = useState("");
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [barsData, setBarsData] = useState<BarsData[]>([]);
  const [isRecordedCanvasHovered, setIsRecordedCanvasHovered] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const picksRef = useRef<Array<PickItem | null>>([]);
  const indexRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!recordedBlob) return;

    setAudioSrc(URL.createObjectURL(recordedBlob));
    canvasRef.current?.addEventListener("mousemove", setCurrentControlsX);

    return () => {
      canvasRef.current?.removeEventListener("mousemove", setCurrentControlsX);
    };
  }, [recordedBlob]);

  useEffect(() => {
    if (isRecordedCanvasHovered) {
      canvasRef.current?.addEventListener("mouseleave", hideTimeIndicator);
    } else {
      canvasRef.current?.addEventListener("mouseenter", showTimeIndicator);
    }

    return () => {
      if (isRecordedCanvasHovered) {
        canvasRef.current?.removeEventListener("mouseenter", showTimeIndicator);
      } else {
        canvasRef.current?.removeEventListener("mouseleave", hideTimeIndicator);
      }
    };
  }, [isRecordedCanvasHovered]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const coefficientAdjust = gap ? -2 : 2;
    const unit = (gap * barWidth + barWidth) / speed - gap - coefficientAdjust;

    if (indexRef.current >= unit) {
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
        setBarsData(barsData);
        setDuration(buffer.duration);

        if (!canvasRef.current) return;
      } catch (error) {
        console.error("Error processing the audio blob:", error);
      }
    };

    void processBlob();
  }, [recordedBlob]);

  useEffect(() => {
    if (!barsData.length || !canvasRef.current) return;

    drawByBlob({
      barsData,
      canvas: canvasRef.current,
      barWidth,
      gap,
      backgroundColor,
      mainLineColor,
      secondaryLineColor,
      currentAudioTime,
      rounded,
      duration,
    });
  }, [barsData, currentAudioTime]);

  useEffect(() => {
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const showTimeIndicator = () => {
    setIsRecordedCanvasHovered(true);
  };

  const hideTimeIndicator = () => {
    setIsRecordedCanvasHovered(false);
  };

  const setCurrentControlsX = (e: MouseEvent) => {
    setControlsX(e.offsetX);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentAudioTime(audioRef.current.currentTime);
      raf.current = requestAnimationFrame(handleTimeUpdate);
    }
  };

  const playAudio = () => {
    audioRef.current?.paused
      ? audioRef.current?.play()
      : audioRef.current?.pause();
  };

  return (
    <>
      <div className="canvas__container">
        <canvas
          height={height}
          width={width}
          ref={canvasRef}
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = (duration / width) * controlsX;
            }
          }}
        >
          Your browser does not support HTML5 Canvas.
        </canvas>
        {isRecordedCanvasHovered && (
          <div
            className="control-hover"
            style={{
              left: controlsX,
              display: recordedBlob ? "block" : "none",
            }}
          >
            <p className="control-hover__time">
              {((duration / width) * controlsX).toFixed(2)}
            </p>
          </div>
        )}
        {recordedBlob && duration && (
          <div
            className="control"
            style={{
              left: (currentAudioTime / duration) * width,
            }}
          >
            <p className="control__time">{currentAudioTime.toFixed(2)}</p>
          </div>
        )}
      </div>
      {isRecording && <p>Time: {formatTime(recordingTime)}</p>}
      {duration ? <p>Duration: {duration}s</p> : null}
      {audioSrc ? <p>{currentAudioTime.toFixed(2)}</p> : null}
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        controls={true}
        style={{ display: "none" }}
      />
      <button className="btn__play" onClick={playAudio}>
        Play music
      </button>
    </>
  );
};

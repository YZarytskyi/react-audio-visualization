import {
  forwardRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import { drawByLiveStream } from "../helpers/drawByLiveStream.ts";
import { drawByBlob } from "../helpers/drawByBlob.ts";
import { getBarsData } from "../helpers/getBarsData.ts";

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

type Ref = HTMLAudioElement | null;

export const AudioVisualiser = forwardRef<Ref, AudioVisualiserProps>(
  (
    {
      controls: {
        audioData,
        isRecording,
        recordedBlob,
        duration,
        audioSrc,
        currentAudioTime,
        bufferFromRecordedBlob,
        _handleTimeUpdate,
      },
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
    },
    ref,
  ) => {
    const [controlsX, setControlsX] = useState(0);
    const [barsData, setBarsData] = useState<BarsData[]>([]);
    const [isRecordedCanvasHovered, setIsRecordedCanvasHovered] =
      useState(false);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const picksRef = useRef<Array<PickItem | null>>([]);
    const indexRef = useRef(0);

    useEffect(() => {
      if (isRecordedCanvasHovered) {
        canvasRef.current?.addEventListener("mouseleave", hideTimeIndicator);
      } else {
        canvasRef.current?.addEventListener("mouseenter", showTimeIndicator);
      }

      return () => {
        if (isRecordedCanvasHovered) {
          canvasRef.current?.removeEventListener(
            "mouseenter",
            showTimeIndicator,
          );
        } else {
          canvasRef.current?.removeEventListener(
            "mouseleave",
            hideTimeIndicator,
          );
        }
      };
    }, [isRecordedCanvasHovered]);

    useEffect(() => {
      if (!canvasRef.current) return;

      const coefficientAdjust = gap ? -2 : 2;
      const unit =
        (gap * barWidth + barWidth) / speed - gap - coefficientAdjust;

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
      if (!bufferFromRecordedBlob || !canvasRef.current || isRecording) return;

      const processBlob = () => {
        picksRef.current = [];
        const barsData = getBarsData(
          bufferFromRecordedBlob,
          height,
          width,
          barWidth,
          gap,
        );
        setBarsData(barsData);
      };
      void processBlob();

      canvasRef.current?.addEventListener("mousemove", setCurrentControlsX);

      return () => {
        canvasRef.current?.removeEventListener(
          "mousemove",
          setCurrentControlsX,
        );
      };
    }, [bufferFromRecordedBlob]);

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

    const showTimeIndicator = () => {
      setIsRecordedCanvasHovered(true);
    };

    const hideTimeIndicator = () => {
      setIsRecordedCanvasHovered(false);
    };

    const setCurrentControlsX = (e: MouseEvent) => {
      setControlsX(e.offsetX);
    };

    return (
      <>
        <div className="canvas__container">
          <canvas
            height={height}
            width={width}
            ref={canvasRef}
            onClick={() => {
              if (ref) {
                (
                  ref as MutableRefObject<HTMLAudioElement>
                ).current.currentTime = (duration / width) * controlsX;
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
        <audio
          ref={ref}
          src={audioSrc}
          onTimeUpdate={_handleTimeUpdate}
          controls={true}
          style={{ display: "none" }}
        />
      </>
    );
  },
);

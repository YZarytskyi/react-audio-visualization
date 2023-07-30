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
import { initialCanvasSetup } from "../helpers/initialCanvasSetup.ts";

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
  canvasContainerClassName?: string;
  isProgressIndicatorShown?: boolean;
  progressIndicatorClassName?: string;
  isProgressIndicatorTimeShown?: boolean;
  progressIndicatorTimeClassName?: string;
  isProgressIndicatorOnHoverShown?: boolean;
  progressIndicatorOnHoverClassName?: string;
  isProgressIndicatorTimeOnHoverShown?: boolean;
  progressIndicatorTimeOnHoverClassName?: string;
}

type Ref = HTMLAudioElement | null;

export const AudioVisualiser = forwardRef<Ref, AudioVisualiserProps>(
  (
    {
      controls: {
        audioData,
        isRecordingInProgress,
        recordedBlob,
        duration,
        audioSrc,
        currentAudioTime,
        bufferFromRecordedBlob,
        isProcessingRecordedAudio,
        _handleTimeUpdate,
      },
      speed = 0.7,
      height = 300,
      width = 1400,
      backgroundColor = "transparent",
      mainLineColor = "#FFFFFF",
      secondaryLineColor = "#5e5e5e",
      barWidth = 2,
      gap = 1,
      rounded = 10,
      animateCurrentPick = true,
      canvasContainerClassName,
      isProgressIndicatorShown = true,
      progressIndicatorClassName,
      isProgressIndicatorTimeShown = true,
      progressIndicatorTimeClassName,
      isProgressIndicatorOnHoverShown = true,
      progressIndicatorOnHoverClassName,
      isProgressIndicatorTimeOnHoverShown = true,
      progressIndicatorTimeOnHoverClassName,
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

    //TODO: magic numbers
    const gapCoefficientAdjustRecording = gap ? -2 : 2;

    useEffect(() => {
      if (isRecordedCanvasHovered) {
        canvasRef.current?.addEventListener("mouseleave", hideTimeIndicator);
      } else {
        canvasRef.current?.addEventListener("mouseenter", showTimeIndicator);
      }

      return () => {
        if (isRecordedCanvasHovered) {
          canvasRef.current?.removeEventListener(
            "mouseleave",
            hideTimeIndicator,
          );
        } else {
          canvasRef.current?.removeEventListener(
            "mouseenter",
            showTimeIndicator,
          );
        }
      };
    }, [isRecordedCanvasHovered]);

    useEffect(() => {
      if (!canvasRef.current) return;

      const unit =
        (gap * barWidth + barWidth) / speed -
        gap -
        gapCoefficientAdjustRecording;

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
        isRecordingInProgress,
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
      if (
        !bufferFromRecordedBlob ||
        !canvasRef.current ||
        isRecordingInProgress
      )
        return;

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
        gap: gap,
        backgroundColor,
        mainLineColor,
        secondaryLineColor,
        currentAudioTime,
        rounded,
        duration,
      });
    }, [barsData, currentAudioTime]);

    useEffect(() => {
      if (!canvasRef.current) return;

      if (isProcessingRecordedAudio) {
        initialCanvasSetup({
          canvas: canvasRef.current,
          backgroundColor,
        });
      }
    }, [isProcessingRecordedAudio]);

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
        <div className={`canvas__container ${canvasContainerClassName ?? ""}`}>
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
          {isRecordedCanvasHovered && isProgressIndicatorOnHoverShown && (
            <div
              className={`progressIndicatorHovered ${
                progressIndicatorOnHoverClassName ?? ""
              }`}
              style={{
                left: controlsX,
                display: recordedBlob ? "block" : "none",
              }}
            >
              {isProgressIndicatorTimeOnHoverShown && (
                <p
                  className={`progressIndicatorHovered__time ${
                    progressIndicatorTimeOnHoverClassName ?? ""
                  }`}
                >
                  {((duration / width) * controlsX).toFixed(2)}
                </p>
              )}
            </div>
          )}
          {recordedBlob && duration && isProgressIndicatorShown ? (
            <div
              className={`progressIndicator ${
                progressIndicatorClassName ?? ""
              }`}
              style={{
                left: (currentAudioTime / duration) * width,
              }}
            >
              {isProgressIndicatorTimeShown && (
                <p
                  className={`progressIndicator__time ${
                    progressIndicatorTimeClassName ?? ""
                  }`}
                >
                  {currentAudioTime.toFixed(2)}
                </p>
              )}
            </div>
          ) : null}
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

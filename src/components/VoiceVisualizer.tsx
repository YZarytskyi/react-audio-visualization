import {
  useState,
  useEffect,
  forwardRef,
  useRef,
  MutableRefObject,
  useCallback,
} from "react";

import { drawByLiveStream } from "../helpers/drawByLiveStream.ts";
import { drawByBlob } from "../helpers/drawByBlob.ts";
import { getBarsData } from "../helpers/getBarsData.ts";
import { initialCanvasSetup } from "../helpers/initialCanvasSetup.ts";

import { BarsData, Controls, PickItem } from "../types/types.ts";
import useResizeObserver from "../hooks/useResizeObserver.tsx";
import { formatToInlineStyleValue } from "../helpers/formatToInlineStyleValue.ts";
import { formatRecordedAudioTime } from "../helpers/formatRecordedAudioTime.ts";

interface VoiceVisualiserProps {
  controls: Controls;
  height?: string | number;
  width?: string | number;
  speed?: number;
  backgroundColor?: string;
  mainBarColor?: string;
  secondaryBarColor?: string;
  barWidth?: number;
  gap?: number;
  rounded?: number;
  fullscreen?: boolean;
  animateCurrentPick?: boolean;
  onlyRecording?: boolean;
  isLineFromCenterToRightShownBeforeRecording?: boolean;
  canvasContainerClassName?: string;
  isProgressIndicatorShown?: boolean;
  progressIndicatorClassName?: string;
  isProgressIndicatorTimeShown?: boolean;
  progressIndicatorTimeClassName?: string;
  isProgressIndicatorOnHoverShown?: boolean;
  progressIndicatorOnHoverClassName?: string;
  isProgressIndicatorTimeOnHoverShown?: boolean;
  progressIndicatorTimeOnHoverClassName?: string;
  isAudioProcessingTextShown?: boolean;
  audioProcessingTextClassName?: string;
}

type Ref = HTMLAudioElement | null;

export const VoiceVisualiser = forwardRef<Ref, VoiceVisualiserProps>(
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
        isCleared,
        clearCanvas,
        _handleTimeUpdate,
      },
      width = "100%",
      height = 200,
      speed = 3,
      backgroundColor = "transparent",
      mainBarColor = "#FFFFFF",
      secondaryBarColor = "#5e5e5e",
      barWidth = 2,
      gap = 1,
      rounded = 5,
      animateCurrentPick = true,
      fullscreen = true,
      onlyRecording = false,
      isLineFromCenterToRightShownBeforeRecording = false,
      canvasContainerClassName,
      isProgressIndicatorShown = true,
      progressIndicatorClassName,
      isProgressIndicatorTimeShown = true,
      progressIndicatorTimeClassName,
      isProgressIndicatorOnHoverShown = true,
      progressIndicatorOnHoverClassName,
      isProgressIndicatorTimeOnHoverShown = true,
      progressIndicatorTimeOnHoverClassName,
      isAudioProcessingTextShown = true,
      audioProcessingTextClassName,
    },
    ref,
  ) => {
    const [offsetX, setOffsetX] = useState(0);
    const [barsData, setBarsData] = useState<BarsData[]>([]);
    const [canvasCurrentWidth, setCanvasCurrentWidth] = useState(0);
    const [canvasCurrentHeight, setCanvasCurrentHeight] = useState(0);
    const [isRecordedCanvasHovered, setIsRecordedCanvasHovered] =
      useState(false);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const picksRef = useRef<Array<PickItem | null>>([]);
    const indexSpeedRef = useRef(speed);
    const indexRef = useRef(barWidth);
    const index2Ref = useRef(0);

    const unit = barWidth + gap * barWidth;

    const onResize = useCallback((target: HTMLDivElement) => {
      const roundedWidth = Math.floor(target.clientWidth / 2) * 2;
      const roundedHeight = Math.trunc(target.clientHeight);
      setCanvasCurrentWidth(roundedWidth);
      setCanvasCurrentHeight(roundedHeight);
    }, []);

    const canvasContainerRef = useResizeObserver(onResize);

    useEffect(() => {
      if (!bufferFromRecordedBlob) return;

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
    }, [isRecordedCanvasHovered, bufferFromRecordedBlob]);

    useEffect(() => {
      if (!canvasRef.current) return;

      if (indexSpeedRef.current >= speed || !audioData.length) {
        indexSpeedRef.current = 0;

        drawByLiveStream({
          audioData,
          unit,
          index: indexRef,
          index2: index2Ref,
          canvas: canvasRef.current,
          picks: picksRef.current,
          isRecordingInProgress,
          backgroundColor,
          mainBarColor,
          secondaryBarColor,
          barWidth,
          rounded,
          animateCurrentPick,
          fullscreen,
          isLineFromCenterToRightShownBeforeRecording,
        });
      }

      indexSpeedRef.current += 1;
    }, [
      canvasRef.current,
      audioData,
      canvasCurrentWidth,
      canvasCurrentHeight,
      fullscreen,
      isLineFromCenterToRightShownBeforeRecording,
    ]);

    useEffect(() => {
      if (
        !bufferFromRecordedBlob ||
        !canvasRef.current ||
        isRecordingInProgress
      ) {
        return;
      }

      if (onlyRecording) {
        clearCanvas();
        return;
      }

      const processBlob = () => {
        picksRef.current = [];

        setBarsData(
          getBarsData(
            bufferFromRecordedBlob,
            canvasCurrentHeight,
            canvasCurrentWidth,
            barWidth,
            gap,
          ),
        );
      };

      void processBlob();

      canvasRef.current?.addEventListener("mousemove", setCurrentOffsetX);

      return () => {
        canvasRef.current?.removeEventListener("mousemove", setCurrentOffsetX);
      };
    }, [
      bufferFromRecordedBlob,
      canvasCurrentWidth,
      canvasCurrentHeight,
      gap,
      barWidth,
    ]);

    useEffect(() => {
      if (onlyRecording || !barsData.length || !canvasRef.current) return;

      if (isCleared) {
        setBarsData([]);
        if (!isLineFromCenterToRightShownBeforeRecording) return;
      }

      drawByBlob({
        barsData,
        canvas: canvasRef.current,
        barWidth,
        gap,
        backgroundColor,
        mainBarColor,
        secondaryBarColor,
        currentAudioTime,
        rounded,
        duration,
        isCleared,
      });
    }, [
      barsData,
      currentAudioTime,
      isCleared,
      rounded,
      backgroundColor,
      mainBarColor,
      secondaryBarColor,
      isLineFromCenterToRightShownBeforeRecording,
    ]);

    useEffect(() => {
      if (isProcessingRecordedAudio && canvasRef.current) {
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

    const setCurrentOffsetX = (e: MouseEvent) => {
      setOffsetX(e.offsetX);
    };

    return (
      <>
        <div
          className={`canvas__container ${canvasContainerClassName ?? ""}`}
          ref={canvasContainerRef}
          style={{
            height: formatToInlineStyleValue(height),
            width: formatToInlineStyleValue(width),
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasCurrentWidth}
            height={canvasCurrentHeight}
            onClick={() => {
              if ((ref as MutableRefObject<HTMLAudioElement>)?.current) {
                (
                  ref as MutableRefObject<HTMLAudioElement>
                ).current.currentTime =
                  (duration / canvasCurrentWidth) * offsetX;
              }
            }}
          >
            Your browser does not support HTML5 Canvas.
          </canvas>
          {isAudioProcessingTextShown && isProcessingRecordedAudio && (
            <p
              className={`canvas__audio-processing ${
                audioProcessingTextClassName ?? ""
              }`}
              style={{ color: mainBarColor }}
            >
              Processing Audio...
            </p>
          )}
          {isRecordedCanvasHovered &&
            bufferFromRecordedBlob &&
            isProgressIndicatorOnHoverShown && (
              <div
                className={`progressIndicatorHovered ${
                  progressIndicatorOnHoverClassName ?? ""
                }`}
                style={{
                  left: offsetX,
                  display: recordedBlob ? "block" : "none",
                }}
              >
                {isProgressIndicatorTimeOnHoverShown && (
                  <p
                    className={`progressIndicatorHovered__time 
                    ${
                      canvasCurrentWidth - offsetX < 70
                        ? "progressIndicatorHovered__time-left"
                        : ""
                    } 
                    ${progressIndicatorTimeOnHoverClassName ?? ""}`}
                  >
                    {formatRecordedAudioTime(
                      (duration / canvasCurrentWidth) * offsetX,
                    )}
                  </p>
                )}
              </div>
            )}
          {bufferFromRecordedBlob && duration && isProgressIndicatorShown ? (
            <div
              className={`progressIndicator ${
                progressIndicatorClassName ?? ""
              }`}
              style={{
                left: (currentAudioTime / duration) * canvasCurrentWidth,
              }}
            >
              {isProgressIndicatorTimeShown && (
                <p
                  className={`progressIndicator__time ${
                    canvasCurrentWidth -
                      (currentAudioTime * canvasCurrentWidth) / duration <
                    70
                      ? "progressIndicator__time-left"
                      : ""
                  } ${progressIndicatorTimeClassName ?? ""}`}
                >
                  {formatRecordedAudioTime(currentAudioTime)}
                </p>
              )}
            </div>
          ) : null}
        </div>
        {bufferFromRecordedBlob && (
          <audio
            ref={ref}
            src={audioSrc}
            onTimeUpdate={_handleTimeUpdate}
            controls={true}
            style={{ display: "none" }}
          />
        )}
      </>
    );
  },
);

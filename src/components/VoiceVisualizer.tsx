import {
  useState,
  useEffect,
  forwardRef,
  useRef,
  MutableRefObject,
} from "react";

import { drawByLiveStream } from "../helpers/drawByLiveStream.ts";
import { drawByBlob } from "../helpers/drawByBlob.ts";
import { getBarsData } from "../helpers/getBarsData.ts";
import { initialCanvasSetup } from "../helpers/initialCanvasSetup.ts";

import { BarsData, Controls, PickItem } from "../types/types.ts";

interface VoiceVisualiserProps {
  controls: Controls;
  height?: number;
  width?: number;
  speed?: number;
  backgroundColor?: string;
  mainBarColor?: string;
  secondaryBarColor?: string;
  barWidth?: number;
  gap?: number;
  rounded?: number;
  animateCurrentPick?: boolean;
  onlyRecording?: boolean;
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
        _handleTimeUpdate,
      },
      height = 200,
      width = 1300,
      speed = 2,
      backgroundColor = "transparent",
      mainBarColor = "#FFFFFF",
      secondaryBarColor = "#5e5e5e",
      barWidth = 2,
      gap = 1,
      rounded = 5,
      animateCurrentPick = true,
      onlyRecording = false,
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
    const [isRecordedCanvasHovered, setIsRecordedCanvasHovered] =
      useState(false);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const picksRef = useRef<Array<PickItem | null>>([]);
    const indexRef = useRef(barWidth);
    const index2Ref = useRef(0);
    const index3Ref = useRef(speed);

    const unit = barWidth + gap * barWidth;

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
    }, [isRecordedCanvasHovered]);

    useEffect(() => {
      if (!canvasRef.current) return;

      drawByLiveStream({
        audioData,
        unit,
        index: indexRef,
        index2: index2Ref,
        index3: index3Ref,
        speed,
        canvas: canvasRef.current,
        picks: picksRef.current,
        isRecordingInProgress,
        backgroundColor,
        mainBarColor,
        secondaryBarColor,
        barWidth,
        rounded,
        animateCurrentPick,
      });
    }, [canvasRef.current, audioData]);

    useEffect(() => {
      if (
        onlyRecording ||
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

      canvasRef.current?.addEventListener("mousemove", setCurrentOffsetX);

      return () => {
        canvasRef.current?.removeEventListener("mousemove", setCurrentOffsetX);
      };
    }, [bufferFromRecordedBlob]);

    useEffect(() => {
      if (onlyRecording || !barsData.length || !canvasRef.current) return;

      drawByBlob({
        barsData,
        canvas: canvasRef.current,
        barWidth,
        gap: gap,
        backgroundColor,
        mainBarColor,
        secondaryBarColor,
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

    const setCurrentOffsetX = (e: MouseEvent) => {
      setOffsetX(e.offsetX);
    };

    return (
      <>
        <div className={`canvas__container ${canvasContainerClassName ?? ""}`}>
          <canvas
            height={height}
            width={width}
            ref={canvasRef}
            onClick={() => {
              if ((ref as MutableRefObject<HTMLAudioElement>)?.current) {
                (
                  ref as MutableRefObject<HTMLAudioElement>
                ).current.currentTime = (duration / width) * offsetX;
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
          {isRecordedCanvasHovered && isProgressIndicatorOnHoverShown && (
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
                  className={`progressIndicatorHovered__time ${
                    progressIndicatorTimeOnHoverClassName ?? ""
                  }`}
                >
                  {((duration / width) * offsetX).toFixed(2)}
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

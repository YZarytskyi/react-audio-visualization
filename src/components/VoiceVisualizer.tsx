import {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useCallback,
  MutableRefObject,
  MouseEventHandler,
} from "react";

import useResizeObserver from "../hooks/useResizeObserver.tsx";
import { drawByLiveStream } from "../helpers/drawByLiveStream.ts";
import { drawByBlob } from "../helpers/drawByBlob.ts";
import { getBarsData } from "../helpers/getBarsData.ts";
import { initialCanvasSetup } from "../helpers/initialCanvasSetup.ts";
import { formatToInlineStyleValue } from "../helpers/formatToInlineStyleValue.ts";
import { formatRecordedAudioTime } from "../helpers/formatRecordedAudioTime.ts";
import { formatRecordingTime } from "../helpers/formatRecordingTime.ts";
import { BarsData, Controls, PickItem } from "../types/types.ts";

import MicrophoneIcon from "../assets/MicrophoneIcon.tsx";
import AudioWaveIcon from "../assets/AudioWaveIcon.tsx";
import microphoneIcon from "../assets/microphone.svg";
import playIcon from "../assets/play.svg";
import pauseIcon from "../assets/pause.svg";
import stopIcon from "../assets/stop.svg";

function preloadImage(src: string) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.src = src;
  });
}

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
  isControlPanelShown?: boolean;
  isDownloadAudioButtonShown?: boolean;
  animateCurrentPick?: boolean;
  onlyRecording?: boolean;
  isDefaultUIShown?: boolean;
  defaultMicrophoneIconColor?: string;
  defaultAudioWaveIconColor?: string;
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
  controlButtonsClassName?: string;
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
        togglePauseResume,
        startRecording,
        stopRecording,
        saveAudioFile,
        recordingTime,
        isPausedRecordedAudio,
        isPausedRecording,
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
      isControlPanelShown = true,
      isDownloadAudioButtonShown = false,
      animateCurrentPick = true,
      fullscreen = true,
      onlyRecording = false,
      isDefaultUIShown = false,
      defaultMicrophoneIconColor = mainBarColor,
      defaultAudioWaveIconColor = mainBarColor,
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
      controlButtonsClassName,
    },
    ref,
  ) => {
    const [hoveredOffsetX, setHoveredOffsetX] = useState(0);
    const [barsData, setBarsData] = useState<BarsData[]>([]);
    const [canvasCurrentWidth, setCanvasCurrentWidth] = useState(0);
    const [canvasCurrentHeight, setCanvasCurrentHeight] = useState(0);
    const [isRecordedCanvasHovered, setIsRecordedCanvasHovered] =
      useState(false);

    const formattedSpeed = Math.trunc(speed);
    const formattedBarWidth = Math.trunc(barWidth);
    const formattedGap = Math.trunc(gap);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const picksRef = useRef<Array<PickItem | null>>([]);
    const indexSpeedRef = useRef(formattedSpeed);
    const indexRef = useRef(formattedBarWidth);
    const index2Ref = useRef(0);

    const unit = formattedBarWidth + formattedGap * formattedBarWidth;

    const onResize = useCallback((target: HTMLDivElement) => {
      const roundedWidth = Math.floor(target.clientWidth / 2) * 2;
      const roundedHeight = Math.trunc(target.clientHeight);
      setCanvasCurrentWidth(roundedWidth);
      setCanvasCurrentHeight(roundedHeight);
    }, []);

    const canvasContainerRef = useResizeObserver(onResize);

    useEffect(() => {
      preloadImages();

      async function preloadImages() {
        const preloadSrcList = [playIcon, stopIcon, pauseIcon];
        const imagesPromiseList: Promise<unknown>[] = [];
        for (const i of preloadSrcList) {
          imagesPromiseList.push(preloadImage(i));
        }

        await Promise.all(imagesPromiseList);
      }
    }, []);

    useEffect(() => {
      if (isRecordingInProgress || recordedBlob) {
        window.addEventListener("beforeunload", handleBeforeUnload);
      }

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }, [isRecordingInProgress, recordedBlob]);

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

      if (indexSpeedRef.current >= formattedSpeed || !audioData.length) {
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
          barWidth: formattedBarWidth,
          rounded,
          animateCurrentPick,
          fullscreen,
        });
      }

      indexSpeedRef.current += 1;
    }, [
      canvasRef.current,
      audioData,
      canvasCurrentWidth,
      canvasCurrentHeight,
      fullscreen,
      isDefaultUIShown,
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
            formattedBarWidth,
            formattedGap,
          ),
        );
      };

      void processBlob();

      canvasRef.current?.addEventListener(
        "mousemove",
        setCurrentHoveredOffsetX,
      );

      return () => {
        canvasRef.current?.removeEventListener(
          "mousemove",
          setCurrentHoveredOffsetX,
        );
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
        return;
      }

      drawByBlob({
        barsData,
        canvas: canvasRef.current,
        barWidth: formattedBarWidth,
        gap: formattedGap,
        backgroundColor,
        mainBarColor,
        secondaryBarColor,
        currentAudioTime,
        rounded,
        duration,
      });
    }, [
      barsData,
      currentAudioTime,
      isCleared,
      rounded,
      backgroundColor,
      mainBarColor,
      secondaryBarColor,
    ]);

    useEffect(() => {
      if (isProcessingRecordedAudio && canvasRef.current) {
        initialCanvasSetup({
          canvas: canvasRef.current,
          backgroundColor,
        });
      }
    }, [isProcessingRecordedAudio]);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const showTimeIndicator = () => {
      setIsRecordedCanvasHovered(true);
    };

    const hideTimeIndicator = () => {
      setIsRecordedCanvasHovered(false);
    };

    const setCurrentHoveredOffsetX = (e: MouseEvent) => {
      setHoveredOffsetX(e.offsetX);
    };

    const handleRecordedAudioCurrentTime: MouseEventHandler<
      HTMLCanvasElement
    > = (e) => {
      if (
        (ref as MutableRefObject<HTMLAudioElement>)?.current &&
        canvasRef.current
      ) {
        (ref as MutableRefObject<HTMLAudioElement>).current.currentTime =
          (duration / canvasCurrentWidth) *
          (e.clientX - canvasRef.current.getBoundingClientRect().left);
      }
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
            onClick={handleRecordedAudioCurrentTime}
          >
            Your browser does not support HTML5 Canvas.
          </canvas>
          {isDefaultUIShown && isCleared && (
            <>
              <AudioWaveIcon color={defaultAudioWaveIconColor} />
              <AudioWaveIcon color={defaultAudioWaveIconColor} reflect />
              <button
                onClick={startRecording}
                className="canvas__microphone-btn"
              >
                <MicrophoneIcon
                  color={defaultMicrophoneIconColor}
                  stroke={0.5}
                  className="canvas__microphone-icon"
                />
              </button>
            </>
          )}
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
                  left: hoveredOffsetX,
                  display:
                    bufferFromRecordedBlob && canvasCurrentWidth > 768
                      ? "block"
                      : "none",
                }}
              >
                {isProgressIndicatorTimeOnHoverShown && (
                  <p
                    className={`progressIndicatorHovered__time 
                    ${
                      canvasCurrentWidth - hoveredOffsetX < 70
                        ? "progressIndicatorHovered__time-left"
                        : ""
                    } 
                    ${progressIndicatorTimeOnHoverClassName ?? ""}`}
                  >
                    {formatRecordedAudioTime(
                      (duration / canvasCurrentWidth) * hoveredOffsetX,
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

        {isControlPanelShown && (
          <>
            <div className="audioInfo__container">
              {isRecordingInProgress && (
                <p className="audioInfo__current-time">
                  {formatRecordingTime(recordingTime)}
                </p>
              )}
              {duration ? <p>Duration: {duration.toFixed(2)}s</p> : null}
            </div>

            <div className="buttons__container">
              {!isCleared && (
                <button
                  className={`btn__left ${
                    isRecordingInProgress && isPausedRecording
                      ? "btn__left-microphone"
                      : ""
                  }`}
                  onClick={togglePauseResume}
                >
                  <img
                    src={
                      isRecordingInProgress && isPausedRecording
                        ? microphoneIcon
                        : isProcessingRecordedAudio ||
                          (isPausedRecordedAudio && recordedBlob)
                        ? playIcon
                        : pauseIcon
                    }
                    alt="Pause"
                  />
                </button>
              )}
              {!recordedBlob && !isProcessingRecordedAudio && (
                <button
                  className={`btn__center ${
                    isRecordingInProgress || isPausedRecording
                      ? "btn__center-pause"
                      : ""
                  }`}
                  onClick={() => {
                    isRecordingInProgress ? stopRecording() : startRecording();
                  }}
                >
                  <img
                    src={
                      isRecordingInProgress || isPausedRecording
                        ? stopIcon
                        : microphoneIcon
                    }
                    alt="Microphone"
                  />
                </button>
              )}
              {!isCleared && (
                <button
                  onClick={clearCanvas}
                  className={`btn ${controlButtonsClassName ?? ""}`}
                >
                  Clear
                </button>
              )}
              {isDownloadAudioButtonShown && recordedBlob && (
                <button
                  onClick={saveAudioFile}
                  className={`btn ${controlButtonsClassName ?? ""}`}
                >
                  Download Audio
                </button>
              )}
            </div>
          </>
        )}

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

import { MutableRefObject } from "react";

export interface PickItem {
  startY: number;
  height: number;
}

export interface Controls {
  isRecordingInProgress: boolean;
  isPausedRecording: boolean;
  audioData: Uint8Array;
  recordingTime: number;
  mediaRecorder: MediaRecorder | null;
  duration: number;
  currentAudioTime: number;
  audioSrc: string;
  isPausedRecordedAudio: boolean;
  isProcessingRecordedAudio: boolean;
  isCleared: boolean;
  setPreloadedAudioBlob: (blob: unknown) => void;
  recordedBlob: Blob | null;
  bufferFromRecordedBlob: AudioBuffer | null;
  startRecording: () => void;
  togglePauseResume: () => void;
  stopRecording: () => void;
  saveAudioFile: () => void;
  clearCanvas: () => void;
  error: Error | null;
  _handleTimeUpdate: () => void;
  audioRef: MutableRefObject<HTMLAudioElement | null>;
}

export interface BarsData {
  max: number;
}

export interface DrawByLiveStreamParams {
  audioData: Uint8Array;
  unit: number;
  index: MutableRefObject<number>;
  index2: MutableRefObject<number>;
  canvas: HTMLCanvasElement;
  isRecordingInProgress: boolean;
  picks: Array<PickItem | null>;
  backgroundColor: string;
  barWidth: number;
  mainBarColor: string;
  secondaryBarColor: string;
  rounded: number;
  animateCurrentPick: boolean;
  fullscreen: boolean;
}

export interface DrawByBlob {
  barsData: BarsData[];
  canvas: HTMLCanvasElement;
  barWidth: number;
  gap: number;
  backgroundColor: string;
  mainBarColor: string;
  secondaryBarColor: string;
  currentAudioTime?: number;
  rounded: number;
  duration: number;
}

export interface PaintLineFromCenterToRightParams {
  context: CanvasRenderingContext2D;
  color: string;
  rounded: number;
  width: number;
  height: number;
  barWidth: number;
}

export interface GetDataForCanvasParams {
  canvas: HTMLCanvasElement;
  backgroundColor: string;
}

export interface PaintLineParams {
  context: CanvasRenderingContext2D;
  color: string;
  rounded: number | number[];
  x: number;
  y: number;
  w: number;
  h: number;
}

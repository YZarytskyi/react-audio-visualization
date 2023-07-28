import { MutableRefObject } from "react";

export interface PickItem {
  startY: number;
  height: number;
}

export interface Controls {
  isRecording: boolean;
  isPaused: boolean;
  audioData: Uint8Array;
  recordingTime: number;
  mediaRecorder: MediaRecorder | null;
  duration: number;
  currentAudioTime: number;
  audioSrc: string;
  bufferFromRecordedBlob: AudioBuffer | null;
  recordedBlob: Blob | null;
  startRecording: () => void;
  togglePauseResumeRecording: () => void;
  stopRecording: () => void;
  saveAudioFile: () => void;
  playAudio: () => void;
  _handleTimeUpdate: () => void;
  audioRef: MutableRefObject<HTMLAudioElement | null>;
}

export interface BarsData {
  max: number;
  min: number;
}

export interface DrawByLiveStreamParams {
  audioData: Uint8Array;
  index: number;
  canvas: HTMLCanvasElement;
  isRecording: boolean;
  picks: Array<PickItem | null>;
  speed: number;
  backgroundColor: string;
  barWidth: number;
  mainLineColor: string;
  secondaryLineColor: string;
  rounded: number;
  animateCurrentPick: boolean;
}

export interface DrawByBlob {
  barsData: BarsData[];
  canvas: HTMLCanvasElement;
  barWidth: number;
  gap: number;
  backgroundColor: string;
  mainLineColor: string;
  secondaryLineColor: string;
  currentAudioTime?: number;
  rounded: number;
  duration: number;
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

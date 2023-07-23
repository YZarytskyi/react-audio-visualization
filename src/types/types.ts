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
  recordedBlob: Blob | null;
  startRecording: () => void;
  pauseRecording: () => void;
  stopRecording: () => void;
  saveAudioFile: () => void;
}

export interface BarsData {
  max: number;
  min: number;
}

export interface DrawOnCanvasParams {
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
  animateCurrentPick: boolean;
}

export interface DrawByBlob {
  barsData: BarsData[];
  canvas: HTMLCanvasElement;
  barWidth: number;
  gap: number;
  backgroundColor: string;
  mainLineColor: string;
  secondaryLineColor?: string;
  currentTime?: number;
  duration: number;
}

export interface GetDataForCanvasParams {
  canvas: HTMLCanvasElement;
  backgroundColor: string;
}

export interface PaintLineParams {
  context: CanvasRenderingContext2D;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

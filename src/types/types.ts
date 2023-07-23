export interface PickItem {
  startY: number;
  height: number;
  lineToY: number;
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
  picks: PickItem[];
  speed: number;
  backgroundColor: string;
  barWidth: number;
  mainLineColor: string;
  secondaryLineColor: string;
  animateCurrentPick: boolean;
}

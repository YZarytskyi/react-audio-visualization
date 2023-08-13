import { useEffect, useRef, useState } from "react";

import { getFileExtensionFromMimeType } from "../helpers/getFileExtensionFromMimeType.ts";

import { Controls } from "../types/types.ts";

export function useVoiceVisualization(): Controls {
  const [isRecordingInProgress, setIsRecording] = useState(false);
  const [isPausedRecording, setIsPausedRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(0));
  const [isProcessingRecordedAudio, setIsProcessingRecordedAudio] =
    useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [bufferFromRecordedBlob, setBufferFromRecordedBlob] =
    useState<AudioBuffer | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [recordingTime, setRecordingTime] = useState(0);
  const [prevTime, setPrevTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioSrc, setAudioSrc] = useState("");
  const [isPausedRecordedAudio, setIsPausedRecordedAudio] = useState(true);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRecordingRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafCurrentTimeUpdateRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRecordingInProgress) return;

    if (audioContextRef.current && isPausedRecording) return;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setError(null);
        setAudioStream(stream);
        audioContextRef.current = new window.AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        dataArrayRef.current = new Uint8Array(
          analyserRef.current.frequencyBinCount,
        );
        sourceRef.current =
          audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);
        const mediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(mediaRecorder);
        mediaRecorder?.addEventListener("dataavailable", handleDataAvailable);
        mediaRecorder?.start();

        recordingFrame();
      })
      .catch((error) => {
        console.error("Error starting audio recording:", error);
        if (error instanceof Error) {
          setError(error);
          return;
        }
        setError(new Error("Error starting audio recording"));
      });

    return () => {
      if (rafRecordingRef.current)
        cancelAnimationFrame(rafRecordingRef.current);
      if (sourceRef.current) sourceRef.current.disconnect();
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        void audioContextRef.current.close();
      }
    };
  }, [isRecordingInProgress]);

  useEffect(() => {
    if (!isRecordingInProgress || isPausedRecording) return;

    const updateTimer = () => {
      const timeNow = performance.now();
      setRecordingTime((prev) => prev + (timeNow - prevTime));
      setPrevTime(timeNow);
    };

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [prevTime, isPausedRecording, isRecordingInProgress]);

  useEffect(() => {
    if (!recordedBlob) return;

    const processBlob = async () => {
      try {
        setError(null);
        const blob = new Blob([recordedBlob], {
          type: mediaRecorder?.mimeType,
        });
        const audioSrcFromBlob = URL.createObjectURL(blob);
        if (audioSrcFromBlob) setAudioSrc(audioSrcFromBlob);

        const audioBuffer = await recordedBlob.arrayBuffer();
        const audioContext = new AudioContext();
        const buffer = await audioContext.decodeAudioData(audioBuffer);
        setBufferFromRecordedBlob(buffer);
        setDuration(buffer.duration - 0.06);
        setIsProcessingRecordedAudio(false);
      } catch (error) {
        console.error("Error processing the audio blob:", error);
        if (error instanceof Error) {
          setError(error);
          return;
        }
        setError(new Error("Error processing the audio blob"));
      }
    };

    void processBlob();
  }, [recordedBlob]);

  useEffect(() => {
    return () => {
      if (rafCurrentTimeUpdateRef.current) {
        cancelAnimationFrame(rafCurrentTimeUpdateRef.current);
      }
      if (rafRecordingRef.current) {
        cancelAnimationFrame(rafRecordingRef.current);
      }
      if (audioRef?.current) {
        audioRef.current.removeEventListener("ended", onEndedRecordedAudio);
      }
      if (mediaRecorder) {
        mediaRecorder?.removeEventListener(
          "dataavailable",
          handleDataAvailable,
        );
      }
    };
  }, []);

  const recordingFrame = () => {
    analyserRef.current!.getByteTimeDomainData(dataArrayRef.current!);
    setAudioData(new Uint8Array(dataArrayRef.current!));
    rafRecordingRef.current = requestAnimationFrame(recordingFrame);
  };

  const handleDataAvailable = (event: BlobEvent) => setRecordedBlob(event.data);

  const _handleTimeUpdate = () => {
    if (!audioRef.current) return;

    setCurrentAudioTime(audioRef.current.currentTime);
    rafCurrentTimeUpdateRef.current = requestAnimationFrame(_handleTimeUpdate);
  };

  const startRecording = () => {
    if (isRecordingInProgress) return;

    if (audioRef?.current) {
      audioRef.current.removeEventListener("ended", onEndedRecordedAudio);
    }
    setPrevTime(performance.now());
    setIsRecording(true);
    setMediaRecorder(null);
    setRecordedBlob(null);
    setDuration(0);
    setCurrentAudioTime(0);
    setIsPausedRecordedAudio(true);
    setAudioSrc("");
  };

  const stopRecording = () => {
    if (!isRecordingInProgress) return;

    setIsProcessingRecordedAudio(true);
    audioStream?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
    setRecordingTime(0);
    setIsPausedRecording(false);
    mediaRecorder?.stop();
    mediaRecorder?.removeEventListener("dataavailable", handleDataAvailable);
  };

  const togglePauseResume = () => {
    if (isRecordingInProgress) {
      setIsPausedRecording((prevPaused) => !prevPaused);
      if (mediaRecorder?.state === "recording") {
        mediaRecorder?.pause();
        setRecordingTime((prev) => prev + (performance.now() - prevTime));
        if (rafRecordingRef.current) {
          cancelAnimationFrame(rafRecordingRef.current);
        }
      } else {
        mediaRecorder?.resume();
        setPrevTime(performance.now());
        rafRecordingRef.current = requestAnimationFrame(recordingFrame);
      }
      return;
    }

    if (audioRef.current && bufferFromRecordedBlob) {
      if (audioRef.current?.paused) {
        audioRef.current?.addEventListener("ended", onEndedRecordedAudio);
        void audioRef.current?.play();
        setIsPausedRecordedAudio(false);
      } else {
        audioRef.current?.removeEventListener("ended", onEndedRecordedAudio);
        audioRef.current?.pause();
        setIsPausedRecordedAudio(true);
      }
    }
  };

  const onEndedRecordedAudio = () => {
    setIsPausedRecordedAudio(true);
    if (!audioRef?.current) return;
    audioRef.current.currentTime = 0;
    setCurrentAudioTime(0);
  };

  const saveAudioFile = () => {
    if (!audioSrc) return;

    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = audioSrc;
    downloadAnchor.download = `recorded_audio${getFileExtensionFromMimeType(
      mediaRecorder?.mimeType,
    )}`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(audioSrc);
  };

  return {
    isRecordingInProgress,
    isPausedRecording,
    audioData,
    recordingTime,
    isProcessingRecordedAudio,
    recordedBlob,
    mediaRecorder,
    duration,
    currentAudioTime,
    audioSrc,
    isPausedRecordedAudio,
    bufferFromRecordedBlob,
    startRecording,
    togglePauseResume,
    stopRecording,
    saveAudioFile,
    error,
    _handleTimeUpdate,
    audioRef,
  };
}

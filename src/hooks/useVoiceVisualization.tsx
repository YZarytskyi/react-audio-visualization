import { useEffect, useRef, useState } from "react";

import { getFileExtensionFromMimeType } from "../helpers/getFileExtensionFromMimeType.ts";

import { Controls } from "../types/types.ts";

export function useVoiceVisualization(): Controls {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(0));
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [recordingTime, setRecordingTime] = useState(0);
  const [prevTime, setPrevTime] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRecording) return;

    if (audioContextRef.current && isPaused) return;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
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

        tick();
      })
      .catch((error) => {
        console.error("Error starting audio recording:", error);
      });

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (sourceRef.current) sourceRef.current.disconnect();
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        void audioContextRef.current.close();
      }
    };
  }, [isRecording]);

  useEffect(() => {
    if (!isRecording || isPaused) return;

    const updateTimer = () => {
      const timeNow = performance.now();
      setRecordingTime((prev) => prev + (timeNow - prevTime));
      setPrevTime(timeNow);
    };

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [prevTime, isPaused, isRecording]);

  const tick = () => {
    analyserRef.current!.getByteTimeDomainData(dataArrayRef.current!);
    setAudioData(new Uint8Array(dataArrayRef.current!));
    rafIdRef.current = requestAnimationFrame(tick);
  };

  const handleDataAvailable = (event: BlobEvent) => setRecordedBlob(event.data);

  const startRecording = () => {
    if (isRecording) return;

    setMediaRecorder(null);
    setRecordedBlob(null);
    setIsRecording(true);
    setPrevTime(performance.now());
  };

  const togglePauseResumeRecording = () => {
    if (!isRecording) return;

    setIsPaused((prevPaused) => !prevPaused);
    if (mediaRecorder?.state === "recording") {
      mediaRecorder?.pause();
      setRecordingTime((prev) => prev + (performance.now() - prevTime));
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    } else {
      mediaRecorder?.resume();
      setPrevTime(performance.now());
      rafIdRef.current = requestAnimationFrame(tick);
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;

    audioStream?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
    setRecordingTime(0);
    setIsPaused(false);
    mediaRecorder?.stop();
    mediaRecorder?.removeEventListener("dataavailable", handleDataAvailable);
  };

  const saveAudioFile = () => {
    if (!recordedBlob) return;

    const blob = new Blob([recordedBlob], {
      type: mediaRecorder?.mimeType,
    });
    const blobUrl = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = blobUrl;
    downloadAnchor.download = `recorded_audio${getFileExtensionFromMimeType(
      mediaRecorder?.mimeType,
    )}`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(blobUrl);
  };

  return {
    isRecording,
    isPaused,
    audioData,
    recordingTime,
    recordedBlob,
    mediaRecorder,
    startRecording,
    togglePauseResumeRecording,
    stopRecording,
    saveAudioFile,
  };
}

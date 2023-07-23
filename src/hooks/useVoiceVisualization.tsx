import { useEffect, useRef, useState } from "react";
import { Controls } from "../types/types.ts";
import { getFileExtensionFromMimeType } from "../helpers/getFileExtensionFromMimeType.ts";

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
    if (!mediaRecorder || !isRecording) return;
    mediaRecorder?.addEventListener("dataavailable", handleDataAvailable);
    mediaRecorder?.start();
  }, [mediaRecorder, isRecording]);

  useEffect(() => {
    if (isRecording) {
      if (audioContextRef.current && isPaused) return;
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          audioContextRef.current = new window.AudioContext();
          analyserRef.current = audioContextRef.current.createAnalyser();
          dataArrayRef.current = new Uint8Array(
            analyserRef.current.frequencyBinCount,
          );
          sourceRef.current =
            audioContextRef.current.createMediaStreamSource(stream);
          sourceRef.current.connect(analyserRef.current);

          if (!mediaRecorder) setMediaRecorder(new MediaRecorder(stream));

          const tick = () => {
            analyserRef.current!.getByteTimeDomainData(dataArrayRef.current!);
            setAudioData(new Uint8Array(dataArrayRef.current!));
            rafIdRef.current = requestAnimationFrame(tick);
          };

          tick();

          setAudioStream(stream);
        })
        .catch((error) => {
          console.error("Error starting audio recording:", error);
        });
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
    };
  }, [isRecording, isPaused]);

  useEffect(() => {
    if (!isRecording || isPaused) return;

    const updateTimer = () => {
      const now = performance.now();
      setRecordingTime((prev) => prev + (now - prevTime));
      setPrevTime(now);
    };

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [prevTime, isPaused, isRecording]);

  const handleDataAvailable = (event: BlobEvent) => setRecordedBlob(event.data);

  const startRecording = () => {
    setMediaRecorder(null);
    setRecordedBlob(null);
    setIsRecording(true);
    setPrevTime(performance.now());
  };

  const pauseRecording = () => {
    setIsPaused((prevPaused) => !prevPaused);
    if (mediaRecorder?.state === "recording") {
      mediaRecorder?.pause();
      setRecordingTime((prev) => prev + (performance.now() - prevTime));
    } else {
      mediaRecorder?.resume();
      setPrevTime(performance.now());
    }
  };

  const stopRecording = () => {
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
    pauseRecording,
    stopRecording,
    saveAudioFile,
  };
}

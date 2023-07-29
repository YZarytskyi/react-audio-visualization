import { useEffect, useRef, useState } from "react";

import { getFileExtensionFromMimeType } from "../helpers/getFileExtensionFromMimeType.ts";

import { Controls } from "../types/types.ts";

export function useVoiceVisualization(): Controls {
  const [isRecording, setIsRecording] = useState(false);
  const [isPausedRecording, setIsPausedRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(0));
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
  const [currentAudioTime, setCurrentAudioTime] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRecordingRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafCurrentTimeUpdateRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRecording) return;

    if (audioContextRef.current && isPausedRecording) return;
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

        recordingFrame();
      })
      .catch((error) => {
        console.error("Error starting audio recording:", error);
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
  }, [isRecording]);

  useEffect(() => {
    if (!isRecording || isPausedRecording) return;

    const updateTimer = () => {
      const timeNow = performance.now();
      setRecordingTime((prev) => prev + (timeNow - prevTime));
      setPrevTime(timeNow);
    };

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [prevTime, isPausedRecording, isRecording]);

  useEffect(() => {
    if (!recordedBlob) return;

    const processBlob = async () => {
      try {
        const blob = new Blob([recordedBlob], {
          type: mediaRecorder?.mimeType,
        });
        const audioSrcFromBlob = URL.createObjectURL(blob);
        if (audioSrcFromBlob) setAudioSrc(audioSrcFromBlob);

        const audioBuffer = await recordedBlob.arrayBuffer();
        const audioContext = new AudioContext();
        const buffer = await audioContext.decodeAudioData(audioBuffer);
        setBufferFromRecordedBlob(buffer);
        //TODO: magic number
        setDuration(buffer.duration - 0.06);
      } catch (error) {
        console.error("Error processing the audio blob:", error);
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

  const togglePauseResumeRecordedAudio = () => {
    if (!audioRef.current || !bufferFromRecordedBlob) return;

    audioRef.current?.paused
      ? audioRef.current?.play()
      : audioRef.current?.pause();
  };

  const startRecording = () => {
    if (isRecording) return;

    setMediaRecorder(null);
    setRecordedBlob(null);
    setDuration(0);
    setCurrentAudioTime(0);
    setAudioSrc("");
    setIsRecording(true);
    setPrevTime(performance.now());
  };

  const togglePauseResumeRecording = () => {
    if (!isRecording) return;

    setIsPausedRecording((prevPaused) => !prevPaused);
    if (mediaRecorder?.state === "recording") {
      mediaRecorder?.pause();
      setRecordingTime((prev) => prev + (performance.now() - prevTime));
      if (rafRecordingRef.current)
        cancelAnimationFrame(rafRecordingRef.current);
    } else {
      mediaRecorder?.resume();
      setPrevTime(performance.now());
      rafRecordingRef.current = requestAnimationFrame(recordingFrame);
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;

    audioStream?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
    setRecordingTime(0);
    setIsPausedRecording(false);
    mediaRecorder?.stop();
    mediaRecorder?.removeEventListener("dataavailable", handleDataAvailable);
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
    isRecording,
    isPausedRecording,
    audioData,
    recordingTime,
    recordedBlob,
    mediaRecorder,
    duration,
    currentAudioTime,
    audioSrc,
    bufferFromRecordedBlob,
    startRecording,
    togglePauseResumeRecording,
    stopRecording,
    saveAudioFile,
    togglePauseResumeRecordedAudio,
    _handleTimeUpdate,
    audioRef,
  };
}

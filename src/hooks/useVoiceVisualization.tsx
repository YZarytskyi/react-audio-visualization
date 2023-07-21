import { useState } from "react";

export const useVoiceVisualization = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting audio recording:", error);
    }
  };

  const stopRecording = () => {
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
      setIsRecording(false);
    }
  };

  // const pauseRecording = () => {
  //   if (audioStream) {
  //     audioStream.getTracks().forEach((track) => track.stop());
  //     setAudioStream(null);
  //     setIsRecording(false);
  //   }
  // };

  return { isRecording, audioStream, startRecording, stopRecording };
};

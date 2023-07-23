import React, { useEffect } from "react";

import { AudioVisualiser } from "./components/AudioVisualizer.tsx";
import { useVoiceVisualization } from "./hooks/useVoiceVisualization.tsx";

import "./App.css";

const AudioUpload: React.FC = () => {
  const recorderControls = useVoiceVisualization();

  const {
    isRecording,
    isPaused,
    recordedBlob,
    startRecording,
    pauseRecording,
    stopRecording,
    saveAudioFile,
  } = recorderControls;

  useEffect(() => {
    if (!recordedBlob) return;

    const url = URL.createObjectURL(recordedBlob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  }, [recordedBlob]);

  const onClickStartRecording = () => {
    isRecording ? pauseRecording() : startRecording();
  };

  return (
    <div className="container">
      <div className="canvas__container">
        <AudioVisualiser controls={recorderControls} />
      </div>
      <div className="buttons__container">
        <button onClick={onClickStartRecording}>{`${
          isRecording && !isPaused ? "Pause" : "Start"
        } Recording`}</button>
        <button onClick={stopRecording}>Stop Recording</button>
        <button onClick={saveAudioFile}>Save Audio File</button>
      </div>
    </div>
  );
};

export default AudioUpload;

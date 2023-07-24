import React from "react";

import { AudioVisualiser } from "./components/AudioVisualizer.tsx";
import { useVoiceVisualization } from "./hooks/useVoiceVisualization.tsx";

import "./App.css";

const AudioUpload: React.FC = () => {
  const recorderControls = useVoiceVisualization();

  const {
    isRecording,
    isPaused,
    startRecording,
    togglePauseResumeRecording,
    stopRecording,
    saveAudioFile,
  } = recorderControls;

  const onClickStartRecording = () => {
    isRecording ? togglePauseResumeRecording() : startRecording();
  };

  return (
    <div className="container">
      <AudioVisualiser controls={recorderControls} />
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

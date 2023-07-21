import React from "react";

import AudioAnalyser from "./components/AudioAnalyser.tsx";
import { useVoiceVisualization } from "./hooks/useVoiceVisualization.tsx";

import "./App.css";

const AudioUpload: React.FC = () => {
  const { isRecording, audioStream, startRecording, stopRecording } =
    useVoiceVisualization();

  console.log(isRecording);

  return (
    <div className="container">
      <div className="canvas__container">
        <AudioAnalyser audio={audioStream} />
      </div>
      <div className="buttons__container">
        <button onClick={startRecording}>{`${
          isRecording ? "Pause" : "Start"
        } Recording`}</button>
        <button onClick={stopRecording}>Stop Recording</button>
      </div>
    </div>
  );
};

export default AudioUpload;

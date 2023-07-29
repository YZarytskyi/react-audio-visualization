import React from "react";

import { AudioVisualiser } from "./components/AudioVisualizer.tsx";
import { useVoiceVisualization } from "./hooks/useVoiceVisualization.tsx";
import { formatTime } from "./helpers/formatTime.ts";

import "./App.css";

const AudioUpload: React.FC = () => {
  const recorderControls = useVoiceVisualization();
  const {
    isRecording,
    isPausedRecording,
    startRecording,
    togglePauseResumeRecording,
    stopRecording,
    saveAudioFile,
    togglePauseResumeRecordedAudio,
    recordingTime,
    duration,
    audioRef,
  } = recorderControls;
  const onClickStartRecording = () => {
    isRecording ? togglePauseResumeRecording() : startRecording();
  };

  return (
    <div className="container">
      <AudioVisualiser controls={recorderControls} ref={audioRef} />
      <div className="audioInfo__container">
        {isRecording && <p>Time: {formatTime(recordingTime)}</p>}
        {duration ? <p>Duration: {duration.toFixed(2)}s</p> : null}
      </div>
      <button className="btn__play" onClick={togglePauseResumeRecordedAudio}>
        Play music
      </button>
      <div className="buttons__container">
        <button onClick={onClickStartRecording}>{`${
          isRecording && !isPausedRecording ? "Pause" : "Start"
        } Recording`}</button>
        <button onClick={stopRecording}>Stop Recording</button>
        <button onClick={saveAudioFile}>Save Audio File</button>
      </div>
    </div>
  );
};

export default AudioUpload;

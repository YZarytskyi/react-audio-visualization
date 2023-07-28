import React from "react";

import { AudioVisualiser } from "./components/AudioVisualizer.tsx";
import { useVoiceVisualization } from "./hooks/useVoiceVisualization.tsx";

import "./App.css";
import { formatTime } from "./helpers/formatTime.ts";

const AudioUpload: React.FC = () => {
  const recorderControls = useVoiceVisualization();

  const {
    isRecording,
    isPaused,
    startRecording,
    togglePauseResumeRecording,
    stopRecording,
    saveAudioFile,
    playAudio,
    recordingTime,
    duration,
    // audioSrc,
    // currentAudioTime,
    audioRef,
  } = recorderControls;

  const onClickStartRecording = () => {
    isRecording ? togglePauseResumeRecording() : startRecording();
  };

  return (
    <div className="container">
      <AudioVisualiser controls={recorderControls} audioRef={audioRef} />
      {isRecording && <p>Time: {formatTime(recordingTime)}</p>}
      {duration ? <p>Duration: {duration}s</p> : null}
      {/*{audioSrc ? <p>{currentAudioTime.toFixed(2)}</p> : null}*/}
      <button className="btn__play" onClick={playAudio}>
        Play music
      </button>
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

import React, { useEffect } from "react";

import { AudioVisualiser } from "./components/AudioVisualizer.tsx";
import { useVoiceVisualization } from "./hooks/useVoiceVisualization.tsx";
import { formatTime } from "./helpers/formatTime.ts";

import "./App.css";

const AudioUpload: React.FC = () => {
  const recorderControls = useVoiceVisualization();
  const {
    isRecordingInProgress,
    isPausedRecording,
    isProcessingRecordedAudio,
    startRecording,
    togglePauseResume,
    stopRecording,
    saveAudioFile,
    recordedBlob,
    recordingTime,
    isPausedRecordedAudio,
    duration,
    error,
    audioRef,
  } = recorderControls;

  useEffect(() => {
    if (!recordedBlob) return;

    console.log(recordedBlob);
  }, [recordedBlob, error]);

  useEffect(() => {
    if (!error) return;

    console.log(error);
  }, [error]);

  const onClickStartRecording = () => {
    isRecordingInProgress ? togglePauseResume() : startRecording();
  };

  return (
    <div className="container">
      <AudioVisualiser controls={recorderControls} ref={audioRef} />
      <div className="audioInfo__container">
        {isRecordingInProgress && <p>Time: {formatTime(recordingTime)}</p>}
        {duration ? <p>Duration: {duration.toFixed(2)}s</p> : null}
      </div>
      {recordedBlob && (
        <button className="btn__play" onClick={togglePauseResume}>
          {isPausedRecordedAudio ? "Play" : "Pause"} Audio
        </button>
      )}
      <div className="buttons__container">
        <button onClick={onClickStartRecording}>
          {isRecordingInProgress && !isPausedRecording ? "Pause" : "Start"}{" "}
          Recording
        </button>
        {isRecordingInProgress && (
          <button onClick={stopRecording}>Stop Recording</button>
        )}
        {recordedBlob && (
          <button onClick={saveAudioFile}>Save Audio File</button>
        )}
      </div>
    </div>
  );
};

export default AudioUpload;

import React, { useState } from "react";

import "./App.css";
import AudioAnalyser from "./components/AudioAnalyser.tsx";

const AudioUpload: React.FC = () => {
  const [audio, setAudio] = useState<MediaStream | null>(null);

  async function getMicrophone() {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setAudio(audioStream);
    } catch (error) {
      console.log(error);
    }
  }

  function stopMicrophone() {
    audio?.getTracks()?.forEach((track) => track.stop());
    setAudio(null);
  }

  const onClickStartRecording = async () => {
    try {
      await getMicrophone();
    } catch (error) {
      console.log("Cannot get access to microphone", error);
    }
  };

  const onClickStopRecording = () => {
    stopMicrophone();
  };

  return (
    <div className="container">
      <div className="canvas__container">
        <AudioAnalyser audio={audio} />
      </div>
      <div className="buttons__container">
        <button onClick={onClickStartRecording}>Start Recording</button>
        <button onClick={onClickStopRecording}>Stop Recording</button>
      </div>
    </div>
  );
};

export default AudioUpload;

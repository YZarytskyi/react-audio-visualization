import React, { useState } from "react";
import { AudioAnalyser } from "./components/AudioAnalyser.tsx";

// import style from "./AudioUpload.module.scss";

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

  const onClickStartRecording = () => {
    getMicrophone();
  };

  const onClickStopRecording = () => {
    stopMicrophone();
  };

  return (
    <>
      <button onClick={onClickStartRecording}>Start Recording</button>
      <button onClick={onClickStopRecording}>Stop Recording</button>
      {audio && <AudioAnalyser audio={audio} />}
    </>
  );
};

export default AudioUpload;

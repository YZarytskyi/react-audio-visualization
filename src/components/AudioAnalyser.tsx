import { useState, useEffect, useRef, FC } from "react";
import { AudioVisualiser } from "./AudioVisualizer.tsx";

interface AudioAnalyserProps {
  audio: MediaStream | null;
}

const AudioAnalyser: FC<AudioAnalyserProps> = ({ audio }) => {
  const [audioData, setAudioData] = useState(new Uint8Array(0));
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef(new Uint8Array(0));
  const source = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (!audio) {
      setAudioData(new Uint8Array(0));
      return;
    }

    const initAudio = () => {
      try {
        audioContext.current = new window.AudioContext();
        analyser.current = audioContext.current.createAnalyser();
        dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);
        source.current = audioContext.current.createMediaStreamSource(audio);
        source.current.connect(analyser.current);

        const tick = () => {
          analyser?.current?.getByteTimeDomainData(dataArray.current);
          setAudioData(new Uint8Array(dataArray.current));
          rafId.current = requestAnimationFrame(tick);
        };
        tick();
      } catch (error) {
        console.error("Error initializing audio:", error);
      }
    };

    initAudio();

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      if (analyser.current) {
        analyser.current.disconnect();
      }
      if (source.current) {
        source.current.disconnect();
      }
      if (audioContext.current) {
        audioContext?.current.close();
      }
    };
  }, [audio]);

  return <AudioVisualiser audioData={audioData} />;
};

export default AudioAnalyser;

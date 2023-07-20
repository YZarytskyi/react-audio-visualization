import { Component, useEffect, useRef } from "react";
import { AudioVisualiser } from "./AudioVisualizer.tsx";

type AudioAnalyserProps = {
  audio: MediaStream | null;
};

type AudioAnalyserState = {
  audioData: Uint8Array;
};

export class AudioAnalyser extends Component<
  AudioAnalyserProps,
  AudioAnalyserState
> {
  audioContext: AudioContext;
  analyser: AnalyserNode;
  dataArray: Uint8Array;
  source: MediaStreamAudioSourceNode;
  rafId: number;

  constructor(props) {
    super(props);
    this.state = { audioData: new Uint8Array(0) };
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.audioContext = new window.AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.source = this.audioContext.createMediaStreamSource(this.props.audio);
    this.source.connect(this.analyser);
    this.rafId = requestAnimationFrame(this.tick);
  }

  tick() {
    this.analyser.getByteTimeDomainData(this.dataArray);
    this.setState({ audioData: this.dataArray });
    this.rafId = requestAnimationFrame(this.tick);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    this.source.disconnect();
  }

  render() {
    return <AudioVisualiser audioData={this.state.audioData} />;
  }
}

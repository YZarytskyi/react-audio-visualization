import React, { SetStateAction, useEffect, useState } from "react";

import { AudioVisualiser } from "./components/AudioVisualizer.tsx";
import { useVoiceVisualization } from "./hooks/useVoiceVisualization.tsx";
import { formatTime } from "./helpers/formatTime.ts";
import CustomSelect, { SelectOptionsType } from "./components/CustomSelect.tsx";
import { generateOptionsForSelect } from "./helpers/generateOptionsForSelect.ts";

import "./App.css";

const AudioUpload: React.FC = () => {
  const [speed, setSpeed] = useState(2);
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [mainBarColor, setMainBarColor] = useState("#FFFFFF");
  const [secondaryBarColor, setSecondaryBarColor] = useState("#5e5e5e");
  const [barWidth, setBarWidth] = useState(2);
  const [gap, setGap] = useState(1);
  const [rounded, setRounded] = useState(10);
  const [animateCurrentPick, setAnimateCurrentPick] = useState(true);
  const [isProgressIndicatorShown, setIsProgressIndicatorShown] =
    useState(true);
  const [isProgressIndicatorTimeShown, setIsProgressIndicatorTimeShown] =
    useState(true);
  const [isProgressIndicatorOnHoverShown, setIsProgressIndicatorOnHoverShown] =
    useState(true);
  const [
    isProgressIndicatorTimeOnHoverShown,
    setIsProgressIndicatorTimeOnHoverShown,
  ] = useState(true);

  const recorderControls = useVoiceVisualization();
  const {
    isRecordingInProgress,
    isPausedRecording,
    // isProcessingRecordedAudio,
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

  function onChangeSelect<T>(
    newValueObj: unknown,
    setState: React.Dispatch<SetStateAction<T>>,
  ) {
    const newValue = (newValueObj as SelectOptionsType<T>).value;
    setState(
      (typeof newValue === "number" ? newValue : newValue === "true") as T,
    );
  }

  return (
    <div className="container">
      <AudioVisualiser
        controls={recorderControls}
        ref={audioRef}
        speed={speed}
        backgroundColor={backgroundColor}
        mainBarColor={mainBarColor}
        secondaryBarColor={secondaryBarColor}
        barWidth={barWidth}
        gap={gap}
        rounded={rounded}
        animateCurrentPick={animateCurrentPick}
        isProgressIndicatorShown={isProgressIndicatorShown}
        isProgressIndicatorTimeShown={isProgressIndicatorTimeShown}
        isProgressIndicatorOnHoverShown={isProgressIndicatorOnHoverShown}
        isProgressIndicatorTimeOnHoverShown={
          isProgressIndicatorTimeOnHoverShown
        }
      />
      <div className="audioInfo__container">
        {isRecordingInProgress && <p>Time: {formatTime(recordingTime)}</p>}
        {duration ? <p>Duration: {duration.toFixed(2)}s</p> : null}
      </div>
      <div className="buttons__container">
        {recordedBlob && (
          <button className="btn__play" onClick={togglePauseResume}>
            {isPausedRecordedAudio ? "Play" : "Pause"} Audio
          </button>
        )}
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
      <div className="controls__container">
        <div className="controls__selects">
          <label>
            Speed
            <CustomSelect
              options={generateOptionsForSelect([1, 2, 3, 4, 5])}
              defaultValue={generateOptionsForSelect([speed])}
              width="80px"
              onChange={(newValue) => onChangeSelect(newValue, setSpeed)}
            />
          </label>
          <label>
            BarWidth
            <CustomSelect
              options={generateOptionsForSelect([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
              ])}
              defaultValue={generateOptionsForSelect([barWidth])}
              width="80px"
              onChange={(newValue) => onChangeSelect(newValue, setBarWidth)}
            />
          </label>
          <label>
            Gap
            <CustomSelect
              options={generateOptionsForSelect([
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
              ])}
              defaultValue={generateOptionsForSelect([gap])}
              width="80px"
              onChange={(newValue) => onChangeSelect(newValue, setGap)}
            />
          </label>
          <label>
            Rounded
            <CustomSelect
              options={generateOptionsForSelect([0, 1, 2, 3, 4, 5])}
              defaultValue={generateOptionsForSelect([rounded])}
              width="80px"
              onChange={(newValue) => onChangeSelect(newValue, setRounded)}
            />
          </label>
        </div>
        <div className="controls__selects">
          <label>
            AnimateCurrentPick
            <CustomSelect
              options={generateOptionsForSelect(["true", "false"])}
              defaultValue={generateOptionsForSelect(["true"])}
              width="100px"
              onChange={(newValue) =>
                onChangeSelect(newValue, setAnimateCurrentPick)
              }
            />
          </label>
          <label>
            IsProgressIndicatorShown
            <CustomSelect
              options={generateOptionsForSelect(["true", "false"])}
              defaultValue={generateOptionsForSelect(["true"])}
              width="100px"
              onChange={(newValue) =>
                onChangeSelect(newValue, setIsProgressIndicatorShown)
              }
            />
          </label>
          <label>
            IsProgressIndicatorTimeShown
            <CustomSelect
              options={generateOptionsForSelect(["true", "false"])}
              defaultValue={generateOptionsForSelect(["true"])}
              width="100px"
              onChange={(newValue) =>
                onChangeSelect(newValue, setIsProgressIndicatorTimeShown)
              }
            />
          </label>
          <label>
            IsProgressIndicatorOnHoverShown
            <CustomSelect
              options={generateOptionsForSelect(["true", "false"])}
              defaultValue={generateOptionsForSelect(["true"])}
              width="100px"
              onChange={(newValue) =>
                onChangeSelect(newValue, setIsProgressIndicatorOnHoverShown)
              }
            />
          </label>
          <label>
            IsProgressIndicatorTimeOnHoverShown
            <CustomSelect
              options={generateOptionsForSelect(["true", "false"])}
              defaultValue={generateOptionsForSelect(["true"])}
              width="100px"
              onChange={(newValue) =>
                onChangeSelect(newValue, setIsProgressIndicatorTimeOnHoverShown)
              }
            />
          </label>
        </div>
        <div className="controls__inputs">
          <label>
            BackgroundColor
            <input
              className="controls__input"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          </label>
          <label>
            MainBarColor
            <input
              className="controls__input"
              value={mainBarColor}
              onChange={(e) => setMainBarColor(e.target.value)}
            />
          </label>
          <label>
            SecondaryBarColor
            <input
              className="controls__input"
              value={secondaryBarColor}
              onChange={(e) => setSecondaryBarColor(e.target.value)}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default AudioUpload;

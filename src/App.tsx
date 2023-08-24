import { FC, SetStateAction, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

import CustomSelect, { SelectOptionsType } from "./components/CustomSelect.tsx";
import { VoiceVisualiser } from "./components/VoiceVisualizer.tsx";
import { useVoiceVisualizer } from "./hooks/useVoiceVisualizer.tsx";
import { generateOptionsForSelect } from "./helpers/generateOptionsForSelect.ts";
import { formatToInlineStyleValue } from "./helpers/formatToInlineStyleValue.ts";

import "./App.css";

const App: FC = () => {
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("200");
  const [speed, setSpeed] = useState(3);
  const [barWidth, setBarWidth] = useState(2);
  const [gap, setGap] = useState(1);
  const [rounded, setRounded] = useState(5);
  const [isControlPanelShown, setIsControlPanelShown] = useState(true);
  const [isDownloadAudioButtonShown, setIsDownloadAudioButtonShown] =
    useState(false);
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [mainBarColor, setMainBarColor] = useState("#FFFFFF");
  const [secondaryBarColor, setSecondaryBarColor] = useState("#5e5e5e");
  const [fullscreen, setFullscreen] = useState(false);
  const [onlyRecording, setOnlyRecording] = useState(false);
  const [animateCurrentPick, setAnimateCurrentPick] = useState(true);
  const [
    isLineFromCenterToRightShownBeforeRecording,
    setIsLineFromCenterToRightShownBeforeRecording,
  ] = useState(false);
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

  const recorderControls = useVoiceVisualizer();
  const { recordedBlob, error, audioRef } = recorderControls;

  useEffect(() => {
    if (!recordedBlob) return;

    console.log(recordedBlob);
  }, [recordedBlob, error]);

  useEffect(() => {
    if (!error) return;

    console.log(error);
  }, [error]);

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
      <h1 className="title">react-voice-visualizer</h1>

      <VoiceVisualiser
        controls={recorderControls}
        ref={audioRef}
        width={formatToInlineStyleValue(width)}
        height={formatToInlineStyleValue(height)}
        speed={speed}
        backgroundColor={backgroundColor}
        mainBarColor={mainBarColor}
        secondaryBarColor={secondaryBarColor}
        barWidth={barWidth}
        gap={gap}
        rounded={rounded}
        isControlPanelShown={isControlPanelShown}
        isDownloadAudioButtonShown={isDownloadAudioButtonShown}
        fullscreen={fullscreen}
        onlyRecording={onlyRecording}
        animateCurrentPick={animateCurrentPick}
        isLineFromCenterToRightShownBeforeRecording={
          isLineFromCenterToRightShownBeforeRecording
        }
        isProgressIndicatorShown={isProgressIndicatorShown}
        isProgressIndicatorTimeShown={isProgressIndicatorTimeShown}
        isProgressIndicatorOnHoverShown={isProgressIndicatorOnHoverShown}
        isProgressIndicatorTimeOnHoverShown={
          isProgressIndicatorTimeOnHoverShown
        }
      />

      <h2 className="subtitle">Props</h2>

      <div className="controls__container">
        <div className="controls__selects">
          <label>
            <span
              data-tooltip-id="tooltip-width"
              data-tooltip-content="The width of the visualization canvas"
            >
              width &#9432;
            </span>
            <Tooltip className="tooltip__container" id="tooltip-width" />
            <input
              className="controls__input"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </label>
          <label>
            <span
              data-tooltip-id="tooltip-height"
              data-tooltip-content="The height of the visualization canvas"
            >
              height &#9432;
            </span>
            <Tooltip className="tooltip__container" id="tooltip-height" />
            <input
              className="controls__input"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </label>
          <label>
            <span
              data-tooltip-id="tooltip-speed"
              data-tooltip-content="The speed of the audio visualization animation (1 to 5, higher number is slower)"
            >
              speed &#9432;
            </span>
            <Tooltip className="tooltip__container" id="tooltip-speed" />
            <CustomSelect
              options={generateOptionsForSelect([1, 2, 3, 4, 5])}
              defaultValue={generateOptionsForSelect([speed])}
              width="80px"
              onChange={(newValue) => onChangeSelect(newValue, setSpeed)}
            />
          </label>
          <label>
            <span
              data-tooltip-id="tooltip-bar-width"
              data-tooltip-content="The width of each audio wave bar"
            >
              barWidth &#9432;
            </span>
            <Tooltip className="tooltip__container" id="tooltip-bar-width" />
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
            <span
              data-tooltip-id="tooltip-gap"
              data-tooltip-content="The gap between each audio wave bar"
            >
              gap &#9432;
            </span>
            <Tooltip className="tooltip__container" id="tooltip-gap" />
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
            <span
              data-tooltip-id="tooltip-rounded"
              data-tooltip-content="The border radius of the audio wave bars"
            >
              rounded &#9432;
            </span>
            <Tooltip className="tooltip__container" id="tooltip-rounded" />
            <CustomSelect
              options={generateOptionsForSelect([0, 1, 2, 3, 4, 5])}
              defaultValue={generateOptionsForSelect([rounded])}
              width="80px"
              onChange={(newValue) => onChangeSelect(newValue, setRounded)}
            />
          </label>
          <label>
            <span
              data-tooltip-id="tooltip-fullscreen"
              data-tooltip-content="Whether the visualization should be displayed in fullscreen mode. It begins from the center by default"
            >
              fullscreen &#9432;
            </span>
            <Tooltip className="tooltip__container" id="tooltip-fullscreen" />
            <CustomSelect
              options={generateOptionsForSelect(["true", "false"])}
              defaultValue={generateOptionsForSelect(["false"])}
              width="100px"
              onChange={(newValue) => onChangeSelect(newValue, setFullscreen)}
            />
          </label>
          <label>
            <span
              data-tooltip-id="tooltip-only-recording"
              data-tooltip-content="Whether to show the visualization only during voice recording"
            >
              onlyRecording &#9432;
            </span>
            <Tooltip
              className="tooltip__container"
              id="tooltip-only-recording"
            />
            <CustomSelect
              options={generateOptionsForSelect(["true", "false"])}
              defaultValue={generateOptionsForSelect(["false"])}
              width="100px"
              onChange={(newValue) =>
                onChangeSelect(newValue, setOnlyRecording)
              }
            />
          </label>
        </div>

        <div className="controls__inputs">
          <label>
            <span
              data-tooltip-id="tooltip-background"
              data-tooltip-content="The background color of the visualization canvas"
            >
              backgroundColor &#9432;
            </span>
            <Tooltip className="tooltip__container" id="tooltip-background" />
            <input
              className="controls__input"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          </label>
          <label>
            <span
              data-tooltip-id="tooltip-main-color"
              data-tooltip-content="The color of the main audio wave line"
            >
              mainBarColor &#9432;
            </span>
            <Tooltip className="tooltip__container" id="tooltip-main-color" />
            <input
              className="controls__input"
              value={mainBarColor}
              onChange={(e) => setMainBarColor(e.target.value)}
            />
          </label>
          <label>
            <span
              data-tooltip-id="tooltip-secondary-color"
              data-tooltip-content="The secondary color of the audio wave line"
            >
              secondaryBarColor &#9432;
            </span>
            <Tooltip
              className="tooltip__container"
              id="tooltip-secondary-color"
            />
            <input
              className="controls__input"
              value={secondaryBarColor}
              onChange={(e) => setSecondaryBarColor(e.target.value)}
            />
          </label>
          <label>
            <span
              data-tooltip-id="tooltip-control-panel"
              data-tooltip-content="Whether to display the audio control panel, including features such as recorded audio duration, current recording time, and control buttons. If you want to create your own UI, set it to false and utilize functions from the useVoiceVisualizer hook to manage audio control."
            >
              isControlPanelShown &#9432;
            </span>
            <Tooltip
              className="tooltip__container"
              id="tooltip-control-panel"
            />
            <CustomSelect
              options={generateOptionsForSelect(["true", "false"])}
              defaultValue={generateOptionsForSelect(["true"])}
              width="100px"
              onChange={(newValue) =>
                onChangeSelect(newValue, setIsControlPanelShown)
              }
            />
          </label>
          <label>
            <span
              data-tooltip-id="tooltip-download-btn"
              data-tooltip-content="Whether to display the Download audio button"
            >
              isDownloadAudioButtonShown &#9432;
            </span>
            <Tooltip className="tooltip__container" id="tooltip-download-btn" />
            <CustomSelect
              options={generateOptionsForSelect(["true", "false"])}
              defaultValue={generateOptionsForSelect(["false"])}
              width="100px"
              onChange={(newValue) =>
                onChangeSelect(newValue, setIsDownloadAudioButtonShown)
              }
            />
          </label>
          <label>
            <span
              data-tooltip-id="tooltip-default-line"
              data-tooltip-content="Whether to show a line from center to right before recording"
            >
              isLineFromCenterToRightShownBeforeRecording &#9432;
            </span>
            <Tooltip className="tooltip__container" id="tooltip-default-line" />
            <CustomSelect
              options={generateOptionsForSelect(["true", "false"])}
              defaultValue={generateOptionsForSelect(["false"])}
              width="100px"
              onChange={(newValue) =>
                onChangeSelect(
                  newValue,
                  setIsLineFromCenterToRightShownBeforeRecording,
                )
              }
            />
          </label>
        </div>

        <div className="controls__selects">
          <label>
            <span
              data-tooltip-id="tooltip-animate-pick"
              data-tooltip-content="Whether to animate the current pick in the visualization"
            >
              animateCurrentPick &#9432;
            </span>
            <Tooltip className="tooltip__container" id="tooltip-animate-pick" />
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
            <span
              data-tooltip-id="tooltip-progress-indicator"
              data-tooltip-content="Whether to show the progress indicator after recording"
            >
              isProgressIndicatorShown &#9432;
            </span>
            <Tooltip
              className="tooltip__container"
              id="tooltip-progress-indicator"
            />
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
            <span
              data-tooltip-id="tooltip-progress-indicator-time"
              data-tooltip-content="Whether to show the progress indicator time"
            >
              isProgressIndicatorTimeShown &#9432;
            </span>
            <Tooltip
              className="tooltip__container"
              id="tooltip-progress-indicator-time"
            />
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
            <span
              data-tooltip-id="tooltip-progress-indicator-hover"
              data-tooltip-content="Whether to show the progress indicator on hover"
            >
              isProgressIndicatorOnHoverShown &#9432;
            </span>
            <Tooltip
              className="tooltip__container"
              id="tooltip-progress-indicator-hover"
            />
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
            <span
              data-tooltip-id="tooltip-progress-indicator-time-hover"
              data-tooltip-content="Whether to show the progress indicator time on hover"
            >
              isProgressIndicatorTimeOnHoverShown &#9432;
            </span>
            <Tooltip
              className="tooltip__container"
              id="tooltip-progress-indicator-time-hover"
            />
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
      </div>
    </div>
  );
};

export default App;

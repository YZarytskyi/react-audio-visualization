# React Voice Visualizer Library

## Overview

The React Voice Visualizer library offers a comprehensive solution for capturing, visualizing, and manipulating audio recordings within your web applications. Built with React hook and component, this library simplifies the process of integrating audio recording and visualization functionalities using the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). 

This README provides a comprehensive guide to effectively utilizing the library's features.

## Installation

To integrate the React Voice Visualizer library into your project, simply install it via npm or yarn:

```bash
npm install react-voice-visualizer
```

or

```bash
yarn add react-voice-visualizer
```

## Demo App
For a live demonstration of the React Voice Visualizer library, you can check out the [Demo Voice Visualizer App](https://react-voice-visualizer.vercel.app/). This app showcases various features and functionalities of the library in action.

Feel free to explore the demo app to see how the **React Voice Visualizer** can be used in different scenarios. You can refer to the source code of the demo app for additional examples and inspiration for using the library effectively.

## Usage

To start using the VoiceVisualiser component, you will need to import the necessary hook and component from the library.
Here's an example of how to use this library in your `App` component:

```jsx
const App = () => {
    // Initialize the recorder controls using the hook
    const recorderControls = useVoiceVisualizer();
    const {
        // ... (extracted controls and states)
        isRecordingInProgress,
        isPausedRecording,
        audioData,
        recordingTime,
        mediaRecorder,
        duration,
        currentAudioTime,
        audioSrc,
        isPausedRecordedAudio,
        isProcessingRecordedAudio,
        isCleared,
        recordedBlob,
        bufferFromRecordedBlob,
        startRecording,
        togglePauseResume,
        stopRecording,
        saveAudioFile,
        clearCanvas,
        error,
        audioRef,
    } = recorderControls;

    // Get the recorded audio blob
    useEffect(() => {
        if (!recordedBlob) return;

        console.log(recordedBlob);
    }, [recordedBlob, error]);

    // Get the error when it occurs
    useEffect(() => {
        if (!error) return;

        console.log(error);
    }, [error]);

    return (
        <VoiceVisualiser controls={recorderControls} ref={audioRef}/>
    );
};

export default App;
```

## Getting started

1. Import the required components and hooks from the library.
2. Initialize the recorder controls using the `useVoiceVisualizer` hook.
3. Use the provided state and functions to manage audio recording and playback.
4. Render the `VoiceVisualiser` component to display the real-time audio visualization.
5. Use the provided buttons to start, pause, stop, and save the audio recording.

Remember to include necessary CSS styles to customize the components and buttons according to your design preferences.

## API Reference

### Hooks

#### `useVoiceVisualizer()`

A hook that provides recorder controls and state for audio visualization.

##### Usage

```jsx
const recorderControls = useVoiceVisualizer();
```

##### Returns

| Returns                           | Type                                                | Description                                        |
| :-------------------------------- |:----------------------------------------------------| :------------------------------------------------- |
| `isRecordingInProgress`           | `boolean`                                           | Indicates if audio recording is currently in progress. |
| `isPausedRecording`               | `boolean`                                           | Indicates if audio recording is currently paused.  |
| `audioData`                        | `Uint8Array`                                        | Audio data for real-time visualization.           |
| `recordingTime`                    | `number`                                            | Elapsed time during recording in seconds.          |
| `mediaRecorder`                    | `MediaRecorder\| null`                              | MediaRecorder instance used for recording audio.   |
| `duration`                         | `number`                                            | Duration of the recorded audio in seconds.         |
| `currentAudioTime`                 | `number`                                            | Current playback time of the recorded audio.       |
| `audioSrc`                         | `string`                                            | Source URL of the recorded audio file for playback.|
| `isPausedRecordedAudio`            | `boolean`                                           | Indicates if recorded audio playback is paused.    |
| `isProcessingRecordedAudio`        | `boolean`                                           | Indicates if the recorded audio is being processed.|
| `isCleared`                        | `boolean`                                           | Indicates if the canvas has been cleared.          |
| `recordedBlob`                    | `Blob \| null`                                      | Recorded audio data in Blob format.                |
| `bufferFromRecordedBlob`           | `AudioBuffer\| null`                                | Audio buffer from the recorded Blob.               |
| `startRecording`                   | `() => void`                                        | Function to start audio recording.                 |
| `togglePauseResume`                | `() => void`                                        | Function to toggle pause/resume during recording and playback of recorded audio. |
| `stopRecording`                   | `() => void`                                        | Function to stop audio recording.                  |
| `saveAudioFile`                    | `() => void`                                        | Function to save the recorded audio as a file.    |
| `clearCanvas`                      | `() => void`                                        | Function to clear the visualization canvas.       |
| `error`                            | `Error\| null`                                      | Error object if any error occurred during recording or playback. |
| `_handleTimeUpdate`                | `() => void`                                        | Internal function to handle audio time updates during playback. |
| `audioRef`                         | `MutableRefObject`<br/>`<HTMLAudioElement \| null>` | Reference to the audio element used for playback. |


### Components

#### `VoiceVisualiser`

A component that visualizes the real-time audio audio wave during recording.

### Props for AudioVisualizer Component

| Props                                             | Description                                                                                                                                                                                                                                                                                                 | Default       | Type                         |
|:--------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------|:-----------------------------|
| **`controls`**                                    | Provides the audio recording controls and states required for visualization.                                                                                                                                                                                                                                | -             | `Controls` (Required)        |
| **`ref`**                                         | A reference to the audio element - `audioRef` from the `useVoiceVisualizer` hook.                                                                                                                                                                                                                           | -             | `React.RefObject` (Required) |
| **`height`**                                      | The height of the visualization canvas.                                                                                                                                                                                                                                                                     | `200`         | `number` (Optional) |
| **`width`**                                       | The width of the visualization canvas.                                                                                                                                                                                                                                                                      | `100%`        | `number` (Optional) |
| **`speed`**                                       | The speed of the audio visualization animation (1 to 5, higher number is slower).                                                                                                                                                                                                                           | `3`           | `number` (Optional) |
| **`backgroundColor`**                             | The background color of the visualization canvas.                                                                                                                                                                                                                                                           | `transparent` | `string` (Optional) |
| **`mainBarColor`**                                | The color of the main audio wave line.                                                                                                                                                                                                                                                                      | `#FFFFFF`     | `string` (Optional) |
| **`secondaryBarColor`**                           | The secondary color of the audio wave line.                                                                                                                                                                                                                                                                 | `#5e5e5e`     | `string` (Optional) |
| **`barWidth`**                                    | The width of each audio wave bar.                                                                                                                                                                                                                                                                           | `2`           | `number` (Optional) |
| **`gap`**                                         | The gap between each audio wave bar.                                                                                                                                                                                                                                                                        | `1`           | `number` (Optional) |
| **`rounded`**                                     | The border radius of the audio wave bars.                                                                                                                                                                                                                                                                   | `5`           | `number` (Optional) |
| **`isControlPanelShown`**                         | Whether to display the audio control panel, including features such as recorded audio duration, current recording time, and control buttons. If you want to create your own UI, set it to false and utilize functions from the useVoiceVisualizer hook to manage audio control.                             | 'true'        | `boolean` (Optional) |
| **`isDownloadAudioButtonShown`**                  | Whether to display the Download audio button.                                                                                                                                                                                                                                                               | `false`       | `boolean` (Optional) |
| **`fullscreen`**                                  | Whether the visualization should be displayed in fullscreen mode. It begins from the center by default.                                                                                                                                                                                                     | `false`       | `boolean` (Optional) |
| **`animateCurrentPick`**                          | Whether to animate the current pick in the visualization.                                                                                                                                                                                                                                                   | `true`        | `boolean` (Optional) |
| **`onlyRecording`**                               | Whether to show the visualization only during voice recording.                                                                                                                                                                                                                                              | `false`       | `boolean` (Optional) |
| **`isDefaultUIShown`** | Whether to show a default UI on Canvas before recording. If you want to create your own UI, set it to false.                                                                                                                                                                                                | `true`        | `boolean` (Optional) |
| **`canvasContainerClassName`**                    | The CSS class name for the container of the visualization canvas.                                                                                                                                                                                                                                           | -             | `string` (Optional) |
| **`isProgressIndicatorShown`**                    | Whether to show the progress indicator after recording.                                                                                                                                                                                                                                                     | `true`        | `boolean` (Optional) |
| **`progressIndicatorClassName`**                  | The CSS class name for the progress indicator.                                                                                                                                                                                                                                                              | -             | `string` (Optional) |
| **`isProgressIndicatorTimeShown`**                | Whether to show the progress indicator time.                                                                                                                                                                                                                                                                | `true`        | `boolean` (Optional) |
| **`progressIndicatorTimeClassName`**              | The CSS class name for the progress indicator with time.                                                                                                                                                                                                                                                    | -             | `string` (Optional) |
| **`isProgressIndicatorOnHoverShown`**             | Whether to show the progress indicator on hover.                                                                                                                                                                                                                                                            | `true`        | `boolean` (Optional) |
| **`progressIndicatorOnHoverClassName`**           | The CSS class name for the progress indicator on hover.                                                                                                                                                                                                                                                     | -             | `string` (Optional) |
| **`isProgressIndicatorTimeOnHoverShown`**         | Whether to show the progress indicator time on hover.                                                                                                                                                                                                                                                       | `true`        | `boolean` (Optional) |
| **`progressIndicatorTimeOnHoverClassName`**       | The CSS class name for the progress indicator with time on hover.                                                                                                                                                                                                                                           | -             | `string` (Optional) |
| **`isAudioProcessingTextShown`**                  | Whether to show the audio processing text.                                                                                                                                                                                                                                                                  | `true`        | `boolean` (Optional) |
| **`audioProcessingTextClassName`**                | The CSS class name for the audio processing text.                                                                                                                                                                                                                                                           | -             | `string` (Optional) |
| **`controlButtonsClassName`**                | The CSS class name for the Clear Button and Download Audio button components.                                                                                                                                                                                                                               | -             | `string` (Optional) |


## License

This library is distributed under the MIT License.

## Issues

If you encounter any bugs or have suggestions for improvements, please report them in the GitHub Issues section.

## Support

For support or general questions, you can reach out to [zarytskyi222@gmail.com](mailto:zarytskyi222@gmail.com).

## Credits

This library was created by [Yurii Zarytskyi](https://github.com/YZarytskyi).
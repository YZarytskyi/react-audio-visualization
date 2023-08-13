# Audio recording visualizer library

## Overview

The Audio recording visualizer library is a React component that provides an easy way to capture, visualize, and
manipulate audio recordings in your web applications. It utilizes React hooks and component to enable audio recording
and visualization. This README file will guide you on how to use the library effectively.

## Installation

To use the AudioUpload library in your project, you can install it via npm or yarn:

```bash
npm install audio-voice-visualizer
```

or

```bash
yarn add audio-voice-visualizer
```

## Getting Started

To start using the AudioUpload component, you will need to import the necessary hooks and components from the library.
Here's an example of how to use this library in your `App` component:

```jsx
const App = () => {
    // Initialize the recorder controls using the hook
    const recorderControls = useVoiceVisualization();
    const {
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
        recordedBlob,
        bufferFromRecordedBlob,
        startRecording,
        togglePauseResume,
        stopRecording,
        saveAudioFile,
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
        <AudioVisualiser controls={recorderControls} ref={audioRef}/>
    );
};

export default AudioUpload;
```

## Usage

1. Import the required components and hooks from the library.
2. Initialize the recorder controls using the `useVoiceVisualization` hook.
3. Use the provided state and functions to manage audio recording and playback.
4. Render the `AudioVisualiser` component to display the real-time audio visualization.
5. Use the provided buttons to start, pause, stop, and save the audio recording.

Remember to include the necessary CSS styles to style the components and buttons as desired.

## API Reference

### Hooks

#### `useVoiceVisualization()`

A hook that provides recorder controls and state for audio visualization.

##### Usage

```jsx
const recorderControls = useVoiceVisualization();
```

##### Returns

- `audioData`: `Uint8Array` - Audio data for real-time visualization.
- `recordingTime`: `number` - The elapsed time during recording in seconds.
- `mediaRecorder`: `MediaRecorder | null` - The MediaRecorder instance used for recording audio.
- `duration`: `number` - The duration of the recorded audio in seconds.
- `currentAudioTime`: `number` - The current playback time of the recorded audio in seconds.
- `audioSrc`: `string` - The source URL of the recorded audio file for playback.
- `isPausedRecordedAudio`: `boolean` - Indicates if recorded audio playback is paused.
- `isProcessingRecordedAudio`: `boolean` - Indicates if the recorded audio is currently being processed.
- `recordedBlob`: `Blob | null` - The recorded audio data in Blob format.
- `bufferFromRecordedBlob`: `AudioBuffer | null` - Audio buffer from the recorded Blob.
- `startRecording`: `function` - Function to start audio recording.
- `togglePauseResume`: `function` - Function to toggle pause/resume during recording and playing recorded audio.
- `stopRecording`: `function` - Function to stop audio recording.
- `saveAudioFile`: `function` - Function to save the recorded audio as a file.
- `error`: `Error | null` - An error object if any error occurred during recording or playback.
- `_handleTimeUpdate`: `function` - Internal function to handle audio time updates during playback.
- `audioRef`: `MutableRefObject<HTMLAudioElement | null>` - A reference to the audio element used for playback.

### Components

#### `AudioVisualiser`

A component that visualizes the real-time audio waveform during recording.

### Props for AudioVisualizer Component

- `controls`: `Controls` **(required)** - Provides the audio recording controls and states required for visualization.
- `ref`: `React.RefObject` **(required)** - A reference to the audio element for playback control.


- `speed`: `number` **(optional)** - The speed of the audio visualization animation.
- `height`: `number` **(optional)** - The height of the visualization canvas.
- `width`: `number` **(optional)** - The width of the visualization canvas.
- `backgroundColor`: `string` **(optional)** - The background color of the visualization canvas.
- `mainBarColor`: `string` **(optional)** - The color of the main waveform line.
- `secondaryBarColor`: `string` **(optional)** - The color of the secondary waveform line.
- `barWidth`: `number` **(optional)** - The width of each waveform bar.
- `gap`: `number` **(optional)** - The gap between each waveform bar.
- `rounded`: `number` **(optional)** - The border radius of the waveform bars.
- `animateCurrentPick`: `boolean` **(optional)** - Whether to animate the current pick in the visualization.
- `canvasContainerClassName`: `string` **(optional)** - The CSS class name for the container of the visualization canvas.
- `isProgressIndicatorShown`: `boolean` **(optional)** - Whether to show the progress indicator.
- `progressIndicatorClassName`: `string` **(optional)** - The CSS class name for the progress indicator.
- `isProgressIndicatorTimeShown`: `boolean` **(optional)** - Whether to show the progress indicator with time.
- `progressIndicatorTimeClassName`: `string` **(optional)** - The CSS class name for the progress indicator with time.
- `isProgressIndicatorOnHoverShown`: `boolean` **(optional)** - Whether to show the progress indicator on hover.
- `progressIndicatorOnHoverClassName`: `string` **(optional)** - The CSS class name for the progress indicator on hover.
- `isProgressIndicatorTimeOnHoverShown`: `boolean` **(optional)** - Whether to show the progress indicator with time on hover.
- `progressIndicatorTimeOnHoverClassName`: `string` **(optional)** - The CSS class name for the progress indicator with time on hover.


## License

This library is distributed under the MIT License. See the LICENSE file for more information.

## Issues

If you encounter any bugs or have suggestions for improvements, please report them in the GitHub Issues section.

## Support

For support or general questions, you can reach out to [zarytskyi222@gmail.com](mailto:zarytskyi222@gmail.com).

## Credits

This library was created with love by [Yurii Zarytskyi](https://github.com/YZarytskyi).
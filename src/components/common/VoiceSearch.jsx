import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

export const VoiceSearch = () => {
  const { listening, transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  if (!browserSupportsSpeechRecognition) {
    return <span>This browser does not support voice search</span>;
  }

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button
        onTouchStart={startListening}
        onMouseDown={startListening}
        onTouchEnd={SpeechRecognition.stopListening}
        onMouseUp={SpeechRecognition.stopListening}>
        Hold to talk
      </button>
      <p className='text-white'>{transcript}</p>
    </div>
  );
};

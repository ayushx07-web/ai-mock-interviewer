// src/components/interview/AnswerInput.jsx
import { useState } from 'react';
import { Type, Mic } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import LoadingSpinner from '../common/LoadingSpinner';
import { useVoiceRecorder, RECORDER_STATES } from '../../hooks/useVoiceRecorder';

export default function AnswerInput({ onSubmit, isSubmitting, disabled = false }) {
  const [mode, setMode] = useState('text'); // 'text' | 'voice'
  const [textValue, setTextValue] = useState('');
  const voice = useVoiceRecorder();

  const handleModeChange = (newMode) => {
    if (newMode === mode) return;
    voice.resetRecorder();
    setTextValue('');
    setMode(newMode);
  };

  const handleSubmit = () => {
    const answerText = mode === 'voice' ? voice.fullTranscript : textValue;
    onSubmit({
      answerText,
      durationSecs: mode === 'voice' ? voice.durationSecs : Math.ceil(textValue.length / 20),
      fillerCount: mode === 'voice' ? voice.fillerCount : 0,
      audioBlob: mode === 'voice' ? voice.audioBlob : null,
    });
  };

  const canSubmit =
    !isSubmitting &&
    !disabled &&
    (mode === 'text'
      ? textValue.trim().length > 0
      : voice.fullTranscript.length > 0 && !voice.isRecording);

  return (
    <div className="flex flex-col gap-4">
      {/* Mode toggle */}
      <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-sm w-fit border border-border">
        <button
          onClick={() => handleModeChange('text')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
            mode === 'text'
              ? 'bg-surface text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Type className="w-3 h-3" />
          Text answer
        </button>
        <button
          onClick={() => handleModeChange('voice')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
            mode === 'voice'
              ? 'bg-surface text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Mic className="w-3 h-3" />
          Voice answer
        </button>
      </div>

      {/* Input area */}
      {mode === 'text' ? (
        <textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          disabled={disabled || isSubmitting}
          placeholder="Type your answer here. Be specific and include relevant examples…"
          rows={7}
          className="input-base resize-none leading-relaxed"
        />
      ) : (
        <VoiceRecorder voice={voice} disabled={disabled || isSubmitting} />
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="btn-primary self-start"
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size="sm" />
            AI is evaluating your answer…
          </>
        ) : (
          'Submit answer'
        )}
      </button>
    </div>
  );
}

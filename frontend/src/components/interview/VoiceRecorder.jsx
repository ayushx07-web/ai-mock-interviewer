// src/components/interview/VoiceRecorder.jsx
import { Mic, MicOff, Square, AlertCircle } from 'lucide-react';
import { RECORDER_STATES } from '../../hooks/useVoiceRecorder';
import { formatDuration } from '../../utils/formatters';

export default function VoiceRecorder({ voice, disabled = false }) {
  const { state, isRecording, isSupported, transcript, interimTranscript, fillerCount, durationSecs, errorMessage, startRecording, stopRecording } = voice;

  if (!isSupported) {
    return (
      <div className="flex items-start gap-3 p-4 bg-surface-2 border border-border rounded-lg">
        <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Voice not supported</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your browser doesn't support voice recording. Please use Chrome or Edge, or switch to text mode.
          </p>
        </div>
      </div>
    );
  }

  if (state === RECORDER_STATES.ERROR) {
    return (
      <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-destructive">Recording error</p>
          <p className="text-sm text-muted-foreground mt-0.5">{errorMessage}</p>
          <button
            onClick={voice.resetRecorder}
            className="text-xs text-primary hover:text-primary-hover transition-colors mt-2"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Record / Stop Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            isRecording
              ? 'bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25'
              : 'bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25'
          }`}
        >
          {/* Pulsing ring when recording */}
          {isRecording && (
            <span className="absolute -inset-0.5 rounded-lg animate-ping bg-destructive/20 pointer-events-none" />
          )}
          {isRecording ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              Stop recording
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              {state === RECORDER_STATES.STOPPED ? 'Record again' : 'Start recording'}
            </>
          )}
        </button>

        {/* Duration counter */}
        {isRecording && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-sm font-mono text-muted-foreground tabular-nums">
              {formatDuration(durationSecs)}
            </span>
          </div>
        )}

        {state === RECORDER_STATES.STOPPED && durationSecs > 0 && (
          <span className="text-xs text-muted-foreground">
            Recorded {formatDuration(durationSecs)}
          </span>
        )}
      </div>

      {/* Live transcript area */}
      <div className="min-h-[100px] bg-surface-2 border border-border rounded-lg p-4">
        {!transcript && !interimTranscript ? (
          <p className="text-sm text-muted select-none">
            {isRecording ? 'Listening… start speaking' : 'Your transcript will appear here while recording.'}
          </p>
        ) : (
          <p className="text-sm text-foreground leading-relaxed">
            {transcript}
            {interimTranscript && (
              <span className="text-muted-foreground italic"> {interimTranscript}</span>
            )}
          </p>
        )}
      </div>

      {/* Filler word warning */}
      {fillerCount > 0 && (
        <div className="flex items-center gap-2">
          <MicOff className="w-3.5 h-3.5 text-warning" />
          <p className="text-xs text-warning">
            {fillerCount} filler word{fillerCount > 1 ? 's' : ''} detected (um, uh, like, etc.)
          </p>
        </div>
      )}
    </div>
  );
}

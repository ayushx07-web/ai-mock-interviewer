// src/hooks/useVoiceRecorder.js
import { useState, useRef, useCallback, useEffect } from 'react';
import { FILLER_WORDS } from '../utils/constants';

export const RECORDER_STATES = {
  IDLE: 'idle',
  RECORDING: 'recording',
  STOPPED: 'stopped',
  ERROR: 'error',
};

export function useVoiceRecorder() {
  const [state, setState] = useState(RECORDER_STATES.IDLE);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [fillerCount, setFillerCount] = useState(0);
  const [durationSecs, setDurationSecs] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const finalTranscriptRef = useRef('');

  const isSupported = !!(
    (window.SpeechRecognition || window.webkitSpeechRecognition) &&
    navigator.mediaDevices?.getUserMedia
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  const countFillers = useCallback((text) => {
    const lower = text.toLowerCase();
    let count = 0;
    FILLER_WORDS.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lower.match(regex);
      if (matches) count += matches.length;
    });
    return count;
  }, []);

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setState(RECORDER_STATES.ERROR);
      setErrorMessage('Voice recording is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    setErrorMessage('');
    finalTranscriptRef.current = '';

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // --- MediaRecorder for audio blob ---
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorder.start(250); // collect in 250ms chunks

      // --- SpeechRecognition for live transcript ---
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscriptRef.current += result[0].transcript + ' ';
          } else {
            interim += result[0].transcript;
          }
        }
        const finalText = finalTranscriptRef.current.trim();
        setTranscript(finalText);
        setInterimTranscript(interim);
        setFillerCount(countFillers(finalText + ' ' + interim));
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone access and try again.');
          setState(RECORDER_STATES.ERROR);
        } else if (event.error !== 'no-speech') {
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setInterimTranscript('');
      };

      recognition.start();

      // --- Duration timer ---
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setDurationSecs(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

      setState(RECORDER_STATES.RECORDING);
      setTranscript('');
      setInterimTranscript('');
      setFillerCount(0);
      setDurationSecs(0);
      setAudioBlob(null);
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Microphone access was denied. Please allow microphone access and try again.');
      } else {
        setErrorMessage('Could not start recording. Please try again.');
      }
      setState(RECORDER_STATES.ERROR);
    }
  }, [isSupported, countFillers]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setInterimTranscript('');
    setState(RECORDER_STATES.STOPPED);
  }, []);

  const resetRecorder = useCallback(() => {
    stopRecording();
    setTranscript('');
    setInterimTranscript('');
    setAudioBlob(null);
    setFillerCount(0);
    setDurationSecs(0);
    setErrorMessage('');
    finalTranscriptRef.current = '';
    setState(RECORDER_STATES.IDLE);
  }, [stopRecording]);

  return {
    state,
    isRecording: state === RECORDER_STATES.RECORDING,
    isStopped: state === RECORDER_STATES.STOPPED,
    hasError: state === RECORDER_STATES.ERROR,
    isSupported,
    transcript,
    interimTranscript,
    fullTranscript: (transcript + ' ' + interimTranscript).trim(),
    audioBlob,
    fillerCount,
    durationSecs,
    errorMessage,
    startRecording,
    stopRecording,
    resetRecorder,
  };
}

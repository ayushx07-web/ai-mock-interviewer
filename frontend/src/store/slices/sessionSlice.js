// src/store/slices/sessionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSessionId: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: {}, // questionId -> { text, score, feedback, audioUrl }
  status: 'idle', // 'idle' | 'in_progress' | 'completed'
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    startSession(state, action) {
      const { sessionId, questions } = action.payload;
      state.currentSessionId = sessionId;
      state.questions = questions;
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.status = 'in_progress';
    },
    recordAnswer(state, action) {
      const { questionId, answerData } = action.payload;
      state.answers[questionId] = answerData;
    },
    nextQuestion(state) {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    completeSession(state) {
      state.status = 'completed';
    },
    resetSession(state) {
      state.currentSessionId = null;
      state.questions = [];
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.status = 'idle';
    },
  },
});

export const { startSession, recordAnswer, nextQuestion, completeSession, resetSession } = sessionSlice.actions;
export default sessionSlice.reducer;

// Selectors
export const selectCurrentSessionId = (state) => state.session.currentSessionId;
export const selectQuestions = (state) => state.session.questions;
export const selectCurrentQuestionIndex = (state) => state.session.currentQuestionIndex;
export const selectCurrentQuestion = (state) =>
  state.session.questions[state.session.currentQuestionIndex] || null;
export const selectAnswers = (state) => state.session.answers;
export const selectSessionStatus = (state) => state.session.status;

// src/hooks/useSession.js
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentSessionId,
  selectQuestions,
  selectCurrentQuestionIndex,
  selectCurrentQuestion,
  selectAnswers,
  selectSessionStatus,
  startSession,
  recordAnswer,
  nextQuestion,
  completeSession,
  resetSession,
} from '../store/slices/sessionSlice';

export function useSession() {
  const dispatch = useDispatch();

  return {
    currentSessionId: useSelector(selectCurrentSessionId),
    questions: useSelector(selectQuestions),
    currentQuestionIndex: useSelector(selectCurrentQuestionIndex),
    currentQuestion: useSelector(selectCurrentQuestion),
    answers: useSelector(selectAnswers),
    status: useSelector(selectSessionStatus),

    startSession: (sessionId, questions) => dispatch(startSession({ sessionId, questions })),
    recordAnswer: (questionId, answerData) => dispatch(recordAnswer({ questionId, answerData })),
    nextQuestion: () => dispatch(nextQuestion()),
    completeSession: () => dispatch(completeSession()),
    resetSession: () => dispatch(resetSession()),
  };
}

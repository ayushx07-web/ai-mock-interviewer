// src/pages/interview/InterviewPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AlertCircle, ChevronRight, CheckCircle } from 'lucide-react';
import { useSession } from '../../hooks/useSession';
import { useGetSessionQuery, useCompleteSessionMutation } from '../../store/api/sessionApi';
import { useSubmitAnswerMutation } from '../../store/api/answerApi';
import QuestionCard from '../../components/interview/QuestionCard';
import AnswerInput from '../../components/interview/AnswerInput';
import ScoreCard from '../../components/interview/ScoreCard';
import SessionProgress from '../../components/interview/SessionProgress';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function InterviewPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const {
    questions,
    currentQuestionIndex,
    currentQuestion,
    startSession,
    recordAnswer,
    nextQuestion,
    completeSession,
  } = useSession();

  // Load session from API when Redux is empty (e.g. page refresh)
  const { data: sessionData, isLoading: sessionLoading, error: sessionError } = useGetSessionQuery(
    sessionId,
    { skip: questions.length > 0 }
  );

  const [submitAnswer, { isLoading: isSubmitting }] = useSubmitAnswerMutation();
  const [completeSessionMut, { isLoading: isCompleting }] = useCompleteSessionMutation();

  // The result of the current question's answer (shown after submit)
  const [currentResult, setCurrentResult] = useState(null);
  // Key to force AnswerInput to remount (reset state) when moving to next question
  const [answerKey, setAnswerKey] = useState(0);

  useEffect(() => {
    if (sessionData?.data && questions.length === 0) {
      startSession(sessionData.data.id, sessionData.data.questions);
    }
  }, [sessionData, questions.length, startSession]);

  const handleSubmit = async ({ answerText, durationSecs, fillerCount }) => {
    if (!currentQuestion) return;
    if (!answerText.trim()) {
      toast.error('Please provide an answer before submitting.');
      return;
    }

    try {
      const result = await submitAnswer({
        sessionId: Number(sessionId),
        body: {
          questionId: currentQuestion.id,
          answerText: answerText.trim(),
          durationSecs: durationSecs || 30,
          fillerCount: fillerCount || 0,
        },
      }).unwrap();

      const answerData = result.data;
      recordAnswer(currentQuestion.id, {
        text: answerText,
        score: answerData.score,
        feedback: answerData.aiFeedback,
      });
      setCurrentResult(answerData);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to submit answer. Please try again.');
    }
  };

  const handleNext = async () => {
    const isLast = currentQuestionIndex === questions.length - 1;

    if (isLast) {
      try {
        await completeSessionMut(Number(sessionId)).unwrap();
        completeSession();
        navigate(`/interview/${sessionId}/result`);
      } catch {
        toast.error('Failed to complete session. Please try again.');
      }
    } else {
      nextQuestion();
      setCurrentResult(null);
      setAnswerKey((k) => k + 1); // force AnswerInput to remount and reset
    }
  };

  // Loading state
  if (sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-24">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading your interview session…</p>
      </div>
    );
  }

  // Error state
  if (sessionError && questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-24">
        <AlertCircle className="w-8 h-8 text-destructive" />
        <p className="text-sm font-medium text-foreground">Failed to load session</p>
        <p className="text-sm text-muted-foreground">Please go back and try again.</p>
        <button onClick={() => navigate('/interview/setup')} className="btn-primary mt-2">
          Back to setup
        </button>
      </div>
    );
  }

  // No question edge case
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-full py-24">
        <p className="text-sm text-muted-foreground">No questions found for this session.</p>
      </div>
    );
  }

  const isLast = currentQuestionIndex === questions.length - 1;
  const isAnswered = !!currentResult;

  return (
    <div className="px-8 py-6 max-w-2xl w-full">
      {/* Progress bar */}
      <SessionProgress
        current={currentQuestionIndex + 1}
        total={questions.length}
        className="mb-8"
      />

      {/* Question */}
      <div className="mb-6 pb-6 border-b border-border">
        <QuestionCard
          question={currentQuestion}
          index={currentQuestionIndex}
          total={questions.length}
        />
      </div>

      {/* Answer section — before submit */}
      {!isAnswered && (
        <AnswerInput
          key={answerKey}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Score section — after submit */}
      {isAnswered && (
        <div className="flex flex-col gap-5">
          <ScoreCard result={currentResult} />

          <button
            onClick={handleNext}
            disabled={isCompleting}
            className="btn-primary self-start"
          >
            {isCompleting ? (
              <>
                <LoadingSpinner size="sm" />
                Finishing…
              </>
            ) : isLast ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Finish interview
              </>
            ) : (
              <>
                Next question
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

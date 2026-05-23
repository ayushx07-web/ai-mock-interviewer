// src/pages/history/SessionDetailPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { useGetSessionQuery } from '../../store/api/sessionApi';
import ScoreCard from '../../components/interview/ScoreCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDateTime, getScoreBg } from '../../utils/formatters';

export default function SessionDetailPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetSessionQuery(sessionId);

  const session = data?.data;
  const answers = session?.answers || [];

  const avgScore =
    answers.length > 0
      ? Math.round(answers.reduce((acc, a) => acc + (a.score || 0), 0) / answers.length)
      : 0;

  return (
    <div className="px-8 py-6 max-w-2xl">
      <button
        onClick={() => navigate('/history')}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to history
      </button>

      {isLoading ? (
        <div className="flex items-center gap-2 py-4 text-muted-foreground text-sm">
          <LoadingSpinner size="sm" />
          Loading session…
        </div>
      ) : !session ? (
        <p className="text-sm text-muted-foreground">Session not found.</p>
      ) : (
        <>
          <div className="mb-5">
            <h1 className="text-2xl font-semibold text-foreground">
              {session.targetRole} — {session.companyType}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {formatDateTime(session.startedAt)} · {session.difficulty}
            </p>
          </div>

          {session.status === 'COMPLETED' && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-muted-foreground">Overall score:</span>
              <span className={`text-sm font-semibold px-2.5 py-1 rounded ${getScoreBg(avgScore)}`}>
                {avgScore}/100
              </span>
            </div>
          )}

          <div className="flex flex-col gap-5">
            {answers.map((answer, idx) => (
              <div key={answer.id} className="flex flex-col gap-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Q{idx + 1}: {answer.question?.content}
                </p>
                {answer.answerText && (
                  <p className="text-sm text-muted-foreground italic">"{answer.answerText}"</p>
                )}
                <ScoreCard result={answer} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

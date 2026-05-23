// src/pages/interview/ResultPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { RotateCcw, LayoutDashboard, TrendingUp, Award, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { useGetSessionQuery } from '../../store/api/sessionApi';
import { useSession } from '../../hooks/useSession';
import ScoreCard from '../../components/interview/ScoreCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDateTime } from '../../utils/formatters';

function OverallScoreMeter({ score }) {
  const getStyle = (s) => {
    if (s >= 70) return { color: 'text-success', bar: 'bg-success', label: 'Strong performance' };
    if (s >= 40) return { color: 'text-warning', bar: 'bg-warning', label: 'Room to improve' };
    return { color: 'text-destructive', bar: 'bg-destructive', label: 'Needs significant work' };
  };
  const style = getStyle(score);

  return (
    <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Overall Score</p>
          <p className={clsx('text-5xl font-semibold tabular-nums', style.color)}>
            {score}
            <span className="text-xl text-muted-foreground">/100</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Award className={clsx('w-8 h-8', style.color)} />
          <p className={clsx('text-xs font-medium', style.color)}>{style.label}</p>
        </div>
      </div>
      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-1000', style.bar)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function ResultPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { resetSession } = useSession();
  const { data, isLoading } = useGetSessionQuery(sessionId);

  const session = data?.data;
  const answers = session?.answers || [];

  const avgScore =
    answers.length > 0
      ? Math.round(answers.reduce((acc, a) => acc + (a.score ?? 0), 0) / answers.length)
      : 0;

  const handleNewInterview = () => {
    resetSession();
    navigate('/interview/setup');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-24">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading your results…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 gap-3">
        <p className="text-sm font-medium text-foreground">Session not found.</p>
        <button onClick={() => navigate('/history')} className="btn-secondary">
          View history
        </button>
      </div>
    );
  }

  return (
    <div className="px-8 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Interview Complete</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {session.targetRole} · {session.companyType} · {session.difficulty}
          {session.startedAt && (
            <span className="ml-2 text-muted">{formatDateTime(session.startedAt)}</span>
          )}
        </p>
      </div>

      {/* Overall score */}
      <div className="mb-8">
        <OverallScoreMeter score={avgScore} />
      </div>

      {/* AI Summary (if present) */}
      {session.summary && (
        <div className="mb-8 flex gap-3 p-4 bg-primary/5 border border-primary/10 rounded-lg">
          <MessageSquare className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-primary mb-1">AI Summary</p>
            <p className="text-sm text-foreground leading-relaxed">{session.summary}</p>
          </div>
        </div>
      )}

      {/* Per-question breakdown */}
      {answers.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Question Breakdown</p>
          </div>
          <div className="flex flex-col gap-6">
            {answers.map((answer, idx) => (
              <div key={answer.id} className="flex flex-col gap-2">
                {/* Question text */}
                <p className="text-sm font-medium text-foreground">
                  <span className="text-muted-foreground mr-2">Q{idx + 1}.</span>
                  {answer.question?.content}
                </p>
                {/* Candidate's answer */}
                {answer.answerText && (
                  <p className="text-sm text-muted-foreground pl-4 border-l border-border italic leading-relaxed">
                    "{answer.answerText}"
                  </p>
                )}
                {/* Score card */}
                <ScoreCard result={answer} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={handleNewInterview} className="btn-primary">
          <RotateCcw className="w-4 h-4" />
          New interview
        </button>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>
        <button onClick={() => navigate('/history')} className="btn-ghost">
          View all history
        </button>
      </div>
    </div>
  );
}

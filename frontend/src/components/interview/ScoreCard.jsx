// src/components/interview/ScoreCard.jsx
import { clsx } from 'clsx';
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react';

function getScoreStyle(score) {
  if (score >= 70) return { bar: 'bg-success', badge: 'bg-success/10 text-success', label: 'Good' };
  if (score >= 40) return { bar: 'bg-warning', badge: 'bg-warning/10 text-warning', label: 'Average' };
  return { bar: 'bg-destructive', badge: 'bg-destructive/10 text-destructive', label: 'Needs Work' };
}

function parseKeywords(feedbackText) {
  const covered = feedbackText?.match(/Keywords Covered:\s*([^\n]*)/)?.[1]
    ?.split(',').map((k) => k.trim()).filter(Boolean) || [];
  const missed = feedbackText?.match(/Keywords Missed:\s*([^\n]*)/)?.[1]
    ?.split(',').map((k) => k.trim()).filter(Boolean) || [];
  const mainFeedback = feedbackText?.split('\n')[0]?.trim() || feedbackText || '';
  return { covered, missed, mainFeedback };
}

export default function ScoreCard({ result, className = '' }) {
  if (!result) return null;

  const score = result.score ?? 0;
  const style = getScoreStyle(score);
  const { covered, missed, mainFeedback } = parseKeywords(result.aiFeedback);

  return (
    <div className={clsx('bg-surface border border-border rounded-lg overflow-hidden', className)}>
      {/* Score header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-foreground">AI Evaluation</p>
          <span className={clsx('text-xs font-medium px-2 py-0.5 rounded', style.badge)}>
            {style.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-semibold text-foreground tabular-nums">{score}</p>
          <p className="text-sm text-muted-foreground">/100</p>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-1 bg-border w-full">
        <div
          className={clsx('h-full transition-all duration-700', style.bar)}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Feedback body */}
      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Main feedback */}
        {mainFeedback && !mainFeedback.startsWith('Scoring') && (
          <div className="flex gap-3">
            <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground leading-relaxed">{mainFeedback}</p>
          </div>
        )}

        {/* Keywords */}
        <div className="grid grid-cols-2 gap-4">
          {covered.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-3.5 h-3.5 text-success" />
                <p className="text-xs font-medium text-success">Covered</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {covered.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs bg-success/10 text-success border border-success/20 px-2 py-0.5 rounded"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
          {missed.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <XCircle className="w-3.5 h-3.5 text-destructive" />
                <p className="text-xs font-medium text-destructive">Missed</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {missed.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs bg-destructive/10 text-destructive border border-destructive/20 px-2 py-0.5 rounded"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

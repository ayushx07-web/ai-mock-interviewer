// src/components/interview/QuestionCard.jsx
import { clsx } from 'clsx';

const TYPE_STYLES = {
  DSA: 'bg-primary/10 text-primary',
  SYSTEM_DESIGN: 'bg-warning/10 text-warning',
  BEHAVIORAL: 'bg-success/10 text-success',
  RESUME: 'bg-muted/20 text-muted-foreground',
};

const DIFFICULTY_STYLES = {
  EASY: 'text-success',
  MEDIUM: 'text-warning',
  HARD: 'text-destructive',
};

export default function QuestionCard({ question, index, total }) {
  if (!question) return null;

  const typeStyle = TYPE_STYLES[question.type] || 'bg-surface-2 text-muted-foreground';
  const diffStyle = DIFFICULTY_STYLES[question.difficulty] || 'text-muted-foreground';

  return (
    <div className="flex flex-col gap-3">
      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium">
          Question {index + 1} of {total}
        </span>
        <span className="text-muted select-none">·</span>
        <span className={clsx('text-xs font-medium px-2 py-0.5 rounded', typeStyle)}>
          {question.type?.replace('_', ' ')}
        </span>
        <span className={clsx('text-xs font-medium', diffStyle)}>
          {question.difficulty}
        </span>
      </div>

      {/* Question text */}
      <p className="text-base font-medium text-foreground leading-relaxed">
        {question.content}
      </p>

      {/* Role / Company hint */}
      {(question.roleTag || question.companyTag) && (
        <p className="text-xs text-muted-foreground">
          {[question.roleTag, question.companyTag].filter(Boolean).join(' · ')}
        </p>
      )}
    </div>
  );
}

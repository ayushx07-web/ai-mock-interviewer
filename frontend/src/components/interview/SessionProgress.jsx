// src/components/interview/SessionProgress.jsx
import { clsx } from 'clsx';

export default function SessionProgress({ current, total, className = '' }) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          Question <span className="text-primary">{current}</span> of {total}
        </p>
        <p className="text-xs text-muted-foreground tabular-nums">{percentage}% complete</p>
      </div>
      <div className="w-full h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {/* Dot indicators for small question counts */}
      {total <= 10 && (
        <div className="flex items-center gap-1.5 mt-0.5">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={clsx(
                'rounded-full transition-all duration-300',
                i < current
                  ? 'w-2 h-2 bg-primary'
                  : i === current - 1
                  ? 'w-2 h-2 bg-primary'
                  : 'w-1.5 h-1.5 bg-border'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

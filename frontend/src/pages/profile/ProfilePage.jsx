// src/pages/profile/ProfilePage.jsx
import { useAuth } from '../../hooks/useAuth';
import { useGetMyProgressQuery } from '../../store/api/progressApi';
import { formatDate, getScoreBg } from '../../utils/formatters';
import { User, TrendingUp, TrendingDown } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: progressData, isLoading } = useGetMyProgressQuery();
  const progress = progressData?.data || [];

  return (
    <div className="px-8 py-6 max-w-xl">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Profile</h1>

      {/* User info */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold text-primary flex-shrink-0">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          {user?.targetRole && (
            <p className="text-xs text-muted mt-0.5">Target: {user.targetRole}</p>
          )}
        </div>
      </div>

      {/* Weekly stats */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground mb-1">Weekly progress</p>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading progress…</p>
        ) : progress.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-3 text-center">
            <TrendingUp className="w-7 h-7 text-muted" />
            <p className="text-sm font-medium text-foreground">No progress data yet</p>
            <p className="text-sm text-muted-foreground">
              Complete interviews each week to see your progress stats.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {progress.map((stat) => (
              <div key={stat.id} className="py-3 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-foreground">
                    Week of {formatDate(stat.weekStart)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.sessionsCount} session{stat.sessionsCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {stat.bestCategory && (
                    <span className="text-xs text-success flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.bestCategory}
                    </span>
                  )}
                  {stat.weakCategory && stat.weakCategory !== stat.bestCategory && (
                    <span className="text-xs text-destructive flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      {stat.weakCategory}
                    </span>
                  )}
                  {stat.avgScore && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${getScoreBg(stat.avgScore)}`}>
                      {Math.round(stat.avgScore)}/100
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

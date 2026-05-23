// src/pages/dashboard/DashboardPage.jsx
import { useNavigate } from 'react-router-dom';
import { Play, History, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useGetMySessionsQuery } from '../../store/api/sessionApi';
import { useGetMyProgressQuery } from '../../store/api/progressApi';
import { formatDate, getScoreBg } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';

function StatCard({ label, value, sub }) {
  return (
    <div className="flex flex-col gap-1 py-4">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: sessionsData, isLoading: sessionsLoading } = useGetMySessionsQuery();
  const { data: progressData } = useGetMyProgressQuery();

  const sessions = sessionsData?.data || [];
  const progress = progressData?.data || [];
  const latestProgress = progress[0];

  const completedSessions = sessions.filter((s) => s.status === 'COMPLETED');
  const avgScore =
    completedSessions.length > 0
      ? Math.round(
          completedSessions.reduce((acc, s) => acc + (s.totalScore || 0), 0) /
            completedSessions.length
        )
      : null;
  const recentSessions = sessions.slice(0, 5);

  return (
    <div className="px-8 py-6 max-w-4xl">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Good to see you, {user?.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {completedSessions.length === 0
            ? 'Start your first interview to track your progress.'
            : `You've completed ${completedSessions.length} interview${completedSessions.length > 1 ? 's' : ''}.`}
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate('/interview/setup')}
        className="btn-primary mb-8"
      >
        <Play className="w-4 h-4" />
        Start New Interview
      </button>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-px bg-border mb-8 border border-border rounded-lg overflow-hidden">
        <div className="bg-surface px-5">
          <StatCard
            label="Sessions completed"
            value={sessionsLoading ? '—' : completedSessions.length}
            sub="all time"
          />
        </div>
        <div className="bg-surface px-5">
          <StatCard
            label="Average score"
            value={avgScore !== null ? `${avgScore}` : '—'}
            sub="across completed sessions"
          />
        </div>
        <div className="bg-surface px-5">
          <StatCard
            label="Best category"
            value={latestProgress?.bestCategory || '—'}
            sub={latestProgress ? `week of ${formatDate(latestProgress.weekStart)}` : 'no data yet'}
          />
        </div>
      </div>

      {/* Recent sessions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-foreground">Recent sessions</p>
          <button
            onClick={() => navigate('/history')}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </button>
        </div>

        {sessionsLoading ? (
          <div className="flex items-center gap-2 py-4 text-muted-foreground text-sm">
            <LoadingSpinner size="sm" />
            Loading sessions…
          </div>
        ) : recentSessions.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-3 text-center">
            <History className="w-8 h-8 text-muted" />
            <p className="text-sm font-medium text-foreground">No sessions yet</p>
            <p className="text-sm text-muted-foreground">
              Complete your first interview to see it here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {recentSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => navigate(`/history/${session.id}`)}
                className="flex items-center justify-between py-3 text-left hover:bg-surface-2 px-2 -mx-2 rounded transition-colors"
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-foreground">
                    {session.targetRole} — {session.companyType}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(session.startedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {session.status === 'COMPLETED' && session.totalScore != null ? (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${getScoreBg(session.totalScore)}`}>
                      {Math.round(session.totalScore)}/100
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground bg-surface-2 px-2 py-0.5 rounded">
                      In progress
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

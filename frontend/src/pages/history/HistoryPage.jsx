// src/pages/history/HistoryPage.jsx
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, History } from 'lucide-react';
import { useGetMySessionsQuery } from '../../store/api/sessionApi';
import { formatDate, getScoreBg } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetMySessionsQuery();
  const sessions = data?.data || [];

  return (
    <div className="px-8 py-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Interview History</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{sessions.length} total session{sessions.length !== 1 ? 's' : ''}</p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 py-4 text-muted-foreground text-sm">
          <LoadingSpinner size="sm" />
          Loading sessions…
        </div>
      ) : sessions.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3 text-center">
          <History className="w-8 h-8 text-muted" />
          <p className="text-sm font-medium text-foreground">No sessions yet</p>
          <p className="text-sm text-muted-foreground">Complete your first interview to see it here.</p>
          <button onClick={() => navigate('/interview/setup')} className="btn-primary mt-2">
            Start interview
          </button>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => navigate(`/history/${session.id}`)}
              className="flex items-center justify-between py-4 text-left hover:bg-surface-2 px-2 -mx-2 rounded transition-colors group"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">
                  {session.targetRole} — {session.companyType}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {formatDate(session.startedAt)} · {session.difficulty}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {session.status === 'COMPLETED' && session.totalScore != null ? (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${getScoreBg(session.totalScore)}`}>
                    {Math.round(session.totalScore)}/100
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">In progress</span>
                )}
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

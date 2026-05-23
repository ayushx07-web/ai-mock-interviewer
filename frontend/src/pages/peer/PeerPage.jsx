// src/pages/peer/PeerPage.jsx
import { Users } from 'lucide-react';

export default function PeerPage() {
  return (
    <div className="px-8 py-6 max-w-xl">
      <h1 className="text-2xl font-semibold text-foreground mb-1">Peer Practice</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Practice interviews with other candidates in real-time.
      </p>

      <div className="py-14 flex flex-col items-center gap-3 text-center">
        <Users className="w-8 h-8 text-muted" />
        <p className="text-sm font-medium text-foreground">Coming soon</p>
        <p className="text-sm text-muted-foreground">
          Peer practice sessions will be available in a future update.
        </p>
      </div>
    </div>
  );
}

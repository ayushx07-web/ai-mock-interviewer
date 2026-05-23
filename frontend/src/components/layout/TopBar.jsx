// src/components/layout/TopBar.jsx
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/interview/setup': 'New Interview',
  '/history': 'Interview History',
  '/peer': 'Peer Practice',
  '/profile': 'Profile',
};

function getTitle(pathname) {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith('/interview/') && pathname.endsWith('/result')) return 'Session Result';
  if (pathname.startsWith('/interview/')) return 'Interview Session';
  if (pathname.startsWith('/history/')) return 'Session Detail';
  return 'MockInterview AI';
}

export default function TopBar() {
  const location = useLocation();
  const title = getTitle(location.pathname);

  return (
    <header className="h-12 border-b border-border flex items-center px-6 bg-surface flex-shrink-0">
      <h1 className="text-sm font-medium text-foreground">{title}</h1>
    </header>
  );
}

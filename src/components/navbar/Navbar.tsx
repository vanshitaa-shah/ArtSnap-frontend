'use client';
import { askForInstallation } from '@/lib/swUtils';
import { Button } from '../ui/button';
import { installPrompt } from '@/Root';
import useNotification from '@/hooks/useNotification';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { permissionStatus, askForNotificationPermission } = useNotification();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-slate-900 p-2 md:p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-2 md:gap-0 md:justify-between">
        <Link
          to="/"
          className="text-white text-xl font-bold hover:text-slate-300 transition-colors"
        >
          Art Snap
        </Link>
        
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto">
          {'Notification' in window && !permissionStatus && (
            <Button
              className="bg-slate-900 text-white hover:bg-slate-900/90 rounded transition w-full md:w-auto text-sm md:text-base"
              onClick={askForNotificationPermission}
            >
              Enable notifications
            </Button>
          )}
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 w-full md:w-auto text-sm md:text-base"
            onClick={() => askForInstallation(installPrompt)}
          >
            {location.pathname === '/' ? (
              <Link to="/arts">Go To Gallery</Link>
            ) : (
              <Link to="/">Add Art</Link>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}

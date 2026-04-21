import { Outlet, Navigate, NavLink, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

export default function Layout() {
  const { user, theme } = useStore();
  const location = useLocation();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme); // We mostly stay dark, but keep state sync
  }, [theme]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`flex h-screen ${theme} bg-background font-sans overflow-hidden text-foreground`}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 transition-opacity duration-500 z-10 relative bg-background">
        <TopNavbar />
        
        {/* Persistent Tabs Navigation */}
        <div className="px-6 lg:px-10 border-b border-white/5 bg-background">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar max-w-[1400px] mx-auto w-full">
            {[
              { name: 'Overview', path: '/' }, 
              { name: 'Transaction', path: '/transactions' }, 
              { name: 'Analytics', path: '/analytics' }, 
              { name: 'Reports', path: '/reports' }, 
              { name: 'Notifications', path: '/notifications' }
            ].map((tab) => {
              const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
              return (
                <NavLink 
                  key={tab.name} 
                  to={tab.path}
                  className={`pb-4 text-sm font-medium transition-colors whitespace-nowrap relative ${
                    isActive ? 'text-white' : 'text-muted-foreground hover:text-white/80'
                  }`}
                >
                  {tab.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(244,63,94,0.8)]"></div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        <main className="flex-1 p-6 lg:px-10 lg:py-6 overflow-y-auto scroll-smooth">
          <AnimatePresence mode="wait">
            <div className="max-w-[1400px] mx-auto pb-12 w-full">
              <Outlet />
            </div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

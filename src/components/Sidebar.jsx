import { useStore } from '@/store/useStore';
import { LayoutDashboard, Wallet, BarChart3, Bell, User, LogOut, FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { auth } from '@/services/firebase';
import { signOut } from 'firebase/auth';

export default function Sidebar() {
  const handleLogout = async () => {
    const currentUser = useStore.getState().user;
    
    // Clear store state first
    useStore.getState().setUser(null);
    
    // Only call Firebase signOut if it's not a guest session
    if (currentUser && currentUser.uid !== 'guest') {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Firebase logout error:", error);
      }
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Transactions', icon: Wallet, path: '/transactions' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Reports', icon: FileText, path: '/reports' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
  ];

  return (
    <aside className="w-[80px] flex flex-col items-center py-6 bg-card border-r border-white/5 hidden md:flex shrink-0">
      
      {/* Sleek Logo */}
      <div className="mb-12 relative group cursor-pointer">
        <div className="w-10 h-12 relative flex items-center justify-center">
           {/* Abstract floating cubes to match the screenshot pink 3D logo */}
           <div className="absolute w-6 h-6 bg-primary rounded-sm transform rotate-45 skew-x-12 shadow-[0_0_15px_rgba(244,63,94,0.6)]"></div>
           <div className="absolute w-6 h-6 bg-white/20 rounded-sm transform rotate-45 skew-x-12 -translate-y-2 translate-x-2 backdrop-blur-md border border-white/30"></div>
           <div className="absolute w-6 h-6 bg-white/10 rounded-sm transform rotate-45 skew-x-12 translate-y-2 -translate-x-2 backdrop-blur-md border border-white/10"></div>
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col items-center gap-6 w-full">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={item.name}
            className={({ isActive }) =>
              `relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group ${
                isActive
                   ? 'text-primary bg-primary/10'
                   : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-lg shadow-[0_0_10px_rgba(244,63,94,0.8)]"></div>
                )}
                <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" strokeWidth={isActive ? 2.5 : 2} />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-4 items-center w-full">
        <NavLink
            to="/settings"
            title="Settings"
            className={({ isActive }) =>
              `relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group ${
                isActive
                   ? 'text-primary bg-primary/10'
                   : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`
            }
          >
             {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-lg shadow-[0_0_10px_rgba(244,63,94,0.8)]"></div>
                )}
                <User className="w-5 h-5 transition-transform group-hover:scale-110" strokeWidth={isActive ? 2.5 : 2} />
              </>
            )}
        </NavLink>
        
        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}

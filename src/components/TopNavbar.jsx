import { useStore } from '@/store/useStore';
import { Search, Bell } from 'lucide-react';

export default function TopNavbar() {
  const { user } = useStore();
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <header className="px-6 lg:px-10 py-6 flex items-center justify-between w-full bg-background z-20">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
          <span className="font-normal text-muted-foreground">Good Morning </span>
          {userName}
        </h2>
        <p className="text-sm text-muted-foreground tracking-wide">
          Your personalized financial dashboard.
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center relative">
           <Search className="w-4 h-4 text-muted-foreground absolute left-3" />
           <input 
             type="text" 
             placeholder="Search" 
             className="bg-card border border-white/5 rounded-full pl-10 pr-12 w-64 h-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-muted-foreground transition-all"
           />
           <div className="absolute right-3 flex items-center gap-1 opacity-50">
             <kbd className="font-sans text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white">⌘K</kbd>
           </div>
        </div>
        
        {/* Notification Bell */}
        <button className="w-10 h-10 rounded-full border border-white/5 bg-card flex items-center justify-center text-muted-foreground hover:text-white transition-colors relative">
           <Bell className="w-4 h-4" />
           <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-2">
          <div className="flex flex-col items-end hidden sm:flex">
             <span className="text-sm font-semibold text-white leading-none mb-1">{userName}</span>
             <span className="text-xs text-muted-foreground leading-none">{user?.email || 'user@example.com'}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-orange-500 flex items-center justify-center text-white font-bold overflow-hidden border-2 border-white/10">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
            ) : (
              userName[0].toUpperCase()
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

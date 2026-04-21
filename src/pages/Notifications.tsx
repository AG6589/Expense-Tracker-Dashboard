import React from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle2, TrendingUp, Info, MoreVertical, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'success' | 'info' | 'warning';
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    title: 'Budget Alert',
    message: 'You have reached 80% of your Monthly Food Budget.',
    time: '2 hours ago',
    type: 'warning',
    read: false,
  },
  {
    id: '2',
    title: 'Income Received',
    message: 'Your Salary of $5,000 has been credited to your account.',
    time: '5 hours ago',
    type: 'success',
    read: false,
  },
  {
    id: '3',
    title: 'New Feature',
    message: 'Check out the new Analytics dashboard for deeper insights.',
    time: '1 day ago',
    type: 'info',
    read: true,
  },
  {
    id: '4',
    title: 'Security Notice',
    message: 'Successful login from a new device in San Francisco.',
    time: '2 days ago',
    type: 'alert',
    read: true,
  },
  {
    id: '5',
    title: 'Monthly Summary',
    message: 'Your June financial report is now available for download.',
    time: '3 days ago',
    type: 'success',
    read: true,
  },
];

const Notifications: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'alert': return <TrendingUp className="w-5 h-5 text-primary" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Recent Notifications</h2>
          <p className="text-muted-foreground mt-1">Keep track of your financial alerts and updates.</p>
        </div>
        <button className="px-4 py-2 bg-secondary/50 hover:bg-secondary text-white text-sm font-medium rounded-xl border border-white/5 transition-all">
          Mark all as read
        </button>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            variants={item}
            className={`flex items-start gap-4 p-5 rounded-2xl border transition-all hover:bg-white/[0.02] cursor-pointer group ${
              notif.read ? 'bg-card/50 border-white/5' : 'bg-card border-primary/20 shadow-[0_0_20px_rgba(244,63,94,0.05)]'
            }`}
          >
            <div className={`p-3 rounded-xl ${
              notif.read ? 'bg-secondary/50' : 'bg-primary/10'
            }`}>
              {getIcon(notif.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`font-semibold ${notif.read ? 'text-white/80' : 'text-white'}`}>
                  {notif.title}
                </h3>
                <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">{notif.time}</span>
              </div>
              <p className={`text-sm leading-relaxed ${notif.read ? 'text-muted-foreground' : 'text-white/70'}`}>
                {notif.message}
              </p>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <button className="p-2 text-muted-foreground hover:text-white rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
              {!notif.read && (
                <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse"></div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-center pt-6">
        <button className="text-sm font-medium text-muted-foreground hover:text-white flex items-center gap-2 transition-all group">
          <Trash2 className="w-4 h-4 group-hover:text-red-500 transition-colors" />
          Clear notification history
        </button>
      </div>
    </div>
  );
};

export default Notifications;

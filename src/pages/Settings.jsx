import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/services/firebase';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, CreditCard } from 'lucide-react';

export default function Settings() {
  const { user, theme, toggleTheme } = useStore();
  
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (user?.uid === 'guest') {
      toast.success('Profile updated (Guest mode simulated)');
      return;
    }
    if (!auth.currentUser) return;
    
    try {
      if (name !== user?.displayName) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      if (email !== user?.email) {
        await updateEmail(auth.currentUser, email);
      }
      if (password) {
        await updatePassword(auth.currentUser, password);
      }
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile. You might need to re-login.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
        <p className="text-muted-foreground text-sm">Personalize your Xpense experience and manage your account.</p>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Navigation / Categories */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-2">
            {[
              { id: 'profile', label: 'Profile', icon: User, active: true },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'appearance', label: 'Appearance', icon: Palette },
              { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
            ].map((item) => (
              <button 
                key={item.id}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  item.active 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
        </motion.div>

        {/* Content Area */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-none bg-card p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] -mr-10 -mt-10"></div>
            
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Account Information
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4 relative z-10">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Your Name" 
                    className="bg-white/5 border-white/10 h-11 rounded-xl transition-all focus:bg-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="bg-white/5 border-white/10 h-11 rounded-xl transition-all focus:bg-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Update Password</label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Keep empty to stay unchanged" 
                  className="bg-white/5 border-white/10 h-11 rounded-xl transition-all focus:bg-white/10"
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="px-8 h-11 rounded-xl font-semibold shadow-lg shadow-primary/20">
                  Update Profile
                </Button>
              </div>
            </form>
          </Card>

          <Card className="glass-card border-none bg-card p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              App Preferences
            </h3>
            
            <div className="space-y-6">
               <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold">Dark Theme</div>
                  <div className="text-xs text-muted-foreground">Toggle between high-contrast themes.</div>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    theme === 'dark' ? 'bg-primary' : 'bg-white/20'
                  }`}
                >
                  <motion.div 
                    animate={{ x: theme === 'dark' ? 24 : 0 }}
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="space-y-0.5">
                  <div className="text-sm font-semibold">Default Currency</div>
                  <div className="text-xs text-muted-foreground">Set your primary accounting currency.</div>
                </div>
                <select className="bg-white/5 border border-white/10 px-3 py-1.5 text-xs rounded-lg focus:outline-none font-medium">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>
          </Card>

          <div className="pt-4 flex justify-end gap-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            <span>Core v1.2.0</span>
            <span className="text-white/10">•</span>
            <span>API Stable</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

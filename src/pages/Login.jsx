import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/services/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Logged in successfully!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully!');
      }
      navigate('/');
    } catch (error) {
      if (error.code === 'auth/api-key-not-valid' || error.message?.includes('api-key-not-valid')) {
        toast.error('Firebase Config missing! Please configure your .env file or use "Guest Demo".', { duration: 5000 });
      } else if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
        toast.error('Auth provider disabled! Please enable "Email/Password" in the Firebase Console (Build > Authentication > Sign-in method).', { duration: 7000 });
      } else {
        toast.error(error.message || 'Authentication failed');
      }
    }
  };

  const handleGuestLogin = () => {
    // Bypass firebase entirely for demo purposes
    useStore.getState().setUser({ uid: 'guest', email: 'guest@demo.com', displayName: 'Demo User' });
    toast.success('Logged in as Guest!');
    navigate('/');
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Logged in with Google!');
      navigate('/');
    } catch (error) {
      if (error.code === 'auth/api-key-not-valid' || error.message?.includes('api-key-not-valid')) {
        toast.error('Firebase Config missing! Please configure your .env file or use "Guest Demo".', { duration: 5000 });
      } else if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
        toast.error('Google Auth disabled! Please enable "Google" in the Firebase Console (Build > Authentication > Sign-in method).', { duration: 7000 });
      } else {
        toast.error(error.message || 'Google Auth failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-blue-600/20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 glass-card rounded-2xl relative z-10 mx-4"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-xl">
            E
          </div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Welcome to Xpense</h2>
          <p className="text-muted-foreground">Master your money, beautifully.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <Input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border-white/10 h-12"
            />
          </div>
          <div>
            <Input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/5 border-white/10 h-12"
            />
          </div>
          <Button type="submit" className="w-full h-12 text-lg font-semibold rounded-xl mt-2">
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-border/50"></div>
          <span className="text-sm text-muted-foreground uppercase tracking-wider">or continue with</span>
          <div className="h-px flex-1 bg-border/50"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button 
            variant="outline" 
            onClick={handleGoogleAuth} 
            className="w-full h-12 bg-white/5 hover:bg-white/10 border-white/10 rounded-xl font-medium"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </Button>

          <Button 
            variant="outline" 
            onClick={handleGuestLogin} 
            className="w-full h-12 bg-white/5 hover:bg-white/10 border-white/10 rounded-xl font-medium"
          >
            Guest Demo
          </Button>
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-medium"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

import { useEffect } from 'react';
import { format, subMonths } from 'date-fns';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useStore } from '@/store/useStore';
import { db } from '@/services/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import Settings from '@/pages/Settings';
import Analytics from '@/pages/Analytics';
import Reports from '@/pages/Reports';
import Notifications from '@/pages/Notifications';

function App() {
  const { setUser, setIsLoading, isLoading, setTransactions, user } = useStore();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      const currentUserState = useStore.getState().user;
      if (currentUserState?.uid !== 'guest') {
        setUser(currentUser);
      }
      setIsLoading(false);
    });

    return () => unsubscribeAuth();
  }, [setUser, setIsLoading]);

  useEffect(() => {
    if (!user) return;

    if (user.uid === 'guest') {
      const now = new Date();
      const mockData = [
        { id: '1', amount: 5000, category: 'Salary', date: format(subMonths(now, 0), 'yyyy-MM-01'), description: 'Monthly Salary', type: 'income', userId: 'guest' },
        { id: '2', amount: 1200, category: 'Rent', date: format(subMonths(now, 0), 'yyyy-MM-02'), description: 'Apartment Rent', type: 'expense', userId: 'guest' },
        { id: '3', amount: 150, category: 'Groceries', date: format(subMonths(now, 0), 'yyyy-MM-05'), description: 'Weekly Groceries', type: 'expense', userId: 'guest' },
        { id: '4', amount: 80, category: 'Entertainment', date: format(subMonths(now, 1), 'yyyy-MM-08'), description: 'Movie Night', type: 'expense', userId: 'guest' },
        { id: '5', amount: 300, category: 'Freelance', date: format(subMonths(now, 1), 'yyyy-MM-15'), description: 'Web Design Project', type: 'income', userId: 'guest' },
        { id: '6', amount: 200, category: 'Food', date: format(subMonths(now, 2), 'yyyy-MM-20'), description: 'Dinner Out', type: 'expense', userId: 'guest' },
        { id: '7', amount: 4500, category: 'Salary', date: format(subMonths(now, 1), 'yyyy-MM-01'), description: 'Monthly Salary', type: 'income', userId: 'guest' },
        { id: '8', amount: 1200, category: 'Rent', date: format(subMonths(now, 1), 'yyyy-MM-02'), description: 'Apartment Rent', type: 'expense', userId: 'guest' },
      ];
      setTransactions(mockData);
      return;
    }

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribeTrans = onSnapshot(q, (snapshot) => {
      const trans = [];
      snapshot.forEach((doc) => {
        trans.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(trans);
    }, (error) => {
      console.error("Firestore error:", error);
    });

    return () => unsubscribeTrans();
  }, [user, setTransactions]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_15px_rgba(244,63,94,0.2)]"></div>
          <p className="text-muted-foreground animate-pulse font-medium tracking-widest text-xs uppercase">Loading Xpense</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 20px',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

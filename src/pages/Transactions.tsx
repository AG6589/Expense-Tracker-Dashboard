import { useState } from 'react';
import { useStore } from '@/store/useStore';
import type { Transaction } from '@/store/useStore';
import { db } from '@/services/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Search, Filter, ArrowUpRight, ArrowDownLeft, X, Calendar as CalendarIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function Transactions() {
  const { user, transactions, setTransactions } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: 'expense'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const newTx = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description,
        type: formData.type as 'income'|'expense',
        userId: user.uid,
        createdAt: new Date().toISOString()
      };

      if (user.uid === 'guest') {
        const localTx: Transaction = { id: Date.now().toString(), ...newTx, userId: 'guest' };
        setTransactions([localTx, ...transactions]);
      } else {
        await addDoc(collection(db, 'transactions'), newTx);
      }
      
      setFormData({ ...formData, amount: '', description: '', category: '' });
      setIsAdding(false);
      toast.success('Transaction saved!');
    } catch (error) {
      toast.error('Failed to save transaction');
      console.error(error);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (user?.uid === 'guest') {
        setTransactions(transactions.filter(t => t.id !== id));
      } else {
        await deleteDoc(doc(db, 'transactions', id));
      }
      toast.success('Deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Transactions</h1>
          <p className="text-muted-foreground text-sm text-balance">Track and manage your financial flow across various categories.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-5 h-11 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Add New
        </Button>
      </div>

      {/* Modern Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search transactions..." 
            className="pl-10 h-11 bg-card border-white/5 focus:border-primary/50 rounded-xl transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-card p-1 rounded-xl border border-white/5">
             {['all', 'income', 'expense'].map((t) => (
               <button
                 key={t}
                 onClick={() => setFilterType(t)}
                 className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                   filterType === t 
                   ? 'bg-white/10 text-white shadow-sm' 
                   : 'text-muted-foreground hover:text-white'
                 }`}
               >
                 {t}
               </button>
             ))}
          </div>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-card border border-white/5 text-muted-foreground hover:text-white transition-all">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transaction List Card */}
      <Card className="glass-card border-none bg-card/40 backdrop-blur-xl overflow-hidden min-h-[400px]">
        <div className="grid grid-cols-12 px-6 py-4 border-b border-white/5 text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">
          <div className="col-span-6 md:col-span-5">Transaction Details</div>
          <div className="col-span-3 md:col-span-3">Category</div>
          <div className="hidden md:block md:col-span-2">Date</div>
          <div className="col-span-3 md:col-span-2 text-right">Amount</div>
        </div>
        
        <div className="divide-y divide-white/5">
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                 <Search className="w-6 h-6 text-muted-foreground/40" />
               </div>
               <h3 className="text-white font-medium">No results found</h3>
               <p className="text-muted-foreground text-sm max-w-[200px] mt-1">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            filteredTransactions.map((tx, idx) => (
              <motion.div 
                key={tx.id}
                initial="hidden"
                animate="visible"
                variants={variants}
                transition={{ delay: idx * 0.03 }}
                className="grid grid-cols-12 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors cursor-pointer group"
              >
                <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'
                  }`}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{tx.description}</p>
                    <p className="text-[11px] text-muted-foreground md:hidden">{format(new Date(tx.date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                
                <div className="col-span-3 md:col-span-3">
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/5 text-muted-foreground group-hover:text-white transition-colors">
                    {tx.category}
                  </span>
                </div>
                
                <div className="hidden md:block md:col-span-2 text-xs font-medium text-muted-foreground">
                  {format(new Date(tx.date), 'MMM dd, yyyy')}
                </div>
                
                <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-3">
                  <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-white'}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </p>
                  <button 
                    onClick={(e) => handleDelete(tx.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Add Transaction Overlay / Side Drawer */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-white/5 z-[101] shadow-2xl p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                   <h2 className="text-2xl font-bold text-white">Add Transaction</h2>
                   <p className="text-muted-foreground text-sm">Record a new income or expense</p>
                </div>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'expense'})}
                      className={`flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold border transition-all ${
                        formData.type === 'expense' 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10'
                      }`}
                    >
                      <ArrowDownLeft className="w-4 h-4" /> Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'income'})}
                      className={`flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold border transition-all ${
                        formData.type === 'income' 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                        : 'bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" /> Income
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                      <Input 
                        type="number" 
                        step="0.01" 
                        required 
                        placeholder="0.00"
                        className="pl-8 h-12 bg-white/5 border-white/10 rounded-xl text-lg font-bold text-white focus:ring-primary/50"
                        value={formData.amount}
                        onChange={e => setFormData({...formData, amount: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                    <Input 
                      type="text" 
                      required 
                      placeholder="e.g. Groceries, Rent, Salary"
                      className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</label>
                    <div className="relative">
                       <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <Input 
                        type="date" 
                        required 
                        className="h-12 bg-white/5 border-white/10 rounded-xl text-white appearance-none"
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</label>
                    <Input 
                      type="text" 
                      required 
                      placeholder="What was this for?"
                      className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-6 flex flex-col gap-3">
                  <Button type="submit" className="w-full h-14 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    Save Transaction
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="w-full h-12 rounded-2xl text-muted-foreground hover:bg-white/5">
                    Discard
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

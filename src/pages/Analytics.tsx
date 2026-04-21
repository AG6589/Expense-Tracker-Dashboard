import { Card } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { startOfMonth, format, parseISO, eachMonthOfInterval, subMonths, isSameMonth } from 'date-fns';

export default function Analytics() {
  const { transactions } = useStore();

  // Aggregate data for the last 6 months
  const last6Months = eachMonthOfInterval({
    start: subMonths(startOfMonth(new Date()), 5),
    end: startOfMonth(new Date()),
  });

  const chartData = last6Months.map(month => {
    const monthTransactions = transactions.filter(t => isSameMonth(parseISO(t.date), month));
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    
    return {
      name: format(month, 'MMM'),
      income,
      expense
    };
  });

  // Calculate stats
  const currentMonthTransactions = transactions.filter(t => isSameMonth(parseISO(t.date), new Date()));
  const totalIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = currentMonthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const savingRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : '0.0';

  const expensesByCategory = transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const highestExpenseCategory = Object.keys(expensesByCategory).length > 0 
    ? Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0][0]
    : 'None';

  const dailyAverage = totalExpense / 30; // Simple average for the current month

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Analytics</h1>
          <p className="text-muted-foreground text-sm">Deep dive into your spending habits and financial trends.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
          <Card className="glass-card p-6 border-none bg-card hover:bg-[#1a1b22] transition-colors">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <TrendingUp className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Saving Rate</p>
                  <p className="text-2xl font-bold text-white">{savingRate}%</p>
               </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card p-6 border-none bg-card hover:bg-[#1a1b22] transition-colors">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <PieIcon className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Highest Exp.</p>
                  <p className="text-2xl font-bold text-white">{highestExpenseCategory}</p>
               </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card p-6 border-none bg-card hover:bg-[#1a1b22] transition-colors">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <DollarSign className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Daily Average</p>
                  <p className="text-2xl font-bold text-white">${dailyAverage.toFixed(2)}</p>
               </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card p-6 border-none bg-card hover:bg-[#1a1b22] transition-colors">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <TrendingDown className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">MoM Growth</p>
                  <p className="text-2xl font-bold text-white">+12.4%</p>
               </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-none bg-card p-6 h-[400px]">
            <h3 className="font-semibold text-lg mb-6">Income vs Expenses</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#17181E', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-card border-none bg-card p-6 h-[400px]">
            <h3 className="font-semibold text-lg mb-6">Category Breakdown</h3>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#17181E', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    cursor={{fill: '#ffffff05'}}
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

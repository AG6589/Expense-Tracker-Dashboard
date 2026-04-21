import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/card';
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { MoreVertical, Calendar, Filter, Wifi } from 'lucide-react';

export default function Dashboard() {
  const { transactions, user } = useStore();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const expensesByCategory = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const pieData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  }));

  // Match the screenshot's solid pink theme for the donut
  const COLORS = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#6366f1'];

  const sparklineIncome = [
    { value: 200 }, { value: 300 }, { value: 250 }, { value: 350 }, { value: 300 }, { value: 400 }, { value: 380 }
  ];
  
  const sparklineExpense = [
    { value: 300 }, { value: 250 }, { value: 280 }, { value: 200 }, { value: 250 }, { value: 220 }, { value: 200 }
  ];

  const variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  return (
    <div className="space-y-6">
      
      {/* Dashboard Content */}

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        {/* Top Summary Row */}
        <div className="grid gap-4 md:grid-cols-3">
          
          <motion.div variants={variants}>
            <Card className="glass-card flex flex-col justify-between pt-6 border-none bg-card shadow-sm h-36 relative group hover:bg-[#1a1b22] transition-colors">
              <div className="px-6 flex justify-between items-start z-10">
                <div className="space-y-1">
                   <p className="text-xs text-muted-foreground font-medium">Account Summary</p>
                   <div className="flex items-baseline gap-3">
                     <span className="text-3xl font-bold tracking-tight text-white">${balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                     <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center font-semibold">↗ 15.8%</span>
                   </div>
                </div>
                <MoreVertical className="w-4 h-4 text-muted-foreground opacity-50 cursor-pointer" />
              </div>
              <div className="h-12 w-full mt-auto opacity-70 group-hover:opacity-100 transition-opacity relative">
                <ResponsiveContainer width="99%" height="100%">
                  <AreaChart data={sparklineIncome}>
                    <defs>
                      <linearGradient id="splitColorAcc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#splitColorAcc)" strokeWidth={2} dot={{r:0}} activeDot={{r:4, fill: '#10b981', stroke: '#111', strokeWidth: 2}} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={variants}>
            <Card className="glass-card flex flex-col justify-between pt-6 border-none bg-card shadow-sm h-36 relative group hover:bg-[#1a1b22] transition-colors">
              <div className="px-6 flex justify-between items-start z-10">
                <div className="space-y-1">
                   <p className="text-xs text-muted-foreground font-medium">Income Overview</p>
                   <div className="flex items-baseline gap-3">
                     <span className="text-3xl font-bold tracking-tight text-white">${totalIncome.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                     <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center font-semibold">↗ 2.4%</span>
                   </div>
                </div>
                <MoreVertical className="w-4 h-4 text-muted-foreground opacity-50 cursor-pointer" />
              </div>
              <div className="h-12 w-full mt-auto opacity-70 group-hover:opacity-100 transition-opacity relative">
                <ResponsiveContainer width="99%" height="100%">
                  <AreaChart data={sparklineIncome}>
                    <defs>
                      <linearGradient id="splitColorInc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#splitColorInc)" strokeWidth={2} dot={{r:0}} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={variants}>
            <Card className="glass-card flex flex-col justify-between pt-6 border-none bg-card shadow-sm h-36 relative group hover:bg-[#1a1b22] transition-colors">
              <div className="px-6 flex justify-between items-start z-10">
                <div className="space-y-1">
                   <p className="text-xs text-muted-foreground font-medium">Total Expenses</p>
                   <div className="flex items-baseline gap-3">
                     <span className="text-3xl font-bold tracking-tight text-white">${totalExpense.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                     <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded flex items-center font-semibold text-primary">↘ 5.7%</span>
                   </div>
                </div>
                <MoreVertical className="w-4 h-4 text-muted-foreground opacity-50 cursor-pointer" />
              </div>
              <div className="h-12 w-full mt-auto opacity-70 group-hover:opacity-100 transition-opacity relative">
                <ResponsiveContainer width="99%" height="100%">
                  <AreaChart data={sparklineExpense}>
                    <defs>
                      <linearGradient id="splitColorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#f43f5e" fill="url(#splitColorExp)" strokeWidth={2} dot={{r:0}} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

        </div>

        {/* Middle Section: Donut + Transaction List */}
        <div className="grid gap-4 lg:grid-cols-3">
          
          <motion.div variants={variants} className="lg:col-span-2">
            <Card className="glass-card border-none bg-card p-6 h-[350px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-base">Spending Summary</h3>
                <div className="flex bg-[#22232B] rounded-lg p-0.5 overflow-hidden">
                  <button className="text-[10px] sm:text-xs font-medium px-3 py-1.5 rounded-md bg-white/5 text-white flex items-center gap-1.5 shadow-sm">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> This month
                  </button>
                  <button className="text-[10px] sm:text-xs font-medium px-3 py-1.5 rounded-md text-muted-foreground hover:text-white transition-colors">
                     Last month
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                 
                 {/* Large Pink Donut */}
                 <div className="relative w-48 h-48 sm:w-56 sm:h-56 shrink-0">
                    <ResponsiveContainer width="99%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData.length ? pieData : [{name: 'Empty', value: 1}]}
                          cx="50%" cy="50%"
                          innerRadius={70}
                          outerRadius={90}
                          stroke="none"
                          paddingAngle={2}
                          dataKey="value"
                          cornerRadius={10}
                        >
                          {pieData.length ? pieData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          )) : <Cell fill="#22232B" />}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs text-muted-foreground mb-1 block">Total</span>
                      <span className="text-2xl font-bold tracking-tight text-white">${totalExpense.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                    </div>
                 </div>

                 {/* Legend / Breakdown */}
                 <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-6 w-full max-w-sm">
                    {pieData.map((d, i) => (
                      <div key={d.name} className="flex flex-col gap-1">
                         <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                            {d.name}
                         </div>
                         <div className="text-lg font-bold text-white pl-4">${d.value.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                      </div>
                    ))}
                    {!pieData.length && (
                      <div className="text-sm text-muted-foreground">No data recorded.</div>
                    )}
                 </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={variants} className="lg:col-span-1">
            <Card className="glass-card border-none bg-card p-6 h-[350px] flex flex-col">
              <h3 className="font-semibold text-base mb-4">Transaction history</h3>
              
              <div className="flex gap-2 mb-6">
                <button className="flex items-center gap-2 bg-[#22232B] hover:bg-[#2a2c36] text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-md transition-colors border border-white/5">
                  <Calendar className="w-3.5 h-3.5" /> Select dates
                </button>
                <button className="flex items-center gap-2 bg-[#22232B] hover:bg-[#2a2c36] text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-md transition-colors border border-white/5">
                  <Filter className="w-3.5 h-3.5" /> Apply filter
                </button>
              </div>

              <div className="flex justify-between text-[10px] text-muted-foreground font-medium border-b border-white/5 pb-2 mb-3 px-1">
                <span>Transaction</span>
                <span>Amount</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 no-scrollbar -mr-2 pr-2">
                {transactions.slice(0, 10).map((tx) => (
                   <div key={tx.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                           tx.category.toLowerCase().includes('food') || tx.category.toLowerCase().includes('groceries') ? 'bg-emerald-500/20 text-emerald-500' :
                           tx.category.toLowerCase().includes('salary') ? 'bg-blue-500/20 text-blue-500' :
                           'bg-white/10 text-white'
                         }`}>
                           {tx.description.substring(0, 2).toUpperCase()}
                         </div>
                         <div>
                            <p className="text-xs font-medium text-white">{tx.description}</p>
                            <p className="text-[10px] text-muted-foreground">{format(new Date(tx.date), 'MMM dd')}</p>
                         </div>
                      </div>
                      <div className={`text-xs font-medium ${tx.type === 'income' ? 'text-emerald-500' : 'text-white/80'}`}>
                         {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                      </div>
                   </div>
                ))}
                {transactions.length === 0 && (
                   <div className="text-sm text-center text-muted-foreground mt-10">No recent transactions</div>
                )}
              </div>
            </Card>
          </motion.div>

        </div>

        {/* Bottom Section: Cards */}
        <motion.div variants={variants}>
           <Card className="glass-card border-none bg-card p-6 min-h-[220px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-base text-white">Your cards</h3>
                <MoreVertical className="w-4 h-4 text-muted-foreground opacity-50 cursor-pointer" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-4">
                 
                 {/* Card 1 */}
                 <div className="w-[300px] sm:w-full h-[180px] rounded-2xl p-5 flex flex-col justify-between bg-gradient-to-br from-[#2a2d3e] to-[#1e1f2c] border border-white/10 relative overflow-hidden shrink-0 shadow-lg group hover:-translate-y-1 transition-transform">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] pointer-events-none"></div>
                    <div className="flex justify-between items-start z-10 w-full">
                       <span className="text-xs font-medium text-white tracking-widest opacity-80">Visa Platinum</span>
                       <Wifi className="w-4 h-4 text-white opacity-70 rotate-90" />
                    </div>
                    <div className="space-y-4 z-10 w-full mt-auto">
                       <div className="flex justify-between items-end w-full">
                         <div>
                           <p className="text-[10px] uppercase text-white/50 tracking-wider mb-1">Card Holder</p>
                           <p className="text-sm font-medium text-white">{user?.displayName || 'Card Holder'}</p>
                           <p className="text-xs font-mono text-white/80 mt-1 tracking-widest">4532 7890 1234 5678</p>
                         </div>
                         <div className="text-right">
                           <p className="text-[10px] uppercase text-white/50 tracking-wider mb-1">Expires</p>
                           <p className="text-sm font-medium text-white">12/29</p>
                           <div className="font-bold text-white italic tracking-tighter mt-1 text-sm bg-white/10 px-2 py-0.5 rounded inline-block">VISA</div>
                         </div>
                       </div>
                    </div>
                 </div>

                 {/* Card 2 */}
                 <div className="w-[300px] sm:w-full h-[180px] rounded-2xl p-5 flex flex-col justify-between bg-gradient-to-br from-[#1E2333] to-[#0A0D15] border border-white/10 relative overflow-hidden shrink-0 shadow-lg group hover:-translate-y-1 transition-transform">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none"></div>
                    <div className="flex justify-between items-start z-10 w-full">
                       <span className="text-xs font-medium text-white tracking-widest opacity-80">World Mastercard</span>
                       <Wifi className="w-4 h-4 text-white opacity-70 rotate-90" />
                    </div>
                    <div className="space-y-4 z-10 w-full mt-auto">
                       <div className="flex justify-between items-end w-full">
                         <div>
                           <p className="text-[10px] uppercase text-white/50 tracking-wider mb-1">Card Holder</p>
                           <p className="text-sm font-medium text-white">{user?.displayName || 'Card Holder'}</p>
                           <p className="text-xs font-mono text-white/80 mt-1 tracking-widest">5432 9876 5432 1098</p>
                         </div>
                         <div className="text-right">
                           <p className="text-[10px] uppercase text-white/50 tracking-wider mb-1">Expires</p>
                           <p className="text-sm font-medium text-white">09/28</p>
                           <div className="flex items-center justify-end mt-1">
                             <div className="w-5 h-5 rounded-full bg-red-500 opacity-80 mix-blend-screen scale-110"></div>
                             <div className="w-5 h-5 rounded-full bg-yellow-500 opacity-80 mix-blend-screen -ml-2"></div>
                           </div>
                         </div>
                       </div>
                    </div>
                 </div>

                 {/* Card 3 */}
                 <div className="w-[300px] sm:w-full h-[180px] rounded-2xl p-5 flex flex-col justify-between bg-gradient-to-br from-[#374151] to-[#111827] border border-white/10 relative overflow-hidden shrink-0 shadow-lg group hover:-translate-y-1 transition-transform">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none"></div>
                    <div className="flex justify-between items-start z-10 w-full">
                       <span className="text-xs font-medium text-white tracking-widest opacity-80">Visa Classic</span>
                       <Wifi className="w-4 h-4 text-white opacity-70 rotate-90" />
                    </div>
                    <div className="space-y-4 z-10 w-full mt-auto">
                       <div className="flex justify-between items-end w-full">
                         <div>
                           <p className="text-[10px] uppercase text-white/50 tracking-wider mb-1">Card Holder</p>
                           <p className="text-sm font-medium text-white">{user?.displayName || 'Card Holder'}</p>
                           <p className="text-xs font-mono text-white/80 mt-1 tracking-widest">4321 8765 2109 6543</p>
                         </div>
                         <div className="text-right">
                           <p className="text-[10px] uppercase text-white/50 tracking-wider mb-1">Expires</p>
                           <p className="text-sm font-medium text-white">03/26</p>
                           <div className="font-bold text-white italic tracking-tighter mt-1 text-sm bg-white/10 px-2 py-0.5 rounded inline-block">VISA</div>
                         </div>
                       </div>
                    </div>
                 </div>

              </div>
           </Card>
        </motion.div>

      </motion.div>
    </div>
  );
}

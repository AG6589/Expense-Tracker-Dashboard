import React from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Calendar, 
  FileText, 
  PieChart as PieChartIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter,
  ChevronDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const monthlyStats = [
  { month: 'Jan', income: 4500, expenses: 3200 },
  { month: 'Feb', income: 5200, expenses: 3800 },
  { month: 'Mar', income: 4800, expenses: 4100 },
  { month: 'Apr', income: 6100, expenses: 3500 },
  { month: 'May', income: 5500, expenses: 4200 },
  { month: 'Jun', income: 5900, expenses: 3900 },
];

const categoryData = [
  { name: 'Housing', value: 1200, color: '#F43F5E' },
  { name: 'Food', value: 800, color: '#FCD34D' },
  { name: 'Transport', value: 400, color: '#34D399' },
  { name: 'Entertainment', value: 600, color: '#60A5FA' },
  { name: 'Utilities', value: 300, color: '#A78BFA' },
];

const Reports = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Financial Reports</h2>
          <p className="text-muted-foreground mt-1">Analyze your spending patterns and income growth.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary text-white text-sm font-medium rounded-xl border border-white/5 transition-all">
            <Calendar className="w-4 h-4" />
            Last 6 Months
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <ArrowUpRight className="w-6 h-6 text-emerald-500" />
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">+12.5%</span>
          </div>
          <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Total Revenue</h3>
          <p className="text-3xl font-bold text-white mt-1">$32,000.00</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-rose-500/10 rounded-xl">
              <ArrowDownLeft className="w-6 h-6 text-rose-500" />
            </div>
            <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded-lg">+4.2%</span>
          </div>
          <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Total Expenses</h3>
          <p className="text-3xl font-bold text-white mt-1">$23,700.00</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <PieChartIcon className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">High</span>
          </div>
          <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Net Savings</h3>
          <p className="text-3xl font-bold text-white mt-1">$8,300.00</p>
        </motion.div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 h-[400px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Cash Flow Overview</h3>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div> Income</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-white/20"></div> Expenses</div>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyStats}>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#17181E', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPrimary)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="rgba(255,255,255,0.2)" 
                  strokeWidth={2}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 h-[400px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Expense by Category</h3>
            <button className="p-2 bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#fff', fontSize: 12, fontWeight: 500 }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ 
                    backgroundColor: '#17181E', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Available Documents */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Available Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-card/50 border border-white/5 rounded-2xl hover:border-primary/30 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary rounded-xl group-hover:bg-primary/10 transition-colors">
                  <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Monthly_Report_{i < 4 ? 'June' : 'May'}_2026.pdf</h4>
                  <p className="text-xs text-muted-foreground">Generated on June {24-i}, 2026 • 2.4 MB</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-muted-foreground group-hover:text-white transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;

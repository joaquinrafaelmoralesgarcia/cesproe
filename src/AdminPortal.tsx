import { useState } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Users, Car, ShieldAlert, Activity, DollarSign, Menu, Search, Filter, ArrowUpRight, TrendingUp, ShieldCheck } from 'lucide-react';

export default function AdminPortal({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Active Missions', value: '14', change: '+2', icon: Activity, color: 'text-green-500' },
    { title: 'Assets Deployed', value: '28', change: '82%', icon: Car, color: 'text-primary' },
    { title: 'Threat Alerts', value: '3', change: 'Low', icon: ShieldAlert, color: 'text-yellow-500' },
    { title: 'Daily Revenue', value: '$42.5K', change: '+12%', icon: DollarSign, color: 'text-white' },
  ];

  const recentMissions = [
    { id: 'MSN-892', client: 'VIP Alpha', status: 'In Progress', asset: 'Escalade B7', threat: 'Low' },
    { id: 'MSN-891', client: 'Corporate X', status: 'Completed', asset: 'S-Class VR10', threat: 'None' },
    { id: 'MSN-890', client: 'Embassy 4', status: 'En Route', asset: 'Sentinel', threat: 'Elevated' },
    { id: 'MSN-889', client: 'Executive Y', status: 'Completed', asset: 'Escalade B7', threat: 'Low' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface flex"
    >
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-surface-container-low flex flex-col overflow-hidden">
        <div className="h-20 flex flex-col justify-center px-6 border-b border-white/10 gap-1 mt-2">
          <img src="/logo.png" alt="" className="h-8 object-contain scale-[2.5] origin-left ml-4" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.classList.remove('hidden'); }} />
          <span className="hidden text-xl font-black text-primary tracking-widest uppercase">CESPROE</span>
          <span className="text-[10px] text-zinc-500 uppercase font-bold border border-zinc-700 px-1 rounded w-fit mt-1">Admin Portal</span>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'missions', label: 'Live Missions', icon: Activity },
            { id: 'fleet', label: 'Fleet Status', icon: Car },
            { id: 'users', label: 'Users & Agents', icon: Users },
            { id: 'threats', label: 'Threat Intel', icon: ShieldAlert },
            { id: 'billing', label: 'Billing & Revenue', icon: DollarSign },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left text-sm font-medium ${
                activeTab === item.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={onBack} className="w-full text-left px-4 py-2 text-zinc-500 text-sm hover:text-white transition-colors">
            Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Topbar */}
        <header className="h-16 border-b border-white/10 bg-surface/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search missions, assets, clients..." 
                className="w-full bg-surface-container-high border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-400 hover:text-white transition-colors">
              <Filter size={18} />
            </button>
            <div className="w-px h-6 bg-white/10" />
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Global Operations</h2>
              <p className="text-sm text-zinc-400">System is fully operational. Threat levels are nominal.</p>
            </div>
            <button className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors">
              Deploy Unit <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="glass-panel p-6 rounded-xl titanium-border">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg bg-surface-container ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">
                    <TrendingUp size={12} /> {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">{stat.title}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Missions Table */}
            <div className="lg:col-span-2 glass-panel rounded-xl titanium-border overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface-container-low">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Active Deployments</h3>
                <button className="text-primary text-xs font-bold uppercase hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container text-xs text-zinc-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-bold">Mission ID</th>
                      <th className="px-6 py-4 font-bold">Client / Target</th>
                      <th className="px-6 py-4 font-bold">Asset Assigned</th>
                      <th className="px-6 py-4 font-bold">Threat Level</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentMissions.map((mission, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-sm font-mono text-zinc-300">{mission.id}</td>
                        <td className="px-6 py-4 text-sm font-bold text-white">{mission.client}</td>
                        <td className="px-6 py-4 text-sm text-zinc-400">{mission.asset}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                            mission.threat === 'None' ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 
                            mission.threat === 'Low' ? 'bg-green-900/30 text-green-400 border-green-500/30' : 
                            'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
                          }`}>
                            {mission.threat}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-sm text-zinc-300">
                            <div className={`w-2 h-2 rounded-full ${mission.status === 'Completed' ? 'bg-zinc-500' : 'bg-primary animate-pulse'}`} />
                            {mission.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Threat Map Placeholder */}
            <div className="glass-panel rounded-xl titanium-border flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/10 bg-surface-container-low flex justify-between items-center">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Live Threat Heatmap</h3>
                <Activity className="text-red-500 animate-pulse" size={16} />
              </div>
              <div className="flex-1 relative min-h-[300px]">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuATcZDOPNEeb__POwjM7Go1yvWm7uqYj21W5MzgAyRI1RXWSXF6p-Rz1SMk3b7uy2HIubegVGYHk5TDYmkKW0LQ2dHSuhE_MsPTmIn8fySSFKyGFCIu5dvBLlSwLI9qy-ihY6kPzWa35xATcux7RgtHaB6pPiGfPQxemmBcyhClNVRM3gfN_D6lgMIC9xj8AKW3zmVIq84-TaxXSwfs-hfFkmUt4oIw2fsYApdgrsV03bP7IqJZDaKbPFFT64sZFIVThk9TFDvKR0c" 
                  alt="Heatmap" 
                  className="w-full h-full object-cover opacity-60 mix-blend-screen"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-zinc-400 font-bold uppercase">Zone Alpha</span>
                    <span className="text-xs text-red-400 font-bold">ELEVATED</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1 rounded-full">
                    <div className="w-[70%] bg-red-500 h-full rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

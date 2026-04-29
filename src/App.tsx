import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Bell, SignalHigh, User, Map as MapIcon, Eye, ShieldCheck, Car as CarIcon, LayoutDashboard, ChevronRight, HelpCircle, ArrowRight, Verified, CheckCircle, Smartphone, Satellite, MapPin, Zap, AlertTriangle, Menu, X, MoreHorizontal, Settings, Loader2, Mail, Lock } from 'lucide-react';
import { Screen } from './types';
import { TIERS, VEHICLES } from './constants';
import AdminPortal from './AdminPortal';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';
import { n8nService } from './services/n8nService';

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // PILOT MODE: Always use a mock session and stay on dashboard
    setSession({
      user: { id: 'pilot-user', email: 'pilot@cesproe.com' },
      access_token: 'pilot-token',
    } as Session);
    setScreen('dashboard');
  }, []);

  const handleConfirmMission = async () => {
    // Notify n8n of new mission
    n8nService.notifyMissionCreated({
      userId: session?.user?.id,
      email: session?.user?.email,
      origin: "AV. REFORMA 450",
      destination: "ZONE ZERO HQ",
      cost: 420.00,
      protocol: "Elite Escort"
    });
    setScreen('operations');
  };

  const renderScreen = () => {
    if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;

    switch (screen) {
      case 'dashboard':
        return <Dashboard onBooking={() => setScreen('booking')} onFleet={() => setScreen('fleet')} onOps={() => setScreen('operations')} />;
      case 'booking':
        return <Booking onConfirm={handleConfirmMission} onBack={() => setScreen('dashboard')} />;
      case 'fleet':
        return <Fleet onBack={() => setScreen('dashboard')} />;
      case 'operations':
        return <Operations onBack={() => setScreen('dashboard')} />;
      case 'admin':
        return <AdminPortal onBack={() => setScreen('dashboard')} />;
      default:
        return <Dashboard onBooking={() => setScreen('booking')} onFleet={() => setScreen('fleet')} onOps={() => setScreen('operations')} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface selection:bg-primary/20">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
      
      {screen !== 'admin' && (
        <Navbar currentScreen={screen} setScreen={setScreen} />
      )}
    </div>
  );
}

// --- Components ---

function Header({ title = "SHIELD", showProfile = true }: { title?: string, showProfile?: boolean }) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="" className="h-10 md:h-12 object-contain scale-[2.5] origin-left ml-4" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.classList.remove('hidden'); }} />
        <span className="hidden text-xl font-extrabold text-primary-container tracking-[0.2em] uppercase">CESPROE</span>
      </div>
      <div className="flex items-center gap-6">
        <Bell className="text-secondary hover:text-primary transition-colors cursor-pointer" size={20} />
        <div className="h-6 w-px bg-white/10" />
        <SignalHigh className="text-primary" size={20} />
        {showProfile && (
          <div className="w-8 h-8 rounded-full border border-primary/30 overflow-hidden ml-2">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCViqQzGY2cWjh69n9Fk7NAdVCerYP25F1B_Sk7hOD49n6yR-bETA6OsnkefaQo7t6K0-2esjQZHmH5ilMgYcIZ4jiTb2uojh9bU0uqPaIY_juXRmXhqBLrDmu9xCmfyK-oRFOi01-sHNoUirf8Ylc8s1tSA1PLtJ4kTw_Vua8_iuvZDjohUEGnHT9ZdvaT-VILkenVGouIdBVnldgUQ1thGwbppY8_chVKbT041b_-4aqhrtkLqbEJi3Xnak1MOX8RZcSB8Pj-Aww" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </header>
  );
}

function Navbar({ currentScreen, setScreen }: { currentScreen: Screen, setScreen: (s: Screen) => void }) {
  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'operations', label: 'Operations', icon: Eye },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'fleet', label: 'Fleet', icon: CarIcon },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-safe bg-surface/90 backdrop-blur-2xl border-t border-white/10 shadow-2xl">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => item.id !== 'security' && item.id !== 'profile' ? setScreen(item.id as Screen) : null}
          className={`flex flex-col items-center justify-center transition-all ${
            currentScreen === item.id ? 'text-primary scale-110' : 'text-zinc-600 hover:text-zinc-300'
          }`}
        >
          <item.icon size={22} fill={currentScreen === item.id ? 'currentColor' : 'none'} fillOpacity={0.2} />
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{item.label}</span>
        </button>
      ))}
    </nav>
  );

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Notify n8n of successful login
        n8nService.sendEvent('user_login', { email, userId: data.user?.id });
      } else {
        const { error, data } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Notify n8n of new registration
        n8nService.sendEvent('user_login', { email, userId: data.user?.id, isNewUser: true });
        alert("Registration successful! You are now logged in.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col items-center justify-center min-h-screen px-8 text-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAT2Xk_M2kME-mBxGaunjPyf74wglFQnwWcdZe2S6t2Meze0ojSQZy_5FBWYpQSLSf0ZGIWzqSMmnZ8tfBaRbFY3zQPHB8cbOaCPt2TMAEFNF2IxLJdWJRqk2jhJ62IfCZ52KiuSqjdszTPS2vtdtsXV2eb-exuhpQsX692x-29OxFt1R2ek4fpTz92LsP1XKyK3ONUKcpxxLLU3L5eJAWj7uSmMU_avR53D9_ZC_rXc1SIKdj4oxs2RLqXWNzF_RGLLryxDyHdPA" 
          className="w-full h-full object-cover opacity-20 grayscale"
          alt="Atmospheric Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-xl">
        <div className="mb-16 p-4 glass-panel rounded-2xl animate-pulse bg-zinc-950/80 w-full max-w-lg flex justify-center border-primary/20 overflow-visible">
          <img src="/logo.png" alt="" className="h-24 md:h-32 object-contain scale-[2] origin-center" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.classList.remove('hidden'); }} />
          <span className="hidden text-3xl font-black text-primary tracking-widest uppercase">CESPROE</span>
        </div>
        
        <AnimatePresence mode="wait">
          {!showAuth ? (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="w-full flex flex-col items-center">
              <div className="space-y-2 mb-12">
                <h1 className="text-5xl font-bold text-on-surface">Total Privacy.</h1>
                <h1 className="text-5xl font-bold text-on-surface-variant/60">Absolute Safety.</h1>
                <p className="text-lg text-secondary mt-6">
                  Enter the inner circle of global security. Elite protection, managed with clinical precision.
                </p>
              </div>

              <div className="w-full space-y-4">
                <button 
                  onClick={onNext}
                  className="w-full py-4 bg-primary-container text-on-primary-container font-bold rounded-lg shadow-xl shadow-primary-container/20 active:scale-[0.98] transition-transform uppercase tracking-widest"
                >
                  Enter Platform (Pilot)
                </button>
                <button className="w-full py-4 border border-zinc-700 text-zinc-300 font-bold rounded-lg glass-panel hover:bg-white/5 transition-colors uppercase tracking-widest">
                  Request Private Demo
                </button>
              </div>
              
              <button onClick={() => { setIsLogin(true); setShowAuth(true); }} className="mt-8 text-primary font-medium hover:underline uppercase tracking-widest text-sm">
                Already a member? <span className="font-bold">Login</span>
              </button>
            </motion.div>
          ) : (
            <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-widest">{isLogin ? 'Secure Login' : 'Register'}</h2>
                <button onClick={() => setShowAuth(false)} className="text-zinc-500 hover:text-white transition-colors"><X size={24}/></button>
              </div>
              
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surface/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors" placeholder="hq@cesproe.com" />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-surface/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors" placeholder="••••••••" />
                  </div>
                </div>

                {error && <div className="text-red-400 text-sm font-medium p-3 bg-red-950/50 rounded-lg border border-red-900/50">{error}</div>}

                <button type="submit" disabled={loading} className="w-full py-4 bg-primary-container text-on-primary-container font-bold rounded-lg shadow-xl shadow-primary-container/20 active:scale-[0.98] transition-transform flex justify-center items-center gap-2 mt-4 uppercase tracking-widest">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Authenticate' : 'Initialize Account')}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/10">
                <button onClick={onNext} className="text-sm text-primary font-bold hover:underline uppercase tracking-widest">
                  Skip for Pilot Phase →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
}

function Onboarding({ onComplete }: { onComplete: () => void }) {
  const steps = [
    {
      title: "Fortified Transit",
      desc: "B4-B7 certified ballistic protection combined with five-star luxury.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM6i4Qv0xbzp5kqPY3OPu8kffK9IeUyZ2vCYdddSD88yvM9TGpD8MvefOnurnB_ELBJnCnJpyyPi_tnt17uUCVmRT6XJhP7XVVVAV6Yd3GajCpxGEvY2jtOzToWvuZLy6O4NdGJdWnWqGC7NG7_72yHiIVBVIJk3_oCDG-hFwYAWD28pLxCZ45t7Z6R5HCGc1mFyEHhG9x-sfxcrWtO8KRAA1yrrfmmCLdpYMLUMHxndpOdOgupZNdvBLui9cq8m3qA07OXIpcPx4",
      specs: [
        { label: "Armor Rating", value: "B7 ULTRA" },
        { label: "Payload Cap", value: "2.4 TONS" }
      ]
    },
    {
      title: "Elite Protection",
      desc: "Highly trained security specialists with military and law enforcement backgrounds.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQhdFN-kz5fQcB0mMS0WfRb_6abVQ5s0L282zPGlrDNQfL05XY3yLIMkNrb-hH8ThlG9iMderrU6pDfrJ0ynNCFOMbqCyr75zbrdtMsWYSQs8vfKd1u-kC9UTF3rFhQT8D19IjHZuGLKgq3UJhOGJ3wyZpzklrULQnwqLCYwS7j_Gw41m8femsBIK0IRProugbQTCc3vfVriUIw5COm2Kht8d2l8KWYNKqN_-39bf_Z-Px4nZ1o-5xqSktYISgYiE6mgoyWhltYg",
      specs: [
        { label: "Agency", value: "GOV-GRADE" },
        { label: "Experience", value: "15+ YRS" }
      ]
    },
    {
      title: "Tactical Intelligence",
      desc: "Real-time threat monitoring and satellite tracking for every operation.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHecx5BpUHyDrv29EDxtQodlqmDDuvxzG0p39U6FVKlpL2-LR8NqZjupmI2n26B437SEkSzp5JEr8j2fYOkCt7BwN7fm0j9JUNrVn-ZcopHj0CNy4VVOLCwdhJFRZ-cR2jZBa8ttbJypQIW-0B9tNlpGSxTIUL1p6wpNNb90Vp8-DARvrM4QWx-OUSaRG88NmNzT8lt3YgRCZAaTBuNdMIZsOlHdTRaUxgutHGt9pm9nLIZMgwxJTIRF2N9d1jXHAVAXkDensHv2k",
      specs: [
        { label: "Status", value: "OPERATIONAL" },
        { label: "Link", value: "UPLINK ACTIVE" }
      ]
    }
  ];

  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen flex flex-col justify-end p-8"
    >
      <div className="absolute inset-0 z-0">
        <motion.img 
          key={step}
          src={steps[step].image} 
          className="w-full h-full object-cover opacity-40 grayscale"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
      </div>

      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-16 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <img src="/logo.png" alt="" className="h-8 object-contain scale-[2.5] origin-left ml-4" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.classList.remove('hidden'); }} />
          <span className="hidden text-lg font-black text-primary-container tracking-[0.2em] uppercase">CESPROE</span>
        </div>
        <button onClick={onComplete} className="text-zinc-500 font-bold uppercase tracking-widest text-xs pointer-events-auto hover:text-primary">Skip</button>
      </header>

      <div className="relative z-10 w-full max-w-xl glass-panel rounded-xl p-8 flex flex-col gap-8 shadow-2xl">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#f2ca50]" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Deployment System v4.0</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white tracking-tighter uppercase leading-none italic">
            {steps[step].title.split(' ')[0]} <br/>
            <span className="text-primary text-glow">{steps[step].title.split(' ')[1]}</span>
          </h1>
          <p className="text-lg text-secondary mt-2">
            {steps[step].desc}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {steps[step].specs.map((spec) => (
            <div key={spec.label} className="bg-white/5 p-4 rounded-lg border border-white/5">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">{spec.label}</span>
              <span className="text-lg font-bold text-white">{spec.value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex gap-2 w-24 h-1">
            {steps.map((_, i) => (
              <div key={i} className={`h-full flex-1 rounded-full transition-all duration-300 ${i === step ? 'bg-primary shadow-[0_0_8px_#f2ca50]' : 'bg-white/10'}`} />
            ))}
          </div>
          <button 
            onClick={handleNext}
            className="w-full py-4 bg-primary text-on-primary font-bold uppercase tracking-widest rounded-lg transition-all active:scale-[0.98] flex justify-center items-center gap-2 group"
          >
            {step === steps.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.main>
  );
}

function TierSelection({ onSelect }: { onSelect: () => void }) {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen pt-24 pb-32 px-6 overflow-x-hidden"
    >
      <Header showProfile={false} />
      
      <div className="max-w-7xl mx-auto">
        <section className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-800 -z-10" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">1</div>
              <span className="text-[10px] font-bold text-primary uppercase">Identity</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border border-zinc-700 text-zinc-500 flex items-center justify-center font-bold">2</div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Risk Profile</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border border-zinc-700 text-zinc-500 flex items-center justify-center font-bold">3</div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Payment</span>
            </div>
          </div>
        </section>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Select Your Protection Tier</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Protocol-grade security tailored for ultra-high-net-worth operations. Select a tier to begin the biometric verification process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div 
              key={tier.id}
              className={`glass-panel p-8 rounded-xl flex flex-col relative transition-all duration-300 hover:scale-[1.02] ${tier.mostRequested ? 'border-primary/40 bg-zinc-900/40' : 'hover:border-zinc-500'}`}
            >
              {tier.mostRequested && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black font-black text-[10px] px-4 py-1 rounded-full tracking-widest shadow-lg">
                  MOST REQUESTED
                </div>
              )}
              <div className="mb-6">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${tier.mostRequested ? 'text-primary border-primary/20 bg-primary/10' : 'text-zinc-400 border-zinc-700 bg-zinc-800/50'}`}>
                  {tier.tag}
                </span>
                <h3 className={`text-3xl font-bold mt-4 ${tier.mostRequested ? 'text-primary' : 'text-white'}`}>{tier.name}</h3>
                <p className="text-primary font-medium text-sm mt-1">{tier.price}</p>
              </div>
              <ul className="space-y-4 flex-grow mb-12">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-secondary text-sm">
                    {tier.mostRequested ? <Verified size={16} className="text-primary" /> : <CheckCircle size={16} className="text-zinc-500" />}
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={onSelect}
                className={`w-full py-4 font-bold uppercase tracking-widest transition-all ${
                  tier.mostRequested ? 'bg-primary text-on-primary hover:bg-primary/90' : 'border border-zinc-700 text-zinc-300 hover:bg-white/5'
                }`}
              >
                {tier.mostRequested ? 'Verify Identity' : 'Select Tier'}
              </button>
            </div>
          ))}
        </div>

        <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container p-6 rounded-lg flex items-center gap-6 border-l-4 border-primary">
            <ShieldCheck size={40} className="text-primary flex-shrink-0" />
            <div>
              <h4 className="text-lg font-bold text-white">Military-Grade Encryption</h4>
              <p className="text-sm text-secondary">Your identity data is processed via zero-knowledge proofs and secured in offline air-gapped vaults.</p>
            </div>
          </div>
          <div className="bg-surface-container p-6 rounded-lg flex items-center gap-6 border-l-4 border-zinc-700">
            <ShieldCheck size={40} className="text-zinc-500 flex-shrink-0" />
            <div>
              <h4 className="text-lg font-bold text-white">Next-Gen KYC</h4>
              <p className="text-sm text-secondary">The verification process includes biometric facial mapping and multi-jurisdictional background sweeps.</p>
            </div>
          </div>
        </section>
      </div>
    </motion.main>
  );
}

function Dashboard({ onBooking, onFleet, onOps }: { onBooking: () => void, onFleet: () => void, onOps: () => void }) {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen pt-20 pb-32"
    >
      <Header />
      
      <div className="absolute inset-0 z-0">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiH5AQjLHVntNX90F7NREp43hjqxtSHH3FxxaCfISUXY4hO-JMRyeqJUqgAc6opFOnu0kjfuID35KMJPDaTaKvm-VyV61iUlggg61oDTzdVLL3Dzt5Aa6gfk907oqH1RLV4woDxQxkB7kLunnr7u-SuDlIDDGLR-963tsj3Vu-tdZjJEQIdVLEki3oIKotwAKSt4XBvBk4rSEtBNDZRNNNfImUnA098-OVzjS9NKLfxag-kghrfnQzzrHkr4xABRAAMWwyuYuE5Tc" 
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
          alt="Map Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/80" />
      </div>

      <div className="relative z-10 grid grid-cols-12 gap-5 px-6 max-w-7xl mx-auto h-[calc(100vh-160px)] content-center">
        <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
          <div className="glass-panel p-6 rounded-xl titanium-border">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-zinc-500">
                <span>THREAT LEVEL</span>
                <span className="px-2 py-0.5 bg-green-950 text-green-400 border border-green-500/30 rounded uppercase">Low</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-zinc-500">
                <span>ENCRYPTION</span>
                <span className="text-primary uppercase">Active</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-zinc-500">
                <span>SIGNAL</span>
                <span className="text-primary uppercase">Optimal</span>
              </div>
            </div>
            
            <div className="h-px bg-white/10 w-full mb-6" />
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-green-500" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-tight">Alpha-6 Unit</h4>
                  <p className="text-[10px] text-zinc-500 uppercase">ETA: 4 MIN | DIST: 1.2KM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-zinc-600" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-tight text-zinc-400">Bravo-2 Unit</h4>
                  <p className="text-[10px] text-zinc-600 uppercase">STATIONARY | ZONE 4</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl titanium-border mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={18} className="text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Current Origin</span>
            </div>
            <h3 className="text-lg font-bold">The Mayfair Plaza</h3>
            <p className="text-xs text-zinc-500 font-mono mt-1">51.5074° N, 0.1278° W</p>
          </div>
        </div>

        <div className="hidden md:flex md:col-span-4" />

        <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
          <button 
            onClick={onBooking}
            className="w-full bg-primary text-on-primary p-8 rounded-xl flex flex-col items-center gap-4 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group"
          >
            <ShieldCheck size={48} className="group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold uppercase tracking-tight">Request Protection</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={onFleet} className="glass-panel p-4 rounded-xl titanium-border flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors">
              <CarIcon size={20} className="text-zinc-400" />
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest text-center">Book Armored SUV</span>
            </button>
            <button onClick={onOps} className="glass-panel p-4 rounded-xl titanium-border flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors">
              <Zap size={20} className="text-zinc-400" />
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest text-center">Schedule Convoy</span>
            </button>
            <button className="glass-panel p-4 rounded-xl border-red-900/30 flex flex-col items-center justify-center gap-2 hover:bg-red-900/10 transition-colors">
              <AlertTriangle size={20} className="text-red-500" />
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">Panic / SOS</span>
            </button>
            <button className="glass-panel p-4 rounded-xl titanium-border flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors">
              <User size={20} className="text-zinc-400" />
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest text-center">Agent Details</span>
            </button>
          </div>

          <div className="glass-panel rounded-xl titanium-border overflow-hidden mt-auto">
            <div className="px-4 py-2 bg-white/5 border-b border-white/10">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Fleet Overview</span>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center titanium-border">
                    <Smartphone size={14} className="text-zinc-400" />
                  </div>
                  <span className="text-xs uppercase font-bold">Vehicle Integrity</span>
                </div>
                <span className="text-xs text-primary font-bold">98%</span>
              </div>
              <div className="w-full bg-zinc-900 h-1 rounded-full">
                <div className="bg-primary h-full w-[98%] rounded-full shadow-[0_0_8px_rgba(242,202,80,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

function Booking({ onConfirm, onBack }: { onConfirm: () => void, onBack: () => void }) {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen pt-16 pb-32"
    >
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10">
        <button onClick={onBack} className="text-primary"><ArrowRight size={20} className="rotate-180" /></button>
        <img src="/logo.png" alt="CESPROE Logo" className="h-10 object-contain scale-[2.5] origin-center absolute left-1/2 -translate-x-1/2" />
        <SignalHigh className="text-primary" size={20} />
      </header>

      <section className="relative w-full h-[320px] overflow-hidden">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE_CdjvtX4qVHO07ALrWtnR18FqLqjPBrWRhYwS9ZQ-4Mhq5WVnL9SuMtnTbf42iGc2UxTDmOQJzjsTR5ZFFONCt1M-lR0t4wne9qE7pLKnYlELEcmzEfT7NcItWhBRNsq_3odGYZqH7YCooQJbRCYlGTDzE4TTM39ypDQ8L33YhZPU2nErvUh80D9FRMQi2gkcqGXG-3XcYlwjg6ScDhR8mbyeVufgeDXSg2gWow_h7AkAPKz1ie5Ux4lizaFEb-KF9YWHu2tUzs" 
          className="w-full h-full object-cover opacity-60"
          alt="Map"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 glass-panel p-4 rounded-xl titanium-border">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1 mt-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-px h-10 bg-white/20" />
              <div className="w-2 h-2 rounded-full border border-white/40" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-white/40 text-[10px] font-bold">PICKUP</span>
                <span className="text-primary font-bold text-sm">AV. REFORMA 450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-[10px] font-bold">DESTINATION</span>
                <span className="text-white font-bold text-sm">ZONE ZERO HQ</span>
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-between bg-white/5 px-3 py-1 rounded text-[10px] text-white/40 font-mono">
            <span>COORD: 19.4326° N, 99.1332° W</span>
            <span>ETA: 14 MIN</span>
          </div>
        </div>
      </section>

      <div className="px-6 py-8">
        <h2 className="text-3xl font-bold mb-1 uppercase italic">Select Protocol</h2>
        <p className="text-sm text-secondary mb-8">Deployment grade and tactical support options.</p>

        <div className="space-y-4 max-w-3xl mx-auto">
          {VEHICLES.map((v) => (
            <button key={v.id} className="w-full flex flex-col p-6 rounded-xl bg-surface-container border border-white/10 hover:border-primary/50 transition-all text-left group">
              <div className="flex justify-between items-start mb-4 w-full">
                <div className="bg-white/5 p-3 rounded-lg text-primary">
                  <ShieldCheck size={28} />
                </div>
                <div className="text-right">
                  <span className="text-primary font-bold text-2xl">${v.price.toFixed(2)}</span>
                  <span className="block text-[10px] text-zinc-500 uppercase tracking-widest">{v.eta} MIN ETA</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white uppercase group-hover:text-primary transition-colors">{v.name}</h3>
              <p className="text-sm text-secondary mt-1">{v.description}</p>
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase">ARMOR: {v.armor}</span>
                {v.capacity && <span className="px-3 py-1 rounded bg-white/5 text-zinc-500 text-[10px] font-bold uppercase">CAP: {v.capacity}</span>}
                {v.units && <span className="px-3 py-1 rounded bg-white/5 text-zinc-500 text-[10px] font-bold uppercase">UNITS: {v.units}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-[60] p-6 glass-panel border-t border-white/10 backdrop-blur-3xl shadow-2xl">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Smartphone size={20} className="text-zinc-600" />
              <span className="text-sm font-bold text-zinc-400">AMEX •••• 1004</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block font-bold uppercase">Total Mission Cost</span>
              <span className="text-2xl font-bold text-white">$420.00</span>
            </div>
          </div>
          <button 
            onClick={onConfirm}
            className="w-full py-5 bg-primary text-on-primary font-black uppercase tracking-[0.2em] rounded-lg shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-3"
          >
            Confirm Mission <ShieldCheck size={20} />
          </button>
        </div>
      </div>
    </motion.main>
  );
}

function Fleet({ onBack }: { onBack: () => void }) {
  const assets = [
    {
      id: 'escalade',
      name: 'Cadillac Escalade',
      tag: 'ARMORED COMMAND UNIT',
      rating: 'B7 ULTRA',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrQ-i7ZLNu8H4Pv9U1AyKnC1zb4vHF10GHUyfGyTL_40_lzTa0uN8SUdZRaxG_j2r-5MCrak9M2ikZ0a1VPYKJPI-Ew9_ZpibX1SoN9usQRQEWoSH74xFhB0xre-SMTe3e5rddlQoadllX-PCRn0Y6ZaJCFdDbTtUpqw-xlGgZugWba2TjK_NKUh-AkXuFtecZIn4hbDo0NSYntCc7RPYUZ8YScl9_PidvxWWCSdmvgGsm8tMAngrsSoEakH-zp052jz1b_i0jS7k',
      features: ['Encrypted Satellite Comms', 'Advanced Medical Suite', 'Independent Oxygen Supply']
    },
    {
      id: 'sclass',
      name: 'Mercedes-Benz S-Class Guard',
      tag: 'VIP STEALTH TRANSPORT',
      rating: 'VR10 RATING',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3bh1-Te38mi57cgbrEWY9KyEn7R_sx1748H6_9NSC_4YHsVuTFFoA4jWQVwJIY4sOxP94Sq-n_W84gN4j5d_oH2oEGIBK_DLqFCJy084fFvNp2NjzpMOqHm4TQpcons0XJhts1fZaZ22T9iPA3nfor9fwQ1Ho-Jy9PnFulDIRyGbQfMBrqnotehn5COyOkX3kkVT3-aboUlJO-5gNGd3PRI9coEsPW8IXsU3cD6_F1a21jDH9HxlpP3GlYlIFWelZ1e7sTOq_ApE',
      features: ['5G Integrated Hotspot', 'Trauma Stabilization Kit', 'Gas Filtration System']
    },
    {
      id: 'sentinel',
      name: 'Range Rover Sentinel',
      tag: 'OFF-ROAD EXTRACTION',
      rating: 'VR8 SENTINEL',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXrTiOrOibKN_0VifTk8buDMVcFjNTCpSsTm3B3xB9lmXA6pt4-gsCcINxxhwI87iIifb25X5uIifnQG8dSvqJWP-BqVvJ-_DIbHDMtwVaX4RribNN9-E82_-cWHRAhiapCEhLEgk55sg74cXZrUkdCbwy0a3r0lrf-qhXTyCNYttenFa1ZJLQ6IGsir7l7PrBugReGNNLDQRXsiC4g6e7JhfnBr8JJ95eeG3gDe8Km1Xz_ZMASHtuL2ixdQe9b5d-FCGkdIXao6Q',
      features: ['Signal Jamming Array', 'Tactical Med-Bay', 'CBRN Filtration']
    }
  ];

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen pt-24 pb-32 px-6"
    >
      <Header />
      <div className="max-w-7xl mx-auto mb-12">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2">Tactical Mobility</span>
        <h2 className="text-5xl font-black italic tracking-tighter mb-4">FLEET SELECTION</h2>
        <p className="text-lg text-secondary max-w-2xl">
          A curated hangar of ballistically engineered assets. Optimized for executive extraction, high-threat transit, and absolute discretion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {assets.map((asset) => (
          <div key={asset.id} className="relative flex flex-col glass-panel rounded-xl overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
              <img src={asset.image} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
              <div className="absolute top-4 left-4">
                <div className="bg-black/60 backdrop-blur-md border border-primary/40 px-3 py-1 rounded-full flex items-center gap-2">
                  <Shield size={12} className="text-primary fill-primary" />
                  <span className="text-[10px] font-bold text-white uppercase">{asset.rating}</span>
                </div>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold uppercase italic mb-1 tracking-tight">{asset.name}</h3>
              <p className="text-[10px] font-bold text-primary tracking-widest mb-6">{asset.tag}</p>
              <div className="space-y-4 mb-8 flex-grow">
                {asset.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle size={16} className="text-zinc-600" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-primary/90 transition-all flex justify-center items-center gap-2 group">
                Reserve Asset <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.main>
  );
}

function Operations({ onBack }: { onBack: () => void }) {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen"
    >
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="" className="h-8 object-contain scale-[2.5] origin-left ml-4" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.classList.remove('hidden'); }} />
          <span className="hidden text-xl font-black text-primary tracking-[0.2em] uppercase">CESPROE</span>
        </div>
        <HelpCircle className="text-zinc-500 hover:text-primary transition-colors cursor-pointer" size={20} />
      </header>

      <div className="absolute inset-0 z-0 bg-[#0A0A0A]">
        <img 
          src="/tactical_map_mexico.png" 
          className="w-full h-full object-cover opacity-40 grayscale contrast-125"
          alt="Tactical Map Mexico"
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-surface/90" />
        
        {/* Animated car icon on path */}
        <motion.div 
          initial={{ top: '80%', left: '20%' }}
          animate={{ top: '45%', left: '65%' }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute z-10"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <div className="bg-zinc-950 border-2 border-primary p-2 rounded-lg shadow-[0_0_15px_rgba(242,202,80,0.4)]">
              <CarIcon size={24} className="text-primary" />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 glass-panel px-3 py-1 rounded text-[10px] font-mono whitespace-nowrap text-primary border-primary/20 uppercase tracking-widest">
              SHIELD-01 | 42.4 KM/H
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative z-20 flex flex-col h-screen pt-20 px-6">
        <div className="flex flex-col gap-4 max-w-xs">
          <div className="glass-panel p-4 rounded-xl border-l-4 border-primary">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">LAT / LONG</span>
            <span className="text-sm font-mono text-white">19.4326° N / 99.1332° W</span>
          </div>

          <div className="glass-panel p-4 rounded-xl">
             <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20">
                   <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV1iY-_iN3DQhQCr_AZSOAqnvXazVzDJXOeVDJagR_QwbfwzV6jydzTGBruWvrv5bPXGF_cMlsUA0q_LxPnPv3OGF7jtmrYQ1ANymX5AltSCTVAlY-KITLgyPAvKVOAigqJ6XhB5UztQVWq7qE9l7zBCfrAf0vtHE9IBRESKjfW5K91DAe5-SgAc8xsrje8UQft3DTKSivLzucqkqaIcDpeGcbRrGK6urXwViqQMFf5jzmOZQqG-GQ0-MDEbb9qacEZZYTqLF8des" className="w-full h-full object-cover" alt="Pilot" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Marcus Vance</h4>
                  <p className="text-[10px] font-bold text-primary uppercase">Chief Tactical Pilot</p>
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase">
                  <span>Pulse Rating</span>
                  <span className="text-primary">72 BPM</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase">
                  <span>Armor</span>
                  <span className="text-on-surface">100%</span>
                </div>
             </div>
          </div>
        </div>

        <div className="mt-auto mb-32 flex flex-col items-center">
          <div className="w-full max-w-xl glass-panel p-4 rounded-2xl flex items-center justify-between border-primary/20 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase">Destination</p>
                <p className="text-white font-bold truncate max-w-[120px]">Executive Terminal A</p>
              </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <button className="bg-red-900 hover:bg-red-800 px-6 py-3 rounded-xl flex items-center gap-3 transition-all active:scale-95 group shadow-lg shadow-red-900/40">
              <AlertTriangle size={20} className="animate-pulse text-white fill-white/20" />
              <span className="font-bold tracking-widest uppercase text-xs text-white">SOS / Emergency</span>
            </button>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

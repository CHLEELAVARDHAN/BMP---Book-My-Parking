import React, { useState, useEffect } from 'react';
import { 
  Car, History, User, LogOut, Clock, CreditCard, ShieldCheck, Download, Menu, X, Bike, Zap, Building2, Plane, Train, Settings, Wallet, MapPin, Phone, Mail, Calendar, ChevronRight, Star, Info, CheckCircle2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface UserData {
  id: number; username: string; role: string; name: string; phone: string; city: string; address: string; pincode: string; created_at?: string; isNew?: boolean;
}
interface Slot { id: number; zone: string; category: string; slot_number: string; floor: string; section: string; status: string; }
interface Booking { id: number; slot_id: number; slot_number: string; zone: string; category: string; vehicle_number: string; entry_time: string; exit_time?: string; duration_minutes?: number; total_fee?: number; payment_status: string; floor?: string; section?: string; }

// --- Components ---
const Navbar = ({ user, onLogout, setView, currentView, theme, toggleTheme }: { user: UserData | null; onLogout: () => void; setView: (v: any) => void; currentView: string; theme: 'light' | 'dark'; toggleTheme: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isWhiteUI = theme === 'dark';
  
  return (
    <nav className={`${isWhiteUI ? 'bg-white border-black/10' : 'bg-black border-white/20'} border-b sticky top-0 z-50 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('book')}>
              <div className={`${isWhiteUI ? 'bg-black' : 'bg-white'} p-1.5 md:p-2 rounded-lg transition-colors`}>
                <Car className={`h-5 w-5 md:h-6 md:h-6 ${isWhiteUI ? 'text-white' : 'text-black'}`} />
              </div>
              <span className={`text-lg md:text-xl font-black tracking-tighter glow-text ${isWhiteUI ? 'text-black' : 'text-white'}`}>SMARTPARK</span>
            </div>
            {user && (
              <div className="hidden md:flex items-center space-x-1">
                {['book', 'history', 'profile'].map((v) => (
                  <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all glow-button ${currentView === v ? (isWhiteUI ? 'bg-black text-white' : 'bg-white text-black') : (isWhiteUI ? 'text-black/50 hover:text-black' : 'text-white/50 hover:text-white')}`}>
                    {v}
                  </button>
                ))}
                {user.role === 'admin' && (
                  <button onClick={() => setView('admin')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all glow-button ${currentView === 'admin' ? (isWhiteUI ? 'bg-black text-white' : 'bg-white text-black') : (isWhiteUI ? 'text-black/50 hover:text-black' : 'text-white/50 hover:text-white')}`}>
                    Admin
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${isWhiteUI ? 'text-black hover:bg-black/5' : 'text-white hover:bg-white/10'}`}>
              {isWhiteUI ? <Clock className="h-5 w-5" /> : <Zap className="h-5 w-5 fill-current" />}
            </button>
            {user && (
              <div className="flex items-center gap-3">
                <button onClick={() => setView('settings')} className={`p-2 transition-colors ${isWhiteUI ? 'text-black/50 hover:text-black' : 'text-white/50 hover:text-white'}`}><Settings className="h-5 w-5" /></button>
                <div className={`h-8 w-[1px] ${isWhiteUI ? 'bg-black/10' : 'bg-white/20'} mx-2`}></div>
                <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${isWhiteUI ? 'text-black bg-black/5 border-black/10' : 'text-white bg-white/10 border-white/20'} px-3 py-1.5 rounded-full border`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${isWhiteUI ? 'bg-black text-white' : 'bg-white text-black'}`}>{user.name[0]}</div>
                  <span>{user.name}</span>
                </div>
                <button onClick={onLogout} className={`p-2 transition-colors ${isWhiteUI ? 'text-black/50 hover:text-red-600' : 'text-white/50 hover:text-red-500'}`}><LogOut className="h-5 w-5" /></button>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={toggleTheme} className={`p-2 mr-2 rounded-full transition-colors ${isWhiteUI ? 'text-black' : 'text-white'}`}>
              {isWhiteUI ? <Clock className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className={isWhiteUI ? 'text-black' : 'text-white'}>{isOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </div>
      <AnimatePresence>{isOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={`md:hidden ${isWhiteUI ? 'bg-white border-black/10' : 'bg-black border-white/20'} border-b px-4 py-6 space-y-3`}>
          {user && ['book', 'history', 'profile', 'settings', 'admin'].filter(v => v !== 'admin' || user.role === 'admin').map(v => (
            <button key={v} onClick={() => { setView(v); setIsOpen(false); }} className={`w-full text-left px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest ${isWhiteUI ? 'text-black/70 hover:bg-black/5' : 'text-white/70 hover:bg-white/10'} ${currentView === v ? (isWhiteUI ? 'bg-black text-white' : 'bg-white text-black') : ''}`}>{v}</button>
          ))}
          {user && <button onClick={onLogout} className="w-full text-left px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10">Logout</button>}
        </motion.div>
      )}</AnimatePresence>
    </nav>
  );
};

const ProfileView = ({ user, stats, theme }: { user: UserData; stats: any; theme: 'light' | 'dark' }) => {
  const isWhiteUI = theme === 'dark';
  const cardClass = isWhiteUI ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10';
  const textPrimary = isWhiteUI ? 'text-black' : 'text-white';
  const textSecondary = isWhiteUI ? 'text-black/40' : 'text-white/40';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-12">
      <div className={`${cardClass} rounded-[32px] md:rounded-[40px] border p-6 md:p-10`}>
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className={`w-24 h-24 md:w-40 md:h-40 rounded-full ${isWhiteUI ? 'bg-black text-white' : 'bg-white text-black'} flex items-center justify-center text-4xl md:text-6xl font-black shadow-2xl`}>{user.name[0]}</div>
          <div className="flex-1 text-center md:text-left">
            <h2 className={`text-3xl md:text-5xl font-black tracking-tighter uppercase glow-text ${textPrimary}`}>{user.name}</h2>
            <p className={`${textSecondary} flex items-center justify-center md:justify-start gap-2 mb-4 md:mb-6 font-black uppercase text-[10px] md:text-xs tracking-widest`}><Mail className="h-4 w-4" /> {user.username}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
              <span className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full border text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] ${isWhiteUI ? 'bg-black text-white border-black' : 'bg-white text-black border-white'}`}>Verified Operative</span>
              <span className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full border text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] ${isWhiteUI ? 'border-black/20 text-black/60' : 'border-white/20 text-white/60'}`}>Active since {new Date(user.created_at || Date.now()).getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[
          { label: 'Total Parkings', value: stats?.total_bookings || 0, icon: Car, color: 'emerald' },
          { label: 'Total Spent', value: `₹${stats?.total_spent || 0}`, icon: Wallet, color: 'blue' },
          { label: 'Total Time', value: `${Math.round((stats?.total_duration || 0) / 60)}h`, icon: Clock, color: 'purple' }
        ].map((s, i) => (
          <div key={i} className={`${cardClass} p-8 md:p-10 rounded-[32px] md:rounded-[40px] border`}>
            <div className={`${isWhiteUI ? 'bg-black text-white' : 'bg-white text-black'} w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-4 md:mb-6`}><s.icon className="h-6 w-6 md:h-7 md:w-7" /></div>
            <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-1 md:mb-2 ${textSecondary}`}>{s.label}</p>
            <h4 className={`text-3xl md:text-4xl font-black tracking-tighter glow-text ${textPrimary}`}>{s.value}</h4>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const SettingsView = ({ user, onUpdate, theme }: { user: UserData; onUpdate: (u: UserData) => void; theme: 'light' | 'dark' }) => {
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const isWhiteUI = theme === 'dark';

  const handleUpdate = async (e: any) => {
    e.preventDefault(); setLoading(true);
    const res = await fetch('/api/user/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    const data = await res.json();
    if (data.success) { onUpdate(data.user); setMsg('Profile updated successfully!'); }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`max-w-2xl mx-auto ${isWhiteUI ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10'} rounded-[32px] md:rounded-[40px] border p-6 md:p-12 shadow-sm glow-box`}>
      <h2 className={`text-3xl md:text-4xl font-black uppercase tracking-tighter mb-8 md:mb-10 glow-text ${isWhiteUI ? 'text-black' : 'text-white'}`}>Settings</h2>
      <form onSubmit={handleUpdate} className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {[
            { label: 'Full Name', key: 'name' },
            { label: 'Phone', key: 'phone' },
            { label: 'City', key: 'city' },
            { label: 'Pincode', key: 'pincode' }
          ].map(f => (
            <div key={f.key} className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{f.label}</label>
              <input className={`w-full px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 outline-none transition-all font-black uppercase text-xs md:text-sm ${isWhiteUI ? 'bg-white border-black/10 focus:border-black' : 'bg-black border-white/10 focus:border-white'}`} value={(formData as any)[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} />
            </div>
          ))}
          <div className="space-y-2 md:col-span-2">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Address</label>
            <textarea className={`w-full px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 outline-none transition-all font-black uppercase text-xs md:text-sm h-24 md:h-32 ${isWhiteUI ? 'bg-white border-black/10 focus:border-black' : 'bg-black border-white/10 focus:border-white'}`} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
          </div>
        </div>
        {msg && <p className="text-emerald-500 text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {msg}</p>}
        <button disabled={loading} className={`w-full py-4 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-all glow-button ${isWhiteUI ? 'bg-black text-white hover:scale-[1.02]' : 'bg-white text-black hover:scale-[1.02]'} disabled:opacity-50`}>
          {loading ? 'Processing...' : 'Save Protocol'}
        </button>
      </form>
    </motion.div>
  );
};

const AdminView = ({ stats, theme }: { stats: any; theme: 'light' | 'dark' }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [tab, setTab] = useState<'stats' | 'users' | 'bookings'>('stats');
  const isWhiteUI = theme === 'dark';
  const cardClass = isWhiteUI ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10';

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(setUsers);
    fetch('/api/admin/recent-bookings').then(r => r.json()).then(setRecent);
  }, []);

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="flex flex-wrap gap-3 md:gap-4">
        {['stats', 'users', 'bookings'].map(t => (
          <button key={t} onClick={() => setTab(t as any)} className={`px-6 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all glow-button ${tab === t ? (isWhiteUI ? 'bg-black text-white' : 'bg-white text-black') : (isWhiteUI ? 'bg-black/5 text-black/40 hover:bg-black/10' : 'bg-white/5 text-white/40 hover:bg-white/10')}`}>{t}</button>
        ))}
      </div>
      {tab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            { label: 'Revenue', value: `₹${stats?.revenue}`, color: 'text-emerald-500' },
            { label: 'Bookings', value: stats?.bookings, color: '' },
            { label: 'Active', value: stats?.active, color: '' },
            { label: 'Users', value: stats?.users, color: '' }
          ].map((s, i) => (
            <div key={i} className={`${cardClass} p-8 md:p-10 rounded-[32px] md:rounded-[40px] border`}>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1 md:mb-2">{s.label}</p>
              <h4 className={`text-3xl md:text-4xl font-black tracking-tighter glow-text ${s.color || ''}`}>{s.value}</h4>
            </div>
          ))}
        </div>
      )}
      {(tab === 'users' || tab === 'bookings') && (
        <div className={`${cardClass} rounded-[32px] md:rounded-[40px] border overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className={`${isWhiteUI ? 'bg-black/5' : 'bg-white/5'} text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-30`}>
                <tr>
                  {tab === 'users' ? (
                    <>
                      <th className="px-6 md:px-10 py-4 md:py-6">User</th>
                      <th className="px-6 md:px-10 py-4 md:py-6">Contact</th>
                      <th className="px-6 md:px-10 py-4 md:py-6">City</th>
                      <th className="px-6 md:px-10 py-4 md:py-6">Joined</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 md:px-10 py-4 md:py-6">Vehicle</th>
                      <th className="px-6 md:px-10 py-4 md:py-6">User</th>
                      <th className="px-6 md:px-10 py-4 md:py-6">Location</th>
                      <th className="px-6 md:px-10 py-4 md:py-6">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className={`divide-y ${isWhiteUI ? 'divide-black/10' : 'divide-white/10'}`}>
                {tab === 'users' ? users.map(u => (
                  <tr key={u.id} className={`${isWhiteUI ? 'hover:bg-black/5' : 'hover:bg-white/5'} transition-colors`}>
                    <td className="px-6 md:px-10 py-6 md:py-8"><div className="font-black uppercase text-xs md:text-sm">{u.name}</div><div className="text-[9px] md:text-[10px] font-black uppercase opacity-30">@{u.username}</div></td>
                    <td className="px-6 md:px-10 py-6 md:py-8 text-[10px] md:text-xs font-black uppercase opacity-60">{u.phone}</td>
                    <td className="px-6 md:px-10 py-6 md:py-8 text-[10px] md:text-xs font-black uppercase opacity-60">{u.city}</td>
                    <td className="px-6 md:px-10 py-6 md:py-8 text-[10px] md:text-xs font-black uppercase opacity-30">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                )) : recent.map(b => (
                  <tr key={b.id} className={`${isWhiteUI ? 'hover:bg-black/5' : 'hover:bg-white/5'} transition-colors`}>
                    <td className="px-6 md:px-10 py-6 md:py-8 font-black uppercase text-xs md:text-sm">{b.vehicle_number}</td>
                    <td className="px-6 md:px-10 py-6 md:py-8 text-[10px] md:text-xs font-black uppercase opacity-60">{b.user_name}</td>
                    <td className="px-6 md:px-10 py-6 md:py-8 text-[10px] md:text-xs font-black uppercase opacity-60">{b.zone} • {b.slot_number}</td>
                    <td className="px-6 md:px-10 py-6 md:py-8"><span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest ${b.exit_time ? (isWhiteUI ? 'bg-black/5 text-black/40' : 'bg-white/5 text-white/40') : (isWhiteUI ? 'bg-black text-white' : 'bg-white text-black')}`}>{b.exit_time ? 'Completed' : 'Active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ user, onUpdate, theme, toggleTheme }: { user: UserData; onUpdate: (u: UserData) => void; theme: 'light' | 'dark'; toggleTheme: () => void }) => {
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [history, setHistory] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedZone, setSelectedZone] = useState('Mall');
  const [selectedCategory, setSelectedCategory] = useState('Car');
  const [view, setView] = useState<'book' | 'history' | 'admin' | 'profile' | 'settings'>('book');
  const [bookingModal, setBookingModal] = useState<Slot | null>(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [paymentModal, setPaymentModal] = useState<Booking | null>(null);
  const [receiptModal, setReceiptModal] = useState<any>(null);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);

  // INVERSION: Dark Theme -> White UI, Light Theme -> Black UI
  const isWhiteUI = theme === 'dark';
  const bgClass = isWhiteUI ? 'bg-white text-black' : 'bg-black text-white';
  const cardClass = isWhiteUI ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10';
  const accentClass = isWhiteUI ? 'bg-black text-white' : 'bg-white text-black';

  useEffect(() => { fetchActiveBooking(); fetchHistory(); fetchUserStats(); if (user.role === 'admin') fetchAdminStats(); }, []);
  useEffect(() => { if (view === 'book') fetchSlots(); }, [selectedZone, selectedCategory, view]);

  const fetchActiveBooking = async () => setActiveBooking(await (await fetch(`/api/bookings/active/${user.id}`)).json());
  const fetchHistory = async () => setHistory(await (await fetch(`/api/bookings/history/${user.id}`)).json());
  const fetchSlots = async () => setSlots(await (await fetch(`/api/slots?zone=${selectedZone}&category=${selectedCategory}`)).json());
  const fetchAdminStats = async () => setAdminStats(await (await fetch('/api/admin/stats')).json());
  const fetchUserStats = async () => setUserStats(await (await fetch(`/api/user/stats/${user.id}`)).json());

  const handleBook = async () => {
    if (!bookingModal || !vehicleNumber) return;
    const res = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, slotId: bookingModal.id, vehicleNumber }) });
    if ((await res.json()).success) { setBookingModal(null); setVehicleNumber(''); fetchActiveBooking(); fetchSlots(); }
  };

  const handleExit = async (paymentMethod: string) => {
    if (!activeBooking) return;
    const res = await fetch('/api/bookings/exit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookingId: activeBooking.id, paymentMethod }) });
    const data = await res.json();
    if (data.success) { 
      setReceiptModal({ ...activeBooking, ...data, paymentMethod, exit_time: new Date().toISOString() });
      setPaymentModal(null); setActiveBooking(null); fetchHistory(); fetchSlots(); fetchUserStats(); if (user.role === 'admin') fetchAdminStats(); 
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgClass}`}>
      <Navbar user={user} onLogout={() => { localStorage.removeItem('smartpark_user'); window.location.reload(); }} setView={setView} currentView={view} theme={theme} toggleTheme={toggleTheme} />
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8 md:mb-12">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none glow-text">
            {user.isNew ? 'Welcome,' : 'Welcome back,'} <br />
            <span className="opacity-40">{user.name}</span>
          </h2>
          <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mt-3 md:mt-4 opacity-40`}>
            {user.isNew ? "New operative detected. Initialize parking protocol." : "Returning operative. System ready."}
          </p>
        </motion.div>

        <div className="mt-4">
        <AnimatePresence mode="wait">
          {view === 'book' && (
            <motion.div key="book" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12 md:space-y-16">
              {activeBooking && (
                <div className={`${accentClass} rounded-[32px] md:rounded-[50px] p-6 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 shadow-2xl transition-all`}>
                  <div className="flex items-center gap-6 md:gap-8">
                    <div className={`${isWhiteUI ? 'bg-white/10' : 'bg-black/10'} p-4 md:p-5 rounded-2xl md:rounded-3xl backdrop-blur-md`}><Clock className="h-8 w-8 md:h-10 md:w-10" /></div>
                    <div>
                      <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter glow-text">Active Session</h3>
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-60">{activeBooking.zone} • {activeBooking.slot_number} • {activeBooking.vehicle_number}</p>
                    </div>
                  </div>
                  <button onClick={() => setPaymentModal(activeBooking)} className={`${isWhiteUI ? 'bg-white text-black' : 'bg-black text-white'} w-full md:w-auto px-10 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:scale-105 transition-all glow-button`}>End Session</button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className={`${cardClass} p-8 md:p-12 rounded-[32px] md:rounded-[50px] border`}>
                  <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] mb-6 md:mb-10 opacity-30">Select Zone</label>
                  <div className="grid grid-cols-3 gap-4 md:gap-6">
                    {['Mall', 'Airport', 'Railway'].map(zone => (
                      <button key={zone} onClick={() => setSelectedZone(zone)} className={`flex flex-col items-center gap-3 md:gap-5 py-6 md:py-10 rounded-[24px] md:rounded-[40px] border-2 transition-all glow-button ${selectedZone === zone ? accentClass : (isWhiteUI ? 'bg-transparent text-black/40 border-black/10 hover:border-black' : 'bg-transparent text-white/40 border-white/10 hover:border-white')}`}>
                        {zone === 'Mall' && <Building2 className="h-6 w-6 md:h-8 md:w-8" />}
                        {zone === 'Airport' && <Plane className="h-6 w-6 md:h-8 md:w-8" />}
                        {zone === 'Railway' && <Train className="h-6 w-6 md:h-8 md:w-8" />}
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{zone}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className={`${cardClass} p-8 md:p-12 rounded-[32px] md:rounded-[50px] border`}>
                  <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] mb-6 md:mb-10 opacity-30">Category</label>
                  <div className="grid grid-cols-3 gap-4 md:gap-6">
                    {['Car', 'Bike', 'EV'].map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} className={`flex flex-col items-center gap-3 md:gap-5 py-6 md:py-10 rounded-[24px] md:rounded-[40px] border-2 transition-all glow-button ${selectedCategory === cat ? accentClass : (isWhiteUI ? 'bg-transparent text-black/40 border-black/10 hover:border-black' : 'bg-transparent text-white/40 border-white/10 hover:border-white')}`}>
                        {cat === 'Car' && <Car className="h-6 w-6 md:h-8 md:w-8" />}
                        {cat === 'Bike' && <Bike className="h-6 w-6 md:h-8 md:w-8" />}
                        {cat === 'EV' && <Zap className="h-6 w-6 md:h-8 md:w-8" />}
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
                <div className={`${cardClass} p-8 md:p-16 rounded-[40px] md:rounded-[60px] border`}>
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 md:mb-16">
                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter glow-text">Slots</h3>
                    <div className="flex gap-6 md:gap-10 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                      <div className="flex items-center gap-3 md:gap-4"><div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${isWhiteUI ? 'bg-black' : 'bg-white'}`}></div><span className="opacity-30">Free</span></div>
                      <div className="flex items-center gap-3 md:gap-4"><div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border ${isWhiteUI ? 'border-black/20' : 'border-white/20'}`}></div><span className="opacity-30">Taken</span></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-10">
                    {slots.map(slot => (
                      <button key={slot.id} disabled={slot.status === 'Occupied' || !!activeBooking} onClick={() => setBookingModal(slot)} className={`relative p-8 md:p-12 rounded-[24px] md:rounded-[40px] border-2 transition-all glow-button ${slot.status === 'Occupied' ? 'opacity-10 cursor-not-allowed' : (isWhiteUI ? 'border-black/10 hover:border-black hover:bg-black hover:text-white' : 'border-white/10 hover:border-white hover:bg-white hover:text-black')}`}>
                        <span className="text-2xl md:text-4xl font-black">{slot.slot_number}</span>
                        <p className="text-[8px] md:text-[9px] mt-2 md:mt-4 uppercase tracking-[0.4em] font-black opacity-30">F{slot.floor} • S{slot.section}</p>
                      </button>
                    ))}
                  </div>
                </div>
            </motion.div>
          )}
            {view === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`${cardClass} rounded-[32px] md:rounded-[50px] border overflow-hidden`}>
                <div className="p-8 md:p-12 border-b border-black/10"><h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter glow-text">History</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead className={`${isWhiteUI ? 'bg-black/5' : 'bg-white/5'} text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] opacity-30`}><tr><th className="px-8 md:px-12 py-6 md:py-8">Vehicle</th><th className="px-8 md:px-12 py-6 md:py-8">Location</th><th className="px-8 md:px-12 py-6 md:py-8">Duration</th><th className="px-8 md:px-12 py-6 md:py-8">Amount</th><th className="px-8 md:px-12 py-6 md:py-8">Date</th><th className="px-8 md:px-12 py-6 md:py-8 text-right">Action</th></tr></thead>
                    <tbody className={`divide-y ${isWhiteUI ? 'divide-black/10' : 'divide-white/10'}`}>
                      {history.map(item => (
                        <tr key={item.id} className={`${isWhiteUI ? 'hover:bg-black/5' : 'hover:bg-white/5'} transition-colors`}>
                          <td className="px-8 md:px-12 py-8 md:py-10"><div className="font-black uppercase text-sm md:text-base">{item.vehicle_number}</div><div className="text-[9px] md:text-[10px] font-black uppercase opacity-30">{item.category}</div></td>
                          <td className="px-8 md:px-12 py-8 md:py-10"><div className="text-sm md:text-base font-black uppercase">{item.zone}</div><div className="text-[9px] md:text-[10px] font-black uppercase opacity-30">Slot {item.slot_number}</div></td>
                          <td className="px-8 md:px-12 py-8 md:py-10 text-[10px] md:text-xs font-black uppercase opacity-50">{item.duration_minutes}m</td>
                          <td className="px-8 md:px-12 py-8 md:py-10 font-black text-xl md:text-2xl">₹{item.total_fee}</td>
                          <td className="px-8 md:px-12 py-8 md:py-10 text-[10px] md:text-xs font-black uppercase opacity-30">{new Date(item.exit_time!).toLocaleDateString()}</td>
                          <td className="px-8 md:px-12 py-8 md:py-10 text-right"><button onClick={() => setReceiptModal(item)} className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all glow-button ${isWhiteUI ? 'hover:bg-black hover:text-white' : 'hover:bg-white hover:text-black'}`}><Download className="h-5 w-5 md:h-6 md:w-6" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
            {view === 'profile' && <ProfileView user={user} stats={userStats} theme={theme} />}
            {view === 'settings' && <SettingsView user={user} onUpdate={onUpdate} theme={theme} />}
            {view === 'admin' && <AdminView stats={adminStats} theme={theme} />}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals - Updated for Inverted Theme */}
      <AnimatePresence>
        {bookingModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBookingModal(null)} className={`absolute inset-0 ${isWhiteUI ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-2xl`} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} className={`relative ${isWhiteUI ? 'bg-white text-black' : 'bg-black text-white'} rounded-[40px] md:rounded-[60px] shadow-2xl w-full max-w-lg overflow-hidden border ${isWhiteUI ? 'border-black/10' : 'border-white/10'} glow-box`}>
              <div className="p-8 md:p-16 space-y-8 md:space-y-12">
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter glow-text">Confirm</h3>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Slot {bookingModal.slot_number} • F{bookingModal.floor} • {bookingModal.zone}</p>
                </div>
                <div className="space-y-4 md:space-y-6">
                  <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] opacity-30">Vehicle ID</label>
                  <input placeholder="MH 12 AB 1234" className={`w-full px-6 md:px-10 py-4 md:py-8 rounded-2xl md:rounded-[32px] border-4 outline-none transition-all text-2xl md:text-4xl font-black uppercase placeholder:opacity-10 ${isWhiteUI ? 'bg-black/5 border-black/10 focus:border-black' : 'bg-white/5 border-white/10 focus:border-white'}`} value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} />
                </div>
                <div className="flex gap-4 md:gap-6 pt-4 md:pt-6">
                  <button onClick={() => setBookingModal(null)} className={`flex-1 py-4 md:py-8 rounded-xl md:rounded-[32px] font-black uppercase tracking-widest text-[10px] md:text-xs transition-all glow-button ${isWhiteUI ? 'text-black/30 hover:bg-black/5' : 'text-white/30 hover:bg-white/5'}`}>Cancel</button>
                  <button onClick={handleBook} disabled={!vehicleNumber} className={`flex-1 py-4 md:py-8 rounded-xl md:rounded-[32px] font-black uppercase tracking-widest text-[10px] md:text-xs transition-all glow-button ${isWhiteUI ? 'bg-black text-white hover:scale-105' : 'bg-white text-black hover:scale-105'} disabled:opacity-10`}>Confirm</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        {paymentModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPaymentModal(null)} className={`absolute inset-0 ${isWhiteUI ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-2xl`} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} className={`relative ${isWhiteUI ? 'bg-white text-black' : 'bg-black text-white'} rounded-[40px] md:rounded-[60px] shadow-2xl w-full max-lg overflow-hidden border ${isWhiteUI ? 'border-black/10' : 'border-white/10'} glow-box`}>
              <div className={`p-8 md:p-16 ${isWhiteUI ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter glow-text">Checkout</h3>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Session Summary</p>
              </div>
              <div className="p-8 md:p-16 space-y-8 md:space-y-12">
                <div className="space-y-4 md:space-y-6">
                  <div className={`flex justify-between items-center pb-4 md:pb-6 border-b ${isWhiteUI ? 'border-black/10' : 'border-white/10'}`}>
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-30">Vehicle</span>
                    <span className="text-xl md:text-2xl font-black uppercase">{paymentModal.vehicle_number}</span>
                  </div>
                  <div className={`flex justify-between items-center pb-4 md:pb-6 border-b ${isWhiteUI ? 'border-black/10' : 'border-white/10'}`}>
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-30">Duration</span>
                    <span className="text-xl md:text-2xl font-black uppercase">{Math.ceil((Date.now() - new Date(paymentModal.entry_time).getTime()) / 60000)}m</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 md:pt-4">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-30">Total Fee</span>
                    <span className="text-4xl md:text-6xl font-black tracking-tighter">₹{Math.max(10, Math.ceil((Date.now() - new Date(paymentModal.entry_time).getTime()) / 60000) * 2)}</span>
                  </div>
                </div>
                <div className="space-y-6 md:space-y-8">
                  <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-30">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    {['Card', 'GPay', 'PhonePe', 'Cash'].map(method => (
                      <button key={method} onClick={() => handleExit(method)} className={`flex items-center justify-center gap-3 md:gap-4 py-6 md:py-8 rounded-2xl md:rounded-[32px] border-2 transition-all font-black uppercase text-[10px] md:text-xs glow-button ${isWhiteUI ? 'border-black/10 hover:border-black hover:bg-black hover:text-white' : 'border-white/10 hover:border-white hover:bg-white hover:text-black'}`}>
                        {method === 'Card' && <CreditCard className="h-5 w-5 md:h-6 md:w-6" />}
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        {receiptModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReceiptModal(null)} className={`absolute inset-0 ${isWhiteUI ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-3xl`} />
            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className={`relative ${isWhiteUI ? 'bg-white text-black' : 'bg-black text-white'} rounded-[40px] md:rounded-[60px] shadow-2xl w-full max-w-xl overflow-hidden border ${isWhiteUI ? 'border-black/10' : 'border-white/10'} glow-box`}>
              <div className="p-8 md:p-16 space-y-8 md:space-y-12">
                <div className="text-center space-y-4 md:space-y-6">
                  <div className={`${isWhiteUI ? 'bg-black text-white' : 'bg-white text-black'} w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8`}><CheckCircle2 className="h-8 w-8 md:h-12 md:w-12" /></div>
                  <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter glow-text">Success</h3>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Transaction Complete</p>
                </div>
                <div className={`${isWhiteUI ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10'} rounded-[24px] md:rounded-[40px] p-6 md:p-10 space-y-6 md:space-y-8 border`}>
                  <div className="flex justify-between text-[8px] md:text-[10px] font-black uppercase tracking-widest"><span className="opacity-30">Receipt ID</span><span>#SP-{receiptModal.id}</span></div>
                  <div className="flex justify-between text-[8px] md:text-[10px] font-black uppercase tracking-widest"><span className="opacity-30">Vehicle</span><span>{receiptModal.vehicle_number}</span></div>
                  <div className="flex justify-between text-[8px] md:text-[10px] font-black uppercase tracking-widest"><span className="opacity-30">Location</span><span>{receiptModal.zone} • {receiptModal.slot_number}</span></div>
                  <div className="flex justify-between text-[8px] md:text-[10px] font-black uppercase tracking-widest"><span className="opacity-30">In</span><span>{new Date(receiptModal.entry_time).toLocaleTimeString()}</span></div>
                  <div className="flex justify-between text-[8px] md:text-[10px] font-black uppercase tracking-widest"><span className="opacity-30">Out</span><span>{new Date(receiptModal.exit_time).toLocaleTimeString()}</span></div>
                  <div className={`pt-6 md:pt-8 border-t ${isWhiteUI ? 'border-black/10' : 'border-white/10'} flex justify-between items-center`}><span className="text-lg md:text-xl font-black uppercase tracking-tighter">Total Paid</span><span className="text-3xl md:text-5xl font-black tracking-tighter">₹{receiptModal.total_fee || receiptModal.fee}</span></div>
                </div>
                <div className="flex gap-4 md:gap-6">
                  <button onClick={() => window.print()} className={`flex-1 ${isWhiteUI ? 'bg-black text-white' : 'bg-white text-black'} py-6 md:py-8 rounded-2xl md:rounded-[32px] font-black uppercase tracking-widest text-[10px] md:text-xs hover:scale-105 transition-all flex items-center justify-center gap-3 md:gap-4 glow-button`}><Download className="h-5 w-5 md:h-6 md:w-6" /> Print</button>
                  <button onClick={() => setReceiptModal(null)} className={`flex-1 ${isWhiteUI ? 'bg-black/5 text-black/40' : 'bg-white/5 text-white/40'} py-6 md:py-8 rounded-2xl md:rounded-[32px] font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-opacity-10 transition-all glow-button`}>Close</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BlackHoleBackground = ({ theme }: { theme: 'light' | 'dark' }) => {
  const isWhiteUI = theme === 'dark';
  return (
    <div className={`fixed inset-0 -z-10 ${isWhiteUI ? 'bg-zinc-50' : 'bg-[#050505]'} overflow-hidden transition-colors duration-700`}>
      {/* Accretion Disk Swirl */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] perspective-[1000px]">
        <motion.div
          animate={{ rotateZ: 360, rotateX: [20, 30, 20], rotateY: [10, -10, 10] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className={`absolute inset-0 rounded-full border-[60px] ${isWhiteUI ? 'border-emerald-600/5' : 'border-emerald-500/10'} blur-[80px]`}
        />
        <motion.div
          animate={{ rotateZ: -360, rotateX: [40, 50, 40] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`absolute inset-0 rounded-full border-[30px] ${isWhiteUI ? 'border-emerald-500/5' : 'border-emerald-400/5'} blur-[40px] scale-125`}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-0 rounded-full ${isWhiteUI ? 'bg-[radial-gradient(circle,_rgba(16,185,129,0.05)_0%,_transparent_70%)]' : 'bg-[radial-gradient(circle,_rgba(16,185,129,0.1)_0%,_transparent_70%)]'} blur-3xl`}
        />
      </div>
      
      {/* The Singularity */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 ${isWhiteUI ? 'bg-white border border-black/5' : 'bg-black'} rounded-full shadow-[0_0_120px_rgba(16,185,129,0.2),_inset_0_0_60px_rgba(16,185,129,0.1)] z-10`}
      >
        <div className={`absolute inset-0 rounded-full ${isWhiteUI ? 'bg-gradient-to-tr from-emerald-100/40 to-transparent' : 'bg-gradient-to-tr from-emerald-900/40 to-transparent'} opacity-50`}></div>
        {/* Event Horizon Glow */}
        <div className={`absolute -inset-1 rounded-full ${isWhiteUI ? 'bg-emerald-500/10' : 'bg-emerald-500/20'} blur-sm`}></div>
      </motion.div>

      {/* Sucking Particles */}
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 2000 - 1000 + (typeof window !== 'undefined' ? window.innerWidth / 2 : 0), 
            y: Math.random() * 2000 - 1000 + (typeof window !== 'undefined' ? window.innerHeight / 2 : 0),
            opacity: 0,
            scale: Math.random() * 1 + 0.5
          }}
          animate={{ 
            x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
            y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
            opacity: [0, 1, 0],
            scale: 0
          }}
          transition={{ 
            duration: Math.random() * 4 + 3, 
            repeat: Infinity, 
            delay: Math.random() * 10,
            ease: "circIn"
          }}
          className={`absolute w-1 h-1 ${isWhiteUI ? 'bg-emerald-600' : 'bg-emerald-300'} rounded-full blur-[0.5px]`}
        />
      ))}
      
      {/* Distant Stars */}
      {[...Array(100)].map((_, i) => (
        <div
          key={`star-${i}`}
          className={`absolute w-0.5 h-0.5 ${isWhiteUI ? 'bg-black/10' : 'bg-white/20'} rounded-full`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random()
          }}
        />
      ))}
    </div>
  );
};

const AuthForm = ({ type, onSuccess, theme }: { type: 'login' | 'signup'; onSuccess: (user: UserData) => void; theme: 'light' | 'dark' }) => {
  const [formData, setFormData] = useState({ username: '', password: '', name: '', phone: '', address: '', city: '', pincode: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const isWhiteUI = theme === 'dark';

  useEffect(() => {
    const visited = localStorage.getItem('smartpark_returning');
    if (visited) setIsReturning(true);
    else if (type === 'login') localStorage.setItem('smartpark_returning', 'true');
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault(); setError(''); setLoading(true);
    const res = await fetch(type === 'login' ? '/api/login' : '/api/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('smartpark_returning', 'true');
      onSuccess(data.user);
    } else setError(data.error || 'Failed');
    setLoading(false);
  };

  return (
    <div className={`${isWhiteUI ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10'} backdrop-blur-3xl p-8 md:p-12 rounded-[32px] md:rounded-[50px] shadow-2xl border max-w-md w-full relative z-10 glow-box`}>
      <h2 className={`text-3xl md:text-5xl font-black tracking-tighter uppercase mb-8 md:mb-10 glow-text ${isWhiteUI ? 'text-black' : 'text-white'}`}>
        {type === 'login' ? (isReturning ? 'Welcome Back' : 'Welcome') : 'Welcome'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="space-y-2">
          <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Username</label>
          <input required className={`w-full px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 outline-none transition-all font-black uppercase text-xs md:text-sm ${isWhiteUI ? 'bg-white border-black/10 focus:border-black' : 'bg-black border-white/10 focus:border-white'}`} value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Password</label>
          <input required type="password" className={`w-full px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 outline-none transition-all font-black uppercase text-xs md:text-sm ${isWhiteUI ? 'bg-white border-black/10 focus:border-black' : 'bg-black border-white/10 focus:border-white'}`} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
        </div>
        {type === 'signup' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Full Name</label>
              <input required className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-black uppercase text-sm ${isWhiteUI ? 'bg-white border-black/10 focus:border-black' : 'bg-black border-white/10 focus:border-white'}`} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Phone</label>
                <input required className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-black uppercase text-sm ${isWhiteUI ? 'bg-white border-black/10 focus:border-black' : 'bg-black border-white/10 focus:border-white'}`} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">City</label>
                <input required className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all font-black uppercase text-sm ${isWhiteUI ? 'bg-white border-black/10 focus:border-black' : 'bg-black border-white/10 focus:border-white'}`} value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
              </div>
            </div>
          </div>
        )}
        {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {error}</p>}
        <button disabled={loading} className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all glow-button ${isWhiteUI ? 'bg-black text-white hover:scale-[1.02]' : 'bg-white text-black hover:scale-[1.02]'} disabled:opacity-50 mt-4`}>
          {loading ? 'Processing...' : (type === 'login' ? 'Initialize' : 'Register')}
        </button>
      </form>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => { 
    const s = localStorage.getItem('smartpark_user'); 
    if (s) setUser(JSON.parse(s)); 
    const t = localStorage.getItem('smartpark_theme') as 'light' | 'dark';
    if (t) setTheme(t);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('smartpark_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleAuthSuccess = (u: UserData) => { setUser(u); localStorage.setItem('smartpark_user', JSON.stringify(u)); };
  
  const isWhiteUI = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isWhiteUI ? 'bg-white text-black' : 'bg-black text-white'} selection:bg-emerald-500/30`}>
      {!user ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
          <BlackHoleBackground theme={theme} />
          <div className="absolute top-8 right-8 z-50">
            <button onClick={toggleTheme} className={`p-4 rounded-full border transition-all glow-button ${isWhiteUI ? 'border-black/20 text-black hover:bg-black/5' : 'border-white/20 text-white hover:bg-white/10'}`}>
              {isWhiteUI ? <Clock className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
            </button>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-12 space-y-4 relative z-10">
            <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border shadow-sm mb-4 ${isWhiteUI ? 'bg-black/5 border-black/10' : 'bg-white/10 border-white/10'}`}>
              <Car className={`h-5 w-5 ${isWhiteUI ? 'text-black' : 'text-white'}`} />
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isWhiteUI ? 'text-black' : 'text-white'}`}>SmartPark Systems</span>
            </div>
            <h1 className={`text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase glow-text ${isWhiteUI ? 'text-black' : 'text-white'}`}>
              Urban <br /> Mobility <br /> <span className="opacity-40">Redefined.</span>
            </h1>
            <p className={`max-w-md mx-auto font-black text-xs uppercase tracking-[0.2em] ${isWhiteUI ? 'text-black/40' : 'text-white/40'}`}>
              The smarter way to find, book, and pay for parking in your city.
            </p>
          </motion.div>
          <AuthForm type={authType} onSuccess={handleAuthSuccess} theme={theme} />
          <p className={`mt-8 font-black text-[10px] uppercase tracking-widest relative z-10 ${isWhiteUI ? 'text-black/40' : 'text-white/40'}`}>
            {authType === 'login' ? "New to SmartPark?" : "Already a member?"} 
            <button onClick={() => setAuthType(authType === 'login' ? 'signup' : 'login')} className={`ml-2 underline hover:opacity-100 transition-opacity glow-text ${isWhiteUI ? 'text-black' : 'text-white'}`}>
              {authType === 'login' ? 'Create Account' : 'Sign In'}
            </button>
          </p>
        </div>
      ) : (
        <Dashboard user={user} onUpdate={u => { setUser(u); localStorage.setItem('smartpark_user', JSON.stringify(u)); }} theme={theme} toggleTheme={toggleTheme} />
      )}
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithCustomToken,
  signInAnonymously, 
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  ClipboardList, 
  Users, 
  LogOut, 
  ChevronRight,
  Loader2,
  AlertCircle,
  Save,
  Download,
  Trash2,
  ChevronLeft,
  FileCode,
  Target,
  Lock,
  AlertTriangle,
  User,
  School,
  Clock,
  Book,
  Edit3,
  ListOrdered,
  Monitor,
  Palette,
  Layout,
  Check,
  Image as ImageIcon,
  Settings,
  PenTool,
  Menu,
  Eye,
  CheckCircle,
  Heart,
  MessageCircle,
  Wrench,
  Rocket,
  Map
} from 'lucide-react';

// --- INITIALIZATION ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'chrisly-education-v1';
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// --- ADMIN CREDENTIALS ---
const ADMIN_CREDENTIALS = {
  username: "Chrislystudio",
  password: "123789Ok@@#"
};

// --- PENGATURAN LOGO APLIKASI ---
const CUSTOM_LOGO_URL = ""; 

const AppLogo = ({ size, className }) => {
  if (CUSTOM_LOGO_URL) {
    return <img src={CUSTOM_LOGO_URL} alt="App Logo" style={{ width: size, height: size, objectFit: 'contain' }} className={className} />;
  }
  return <BookOpen size={size} strokeWidth={2.5} className={className} />;
};

// --- PLAN CONFIGURATION ---
const PLANS = {
  'plus': { label: 'Plus', limit: 5, color: 'bg-[#0F172A] text-slate-300', border: 'border-blue-500/30' },
  'pro': { label: 'Pro', limit: 20, color: 'bg-[#003366] text-[#3B82F6]', border: 'border-blue-500/50' },
  'ultra': { label: 'Ultra', limit: 50, color: 'bg-[#FF8C00]/20 text-[#FF8C00]', border: 'border-[#FF8C00]/50' },
  'beginner': { label: 'Beginner (Lama)', limit: 50, color: 'bg-[#0F172A] text-slate-300', border: 'border-blue-500/30' },
  'medium': { label: 'Medium (Lama)', limit: 10, color: 'bg-[#003366] text-[#3B82F6]', border: 'border-blue-500/50' }
};

// --- COLOR THEMES CONFIGURATION (10 THEMES) ---
const COLOR_THEMES = [
  { id: 'profesional', label: 'Biru Tua (Profesional)', bg: 'FFFFFF', titleCol: '1E3A8A', bodyCol: '334155', colors: ['#FFFFFF', '#1E3A8A', '#334155'] },
  { id: 'darkmode', label: 'Hitam (Elegan)', bg: 'FFFFFF', titleCol: '0F172A', bodyCol: '334155', colors: ['#FFFFFF', '#0F172A', '#334155'] },
  { id: 'nature', label: 'Hijau Daun (Segar)', bg: 'FFFFFF', titleCol: '166534', bodyCol: '334155', colors: ['#FFFFFF', '#166534', '#334155'] },
  { id: 'warm', label: 'Merah Bata (Hangat)', bg: 'FFFFFF', titleCol: 'C2410C', bodyCol: '334155', colors: ['#FFFFFF', '#C2410C', '#334155'] },
  { id: 'creative', label: 'Ungu Tua (Kreatif)', bg: 'FFFFFF', titleCol: '7E22CE', bodyCol: '334155', colors: ['#FFFFFF', '#7E22CE', '#334155'] },
  { id: 'minimalist', label: 'Abu-Abu (Minimalis)', bg: 'FFFFFF', titleCol: '475569', bodyCol: '334155', colors: ['#FFFFFF', '#475569', '#334155'] },
  { id: 'sunset', label: 'Coklat Karamel (Mentari)', bg: 'FFFFFF', titleCol: 'B45309', bodyCol: '334155', colors: ['#FFFFFF', '#B45309', '#334155'] },
  { id: 'ocean', label: 'Biru Tosca (Samudra)', bg: 'FFFFFF', titleCol: '0E7490', bodyCol: '334155', colors: ['#FFFFFF', '#0E7490', '#334155'] },
  { id: 'rose', label: 'Merah Tua (Rose)', bg: 'FFFFFF', titleCol: 'BE123C', bodyCol: '334155', colors: ['#FFFFFF', '#BE123C', '#334155'] },
  { id: 'earth', label: 'Coklat Tua (Bumi)', bg: 'FFFFFF', titleCol: '92400E', bodyCol: '334155', colors: ['#FFFFFF', '#92400E', '#334155'] }
];

// --- GENERATOR TOOLS LIST ---
const GENERATOR_TOOLS = [
  {id:'rpm', title:'Rencana Pembelajaran Mendalam', desc:'Penyusunan rencana pembelajaran inovatif dan komprehensif.', icon:FileText, color:'text-emerald-400 bg-emerald-500/20 border border-emerald-500/30'},
  {id:'modul', title:'Rencana Pelaksanaan Pembelajaran', desc:'Penyusunan materi ajar lengkap dengan aktivitas siswa.', icon:BookOpen, color:'text-blue-400 bg-blue-500/20 border border-blue-500/30'},
  {id:'analisis_cp', title:'Analisis CP (TP & ATP)', desc:'Pemetaan Tujuan Pembelajaran dan Alur Tujuan Pembelajaran dari CP.', icon:Map, color:'text-cyan-400 bg-cyan-500/20 border border-cyan-500/30'},
  {id:'kokurikuler', title:'Modul Projek Kokurikuler', desc:'Penyusunan modul projek penguatan profil pelajar Pancasila (P5).', icon:Rocket, color:'text-indigo-400 bg-indigo-500/20 border border-indigo-500/30'},
  {id:'rpl', title:'Rencana Pelaksanaan Layanan', desc:'Penyusunan RPL Bimbingan dan Konseling yang terstruktur.', icon:Heart, color:'text-rose-400 bg-rose-500/20 border border-rose-500/30'},
  {id:'jobsheet', title:'Job Sheet Praktik', desc:'Lembar kerja praktik kejuruan lengkap dengan pedoman K3.', icon:Wrench, color:'text-amber-400 bg-amber-500/20 border border-amber-500/30'},
  {id:'lkpd', title:'LKPD Siswa', desc:'Lembar Kerja Peserta Didik interaktif beserta kunci jawaban.', icon:ClipboardList, color:'text-orange-400 bg-orange-500/20 border border-orange-500/30'},
  {id:'slide', title:'Slide Presentasi', desc:'Susunan materi presentasi kelas yang ringkas dan interaktif.', icon:Monitor, color:'text-purple-400 bg-purple-500/20 border border-purple-500/30'}
];

// --- IMAGE COMPRESSION HELPER ---
const compressImage = (file, maxWidth = 600, quality = 0.5) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
};

// --- MARKDOWN RENDERER ---
const renderMarkdown = (text) => {
  if (!text) return "";
  let lines = text.split('\n');
  let htmlOutput = [];
  let inTable = false;
  let tableRows = [];
  
  const processBasic = (str) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/### (.*?)$/gm, '<h3 class="text-lg font-bold mt-6 mb-3 border-b pb-2">$1</h3>')
      .replace(/## (.*?)$/gm, '<h2 class="text-xl font-black mt-8 mb-4 border-b-2 pb-2">$1</h2>')
      .replace(/# (.*?)$/gm, '<h1 class="text-2xl font-black mt-8 mb-6 uppercase text-center">$1</h1>');
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (!inTable) inTable = true;
      if (!trimmed.includes('---')) {
        const cells = trimmed.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
        tableRows.push(cells);
      }
    } else {
      if (inTable) {
        let tableHtml = '<div class="my-6 overflow-x-auto rounded-xl"><table class="w-full border-collapse text-sm">';
        tableRows.forEach((row, idx) => {
          tableHtml += `<tr>`;
          row.forEach(cell => {
            const tag = idx === 0 ? 'th' : 'td';
            tableHtml += `<${tag} class="border p-3 text-left ${idx === 0 ? 'font-black uppercase text-xs bg-slate-50 text-slate-700' : 'font-medium'}">${processBasic(cell.trim())}</${tag}>`;
          });
          tableHtml += '</tr>';
        });
        tableHtml += '</table></div>';
        htmlOutput.push(tableHtml);
        inTable = false;
        tableRows = [];
      }
      if (trimmed === "") {
        htmlOutput.push('<br/>');
      } else if (trimmed.startsWith('<img') || trimmed.startsWith('<table') || trimmed.startsWith('</table') || trimmed.startsWith('<tr') || trimmed.startsWith('<td') || trimmed.startsWith('</tr') || trimmed.startsWith('</td')) {
        htmlOutput.push(line);
      } else {
        htmlOutput.push(`<p class="mb-2 leading-relaxed text-justify">${processBasic(line)}</p>`);
      }
    }
  });
  return htmlOutput.join('');
};

// --- EXPORT FUNCTIONS ---
const handleExportDoc = (title, content, options = {}) => {
  const { themeId = 'profesional', orientation = 'Portrait', paperSize = 'A4' } = options;
  const theme = COLOR_THEMES.find(t => t.id === themeId) || COLOR_THEMES[0];
  
  let width = '210mm';
  let height = '297mm'; // A4
  if (paperSize === 'F4') { width = '210mm'; height = '330mm'; }
  if (paperSize === 'Letter') { width = '8.5in'; height = '11in'; }
  if (paperSize === 'Legal') { width = '8.5in'; height = '14in'; }
  
  let sizeCss = `${width} ${height}`;
  if (orientation === 'Landscape') {
    sizeCss = `${height} ${width}`;
  }

  const renderedContent = renderMarkdown(content);
  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${title}</title>
    <style>
      @page WordSection1 {
        size: ${sizeCss};
        mso-page-orientation: ${orientation === 'Landscape' ? 'landscape' : 'portrait'};
        margin: 1in;
      }
      div.WordSection1 { page: WordSection1; }
      body { font-family: 'Times New Roman', serif; padding: 0; line-height: 1.5; color: #1e293b; background-color: #ffffff; }
      table { border-collapse: collapse; width: 100%; margin: 20px 0; border: 1px solid #${theme.titleCol}; }
      th, td { border: 1px solid #${theme.titleCol}; padding: 8px; text-align: left; font-size: 11pt; vertical-align: top; }
      th { background-color: #${theme.titleCol}; color: #ffffff; }
      h1, h2, h3, h4 { color: #${theme.titleCol}; border-color: #${theme.titleCol}; }
      h1 { text-align: center; text-transform: uppercase; font-size: 16pt; margin-bottom: 20px; }
      p { text-align: justify; }
      .no-border-table { border: none !important; margin-top: 50px; }
      .no-border-table td, .no-border-table th { border: none !important; padding: 5px; background-color: transparent !important; color: #1e293b !important; }
    </style></head><body>
      <div class="WordSection1">
        ${renderedContent}
      </div>
    </body></html>`;
  
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/\s+/g, '_')}.doc`;
  link.click();
};

const handleExportPPTX = async (title, content, themeId) => {
  try {
    if (!window.PptxGenJS) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/gh/gitbrent/PptxGenJS/dist/pptxgen.bundle.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    const pptx = new window.PptxGenJS();
    const theme = COLOR_THEMES.find(t => t.id === themeId) || COLOR_THEMES[0];
    const slidesRaw = content.split('## ').filter(s => s.trim() !== '');

    let titleSlide = pptx.addSlide();
    titleSlide.background = { color: theme.bg };
    titleSlide.addText(title.toUpperCase(), { x: 0.5, y: '35%', w: '90%', h: 1.5, fontSize: 36, bold: true, color: theme.titleCol, align: 'center' });
    titleSlide.addText("Generated by Chrisly Education AI", { x: 0.5, y: '55%', w: '90%', fontSize: 14, color: theme.bodyCol, align: 'center' });

    slidesRaw.forEach((slideText) => {
      let lines = slideText.split('\n');
      let slideTitle = lines.shift().replace(/\*/g, '').trim(); 
      let bodyText = lines.join('\n').replace(/\*\*/g, '').replace(/\*/g, '').trim();

      let slide = pptx.addSlide();
      slide.background = { color: theme.bg };
      slide.addText(slideTitle, { x: 0.5, y: 0.5, w: '90%', h: 0.8, fontSize: 32, bold: true, color: theme.titleCol });
      slide.addText(bodyText, { x: 0.5, y: 1.5, w: '90%', h: 3.5, fontSize: 18, color: theme.bodyCol, align: 'left', valign: 'top' });
    });

    pptx.writeFile({ fileName: `${title.replace(/\s+/g, '_')}.pptx` });
  } catch (error) {
    console.error(error);
    alert("Gagal membuat PowerPoint. Pastikan koneksi internet stabil.");
  }
};

const handleExportExcel = (title, content) => {
  const renderedContent = renderMarkdown(content);
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1pt solid black; padding: 5px; text-align: left; vertical-align: top; }
        th { background-color: #e2e8f0; font-weight: bold; }
        h1, h2, h3, p { margin-bottom: 10px; }
      </style>
    </head>
    <body>
      ${renderedContent}
    </body>
  </html>`;
  
  const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/\s+/g, '_')}.xls`;
  link.click();
};

const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('login'); 
  const [activeGenerator, setActiveGenerator] = useState(null);
  const [message, setMessage] = useState(null);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) checkUserRecord(u.uid);
      else setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const checkUserRecord = async (uid) => {
    const userRef = doc(db, 'artifacts', appId, 'users', uid, 'profile', 'info');
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      setUserData(data);
      setView(data.role === 'admin' ? 'admin' : 'dashboard');
    } else { setView('login'); }
    setLoading(false);
  };

  useEffect(() => {
    if (!user || !userData || userData.role === 'admin') return;
    const today = new Date().toISOString().split('T')[0];
    
    const usageRef = doc(db, 'artifacts', appId, 'public', 'data', 'usages', `${today}_${userData.username}`);
    
    return onSnapshot(usageRef, (docSnap) => {
      if (docSnap.exists()) {
        setUsageCount(docSnap.data().count || 0);
      } else {
        setUsageCount(0);
      }
    }, (err) => console.error("Usage monitoring error:", err));
  }, [user, userData, appId]);

  const handleLogin = async (username) => {
    setLoading(true);
    setMessage(null);
    const registryRef = collection(db, 'artifacts', appId, 'public', 'data', 'registry');
    const snap = await getDocs(registryRef);
    const foundDoc = snap.docs.find(d => d.data().username === username);

    if (foundDoc) {
      const registryData = foundDoc.data();
      const data = { ...registryData, role: 'guru' };
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'info'), data);
      setUserData(data);
      setView('dashboard');
    } else { 
      setMessage({ type: 'error', text: 'ID Akses tidak ditemukan.' }); 
    }
    setLoading(false);
  };

  const loginAsAdmin = async (userIn, passIn, setAdminError) => {
    setAdminError("");
    if (userIn === ADMIN_CREDENTIALS.username && passIn === ADMIN_CREDENTIALS.password) {
      setLoading(true);
      const adminData = { role: 'admin', name: 'Administrator Utama', username: 'admin', sekolah: 'Pusat Chrisly Education', plan: 'ultra' };
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'info'), adminData);
      setUserData(adminData);
      setView('admin');
      setIsAdminAuthModalOpen(false);
      setLoading(false);
    } else {
      setAdminError("Kredensial Admin Salah!");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#003366]">
      <Loader2 className="w-10 h-10 text-[#FF8C00] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#003366] to-black text-white font-sans">
      <style>{`
        /* Konfigurasi agar warna tema HANYA diterapkan pada Judul dan Tabel */
        .theme-wrapper { background-color: #ffffff; color: #1e293b; }
        .theme-wrapper p, .theme-wrapper li, .theme-wrapper strong, .theme-wrapper em { color: #1e293b !important; }
        
        .theme-wrapper h1, .theme-wrapper h2, .theme-wrapper h3, .theme-wrapper h4 {
          color: var(--theme-title) !important;
          border-color: var(--theme-title) !important;
        }
        .theme-wrapper table, .theme-wrapper th, .theme-wrapper td {
          border-color: var(--theme-title) !important;
        }
        .theme-wrapper th {
          background-color: var(--theme-title) !important;
          color: #ffffff !important;
        }
      `}</style>
      
      {view === 'login' ? (
        <LoginScreen onLogin={handleLogin} onAdminClick={() => setIsAdminAuthModalOpen(true)} message={message} />
      ) : (
        <div className="flex h-screen overflow-hidden relative">
          
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
          )}

          <Sidebar 
            role={userData?.role} 
            activeView={view} 
            setView={(v) => { setView(v); setIsSidebarOpen(false); }} 
            activeGenerator={activeGenerator}
            setActiveGenerator={(id) => { setActiveGenerator(id); setIsSidebarOpen(false); }}
            onLogout={() => { setView('login'); setUserData(null); }} 
            userName={userData?.name} 
            plan={userData?.plan}
            isOpen={isSidebarOpen} 
          />
          
          <main className="flex-1 overflow-y-auto w-full transition-all duration-300 flex flex-col relative">
            <header className="sticky top-0 z-40 bg-[#003366]/95 backdrop-blur-md border-b border-blue-900/80 px-4 py-4 md:px-8 md:py-5 flex justify-between items-center shadow-2xl">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                  className="p-2.5 bg-[#0F172A] rounded-xl shadow-sm border border-blue-500/30 text-slate-300 hover:border-[#FF8C00] hover:text-[#FF8C00] transition-colors"
                >
                  <Menu size={20} />
                </button>
                <div>
                  <h1 className="text-xl font-black text-white tracking-tight uppercase">
                    {view === 'dashboard' && 'Beranda Guru'}
                    {(view === 'admin' || view === 'admin_gallery') && 'Panel Kontrol Admin'}
                    {view === 'generator' && `Buat ${activeGenerator === 'rpm' ? 'RENCANA PEMBELAJARAN MENDALAM' : activeGenerator === 'rpl' ? 'RENCANA PELAKSANAAN LAYANAN' : activeGenerator === 'jobsheet' ? 'JOB SHEET PRAKTIK' : activeGenerator === 'kokurikuler' ? 'MODUL PROJEK KOKURIKULER' : activeGenerator === 'analisis_cp' ? 'ANALISIS CP (TP & ATP)' : activeGenerator === 'modul' ? 'RENCANA PELAKSANAAN PEMBELAJARAN' : activeGenerator?.toUpperCase()}`}
                    {view === 'myDocs' && 'Arsip Digital'}
                  </h1>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{userData?.sekolah}</p>
                </div>
              </div>

              {userData?.role !== 'admin' && (
                <div className={`hidden md:flex items-center gap-4 bg-[#0F172A] px-5 py-3 rounded-2xl border shadow-sm transition-all ${usageCount >= (PLANS[userData?.plan || 'plus']?.limit || 5) ? 'border-red-500/50 bg-red-900/30' : 'border-blue-500/30'}`}>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Kuota Harian</p>
                    <p className={`text-xs font-black ${usageCount >= (PLANS[userData?.plan || 'plus']?.limit || 5) ? 'text-red-400' : 'text-white'}`}>
                      {usageCount} / {(PLANS[userData?.plan || 'plus']?.limit || 5) === Infinity ? '∞' : (PLANS[userData?.plan || 'plus']?.limit || 5)} Dokumen
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${PLANS[userData?.plan || 'plus']?.color || 'bg-[#003366] text-[#FF8C00] border border-blue-500/30'}`}>
                    <Target size={18}/>
                  </div>
                </div>
              )}
            </header>

            <div className="p-4 md:p-8 flex-1 flex flex-col">
              {view === 'dashboard' && <DashboardHome setView={setView} setActiveGenerator={setActiveGenerator} setIsSidebarOpen={setIsSidebarOpen} />}
              {view === 'admin' && <AdminPanel appId={appId} />}
              {view === 'admin_gallery' && <AdminGallery />}
              {view === 'generator' && (
                <Generator 
                  type={activeGenerator} 
                  user={user} 
                  appId={appId} 
                  userData={userData} 
                  usageCount={usageCount} 
                  onSuccess={() => setView('myDocs')} 
                />
              )}
              {view === 'myDocs' && <MyDocuments user={user} appId={appId} userData={userData} />}

              {/* DASHBOARD FOOTER */}
              <footer className="mt-auto pt-12 pb-6 border-t border-blue-900/50 text-center">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">&copy; {new Date().getFullYear()} Chrisly Education. Hak Cipta Dilindungi.</p>
              </footer>
            </div>
          </main>
        </div>
      )}

      {isAdminAuthModalOpen && (
        <AdminLoginModal onClose={() => setIsAdminAuthModalOpen(false)} onLogin={loginAsAdmin} />
      )}
    </div>
  );
};

const AdminLoginModal = ({ onClose, onLogin }) => {
  const [adminError, setAdminError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(e.target.admUser.value, e.target.admPass.value, setAdminError);
  };

  return (
    <div className="fixed inset-0 bg-[#003366]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[#0F172A] w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 border border-blue-500/30">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#003366] text-[#FF8C00] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30"><Lock size={20}/></div>
          <h2 className="text-lg font-black uppercase tracking-tighter text-white">Otentikasi Admin</h2>
        </div>
        {adminError && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-xl text-xs font-bold border border-red-500/30 flex items-center gap-2">
            <AlertCircle size={14} /> {adminError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="admUser" className="w-full px-6 py-4 rounded-2xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-[#FF8C00] font-bold text-sm text-white placeholder-slate-500" placeholder="Username Admin" required />
          <input name="admPass" type="password" className="w-full px-6 py-4 rounded-2xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-[#FF8C00] font-bold text-sm text-white placeholder-slate-500" placeholder="Password Admin" required />
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-transparent border border-slate-600 text-slate-400 font-black rounded-2xl text-[10px] uppercase hover:bg-slate-800 transition-colors">Batal</button>
            <button type="submit" className="flex-1 py-4 bg-[#FF8C00] hover:bg-[#FFA726] text-white font-black rounded-2xl text-[10px] uppercase shadow-[0_0_15px_rgba(255,140,0,0.4)] transition-colors">Masuk</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- LOGIN & LANDING PAGE TAMPILAN BARU (TEMA: THE TECH PROFESSIONAL) ---
const LoginScreen = ({ onLogin, onAdminClick, message }) => {
  const [username, setUsername] = useState('');
  const [landingView, setLandingView] = useState('home');
  const [demoType, setDemoType] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    if (landingView === 'galery') {
      const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'gallery'));
      const unsubscribe = onSnapshot(q, (snap) => {
        setGalleryItems(snap.docs.map(d => ({id: d.id, ...d.data()})));
      });
      return () => unsubscribe();
    }
  }, [landingView]);
  
  const handleWhatsAppClick = () => {
    const waNumber = '6282269623248';
    const text = encodeURIComponent('Halo Admin Chrisly Education, saya ingin mendaftar akun baru.');
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* NAVBAR / HEADER */}
      <nav className="w-full bg-[#003366]/90 backdrop-blur-sm border-b border-blue-900/50 px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg shadow-[#000000]/20">
        <div className="flex items-center gap-3 text-[#FF8C00]">
          <div className="p-2 bg-[#FF8C00] text-white rounded-lg flex items-center justify-center overflow-hidden"><AppLogo size={20} /></div>
          <span className="font-black text-lg tracking-tighter text-white uppercase">Chrisly Edu</span>
        </div>
        <div className="flex gap-4 md:gap-6 items-center">
          <button onClick={() => {setLandingView('home'); setDemoType(null);}} className={`text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors ${landingView === 'home' ? 'text-[#FF8C00]' : 'text-slate-300 hover:text-[#FF8C00]'}`}>Home</button>
          <button onClick={() => {setLandingView('galery'); setDemoType(null);}} className={`text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors ${landingView === 'galery' ? 'text-[#FF8C00]' : 'text-slate-300 hover:text-[#FF8C00]'}`}>Galeri</button>
          <button onClick={() => {setLandingView('kontak'); setDemoType(null);}} className={`text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors ${landingView === 'kontak' ? 'text-[#FF8C00]' : 'text-slate-300 hover:text-[#FF8C00]'}`}>Kontak</button>
          <button onClick={() => {setLandingView('login'); setDemoType(null);}} className="bg-[#FF8C00] text-white px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-[#FFA726] transition-colors shadow-[0_0_10px_rgba(255,140,0,0.5)]">Login</button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className={`flex-1 flex justify-center p-4 md:p-8 ${demoType ? 'items-start' : 'items-center'}`}>
        
        {/* VIEW: HOME (Landing Page Default) */}
        {landingView === 'home' && !demoType && (
          <div className="w-full max-w-5xl text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-24 h-24 bg-[#0F172A] border border-blue-500/30 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-[#FF8C00] shadow-[0_0_20px_rgba(59,130,246,0.3)] overflow-hidden"><AppLogo size={48}/></div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-tight">Masa Depan<br/><span className="text-[#3B82F6]">Pendidikan Digital</span></h1>
            <p className="text-slate-300 text-sm md:text-base font-medium max-w-xl mx-auto mb-10 leading-relaxed">Chrisly Education adalah asisten AI cerdas yang dirancang khusus untuk membantu pendidik menyusun Rencana Pembelajaran, Analisis CP, Job Sheet Praktik, Modul Projek Kokurikuler, RPL BK, dan LKPD secara otomatis, mendetail, dan siap pakai.</p>
            <button onClick={() => setLandingView('login')} className="bg-[#FF8C00] text-white font-black py-4 px-8 rounded-2xl uppercase text-xs tracking-widest inline-flex items-center justify-center gap-2 hover:bg-[#FFA726] transition-all shadow-[0_0_15px_rgba(255,140,0,0.4)] active:scale-95 mb-16 border border-[#FF8C00]">
              Masuk / Daftar Akun <ChevronRight size={16}/>
            </button>

            <div className="text-left mt-8 border-t border-blue-900/50 pt-10">
              <h2 className="text-xl font-black uppercase tracking-tighter text-white mb-6 flex items-center justify-center gap-3"><Target className="text-[#FF8C00]"/> Coba Mode Demonstrasi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {GENERATOR_TOOLS.map(item => (
                  <div key={item.id} onClick={() => setDemoType(item.id)} className="bg-[#1E3A8A]/40 backdrop-blur-md p-5 rounded-[2rem] border border-blue-500/30 hover:border-[#FF8C00] hover:shadow-[0_0_15px_rgba(255,140,0,0.4)] transition-all cursor-pointer group text-left">
                    <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-md`}><item.icon size={20}/></div>
                    <h3 className="font-black text-slate-100 text-sm mb-1 leading-tight">{item.title}</h3>
                    <p className="text-slate-300 text-[9px] leading-relaxed font-medium line-clamp-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: HOME (Demo Generator Mode) */}
        {landingView === 'home' && demoType && (
          <div className="w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => setDemoType(null)} className="mb-6 px-4 py-2 bg-[#0F172A] rounded-xl shadow-sm border border-blue-500/30 text-[10px] font-black uppercase text-slate-300 flex items-center gap-2 hover:text-[#FF8C00] hover:border-[#FF8C00] transition-colors w-fit">
              <ChevronLeft size={16}/> Kembali ke Beranda
            </button>
            <Generator 
              type={demoType} 
              isDemo={true} 
              userData={{name: 'Guru Demo', sekolah: 'Sekolah Contoh', plan: 'ultra'}} 
              usageCount={0}
              onSuccess={() => {}} 
            />
          </div>
        )}

        {/* VIEW: LOGIN (Formulir Login yang dipindahkan) */}
        {landingView === 'login' && (
          <div className="w-full max-w-md bg-[#0F172A] rounded-[2.5rem] shadow-[0_0_30px_rgba(0,51,102,0.5)] border border-blue-500/30 p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-[#003366] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#FF8C00] shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-blue-500/30 overflow-hidden"><AppLogo size={32}/></div>
              <h1 className="text-2xl font-black uppercase tracking-tighter text-white">Chrisly Education</h1>
              <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Digital teaching Assistant</p>
            </div>
            {message && message.text && (
              <div className="p-4 bg-red-900/50 text-red-300 rounded-2xl text-xs font-bold mb-6 border border-red-500/30 flex items-center gap-2">
                <AlertCircle size={14}/> {message.text}
              </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); onLogin(username); }} className="space-y-4">
              <input className="w-full px-6 py-4 rounded-2xl bg-slate-900 border border-slate-700 outline-none focus:ring-2 focus:ring-[#FF8C00] font-bold text-white placeholder-slate-500" placeholder="ID Akses Guru" value={username} onChange={(e)=>setUsername(e.target.value)} required />
              <button type="submit" className="w-full bg-[#FF8C00] text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-transform hover:bg-[#FFA726] shadow-[0_0_15px_rgba(255,140,0,0.4)] active:scale-95">Masuk Panel Kontrol <ChevronRight size={16}/></button>
              
              <button type="button" onClick={handleWhatsAppClick} className="w-full bg-emerald-500 text-white hover:bg-emerald-600 font-black py-4 rounded-2xl uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <MessageCircle size={16}/> Daftar Akun via WA
              </button>
            </form>
            <button onClick={onAdminClick} className="mt-8 w-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#FF8C00] transition-colors">Admin Access</button>
          </div>
        )}

        {/* VIEW: GALERI */}
        {landingView === 'galery' && (
          <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Galeri Kegiatan</h2>
              <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Dokumentasi & Portofolio</p>
            </div>
            {galleryItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                  <div key={item.id} className="bg-[#0F172A] rounded-[2rem] p-4 shadow-sm border border-blue-500/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:border-[#3B82F6] transition-all group">
                    <div className="w-full h-48 bg-slate-900 rounded-[1.5rem] flex items-center justify-center mb-4 transition-colors overflow-hidden border border-slate-800">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={32} className="text-slate-600 group-hover:text-[#FF8C00] transition-colors" />
                      )}
                    </div>
                    <h3 className="font-black text-white text-sm px-2 uppercase">{item.title}</h3>
                    <p className="text-slate-400 text-[10px] font-bold px-2 mt-1 uppercase">{item.desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full py-24 text-center bg-[#0F172A]/50 rounded-[2.5rem] border border-dashed border-blue-500/30 shadow-sm">
                 <ImageIcon size={48} className="mx-auto mb-4 text-slate-600" />
                 <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Belum ada dokumentasi kegiatan</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW: KONTAK */}
        {landingView === 'kontak' && (
          <div className="w-full max-w-md bg-[#0F172A] rounded-[2.5rem] shadow-[0_0_30px_rgba(0,51,102,0.5)] border border-blue-500/30 p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-[#003366] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#FF8C00] shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-blue-500/30"><MessageCircle size={32}/></div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Hubungi Kami</h2>
              <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Layanan Bantuan & Pendaftaran</p>
            </div>
            <div className="space-y-4">
              <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#003366] rounded-xl shadow-sm flex items-center justify-center text-[#FF8C00] shrink-0 border border-blue-500/30"><MessageCircle size={20}/></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp Admin</p>
                  <p className="font-bold text-white text-sm">+62 822-6962-3248</p>
                </div>
              </div>
              <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#003366] rounded-xl shadow-sm flex items-center justify-center text-[#FF8C00] shrink-0 border border-blue-500/30"><Target size={20}/></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lokasi</p>
                  <p className="font-bold text-white text-sm">Indonesia</p>
                </div>
              </div>
            </div>
            <button onClick={handleWhatsAppClick} className="w-full mt-8 bg-[#FF8C00] text-white hover:bg-[#FFA726] font-black py-4 rounded-2xl uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_0_15px_rgba(255,140,0,0.4)]">
              Chat via WhatsApp
            </button>
          </div>
        )}

      </div>

      {/* LANDING PAGE FOOTER */}
      <footer className="w-full bg-[#003366] border-t border-blue-800/50 px-6 md:px-12 py-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 text-[#FF8C00]">
            <div className="p-1.5 bg-[#FF8C00] text-white rounded-lg flex items-center justify-center overflow-hidden"><AppLogo size={16} /></div>
            <span className="font-black text-sm tracking-tighter text-white uppercase">Chrisly Edu</span>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center md:text-left">
            &copy; {new Date().getFullYear()} Chrisly Education. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
};

const Sidebar = ({ role, activeView, setView, activeGenerator, setActiveGenerator, onLogout, userName, plan, isOpen }) => (
  <aside className={`fixed md:relative z-50 h-full bg-[#003366]/90 backdrop-blur-md border-r border-blue-900/50 flex flex-col transition-all duration-300 shrink-0 ${isOpen ? 'w-64 p-6 translate-x-0' : 'w-0 p-0 -translate-x-full overflow-hidden opacity-0'}`}>
    <div className="w-52 flex flex-col h-full">
      <div className="flex items-center gap-3 text-[#FF8C00] mb-10 px-4">
        <div className="p-2 bg-[#FF8C00] text-white rounded-lg flex items-center justify-center overflow-hidden"><AppLogo size={20} /></div>
        <span className="font-black text-lg tracking-tighter text-white uppercase">Chrisly Edu</span>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide pb-4">
        {(role === 'admin' ? [{id:'admin', label:'Data Pendidik', icon:Users}, {id:'admin_gallery', label:'Kelola Galeri', icon:ImageIcon}] : [{id:'dashboard', label:'Beranda', icon:LayoutDashboard}, {id:'myDocs', label:'Arsip Digital', icon:FileText}]).map(item => (
          <button key={item.id} onClick={()=>setView(item.id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeView === item.id ? 'bg-[#FF8C00] text-white shadow-[0_0_10px_rgba(255,140,0,0.5)]' : 'text-slate-300 hover:bg-[#0F172A]/50 hover:text-[#FF8C00]'}`}>
            <item.icon size={16}/> {item.label}
          </button>
        ))}

        {role !== 'admin' && (
          <>
            <div className="pt-6 pb-2 px-6">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Alat Generator</p>
            </div>
            {GENERATOR_TOOLS.map(tool => (
              <button key={tool.id} onClick={() => { setActiveGenerator(tool.id); setView('generator'); }} className={`w-full flex items-center gap-4 px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all ${(activeView === 'generator' && activeGenerator === tool.id) ? 'bg-[#0F172A] text-[#FF8C00] border border-[#FF8C00]/30 shadow-[0_0_10px_rgba(255,140,0,0.2)]' : 'text-slate-400 hover:bg-[#0F172A]/50 hover:text-[#FF8C00] border border-transparent'}`}>
                <tool.icon size={14}/> {tool.id === 'rpm' ? 'RPM' : tool.id === 'modul' ? 'RPP' : tool.id === 'analisis_cp' ? 'Analisis CP' : tool.id === 'kokurikuler' ? 'Modul P5' : tool.id === 'rpl' ? 'RPL BK' : tool.id === 'jobsheet' ? 'Job Sheet' : tool.id === 'lkpd' ? 'LKPD' : 'Slide'}
              </button>
            ))}
          </>
        )}
      </nav>
      <div className="p-4 bg-[#0F172A] border border-blue-500/30 rounded-2xl mt-4 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] font-black text-slate-400 uppercase">Akun Aktif</p>
          {plan && (
            <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase border ${PLANS[plan]?.color || 'bg-slate-800 text-slate-400'} ${PLANS[plan]?.border || 'border-slate-700'}`}>
              {PLANS[plan]?.label || 'Plus'}
            </span>
          )}
        </div>
        <p className="text-[11px] font-black text-white truncate uppercase">{userName}</p>
        <button onClick={onLogout} className="flex items-center gap-2 mt-4 text-red-500 font-black text-[9px] uppercase tracking-widest hover:text-red-700 transition-colors"><LogOut size={14}/> Keluar</button>
      </div>
    </div>
  </aside>
);

const DashboardHome = ({ setView, setActiveGenerator, setIsSidebarOpen }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {GENERATOR_TOOLS.map(item => (
      <div key={item.id} onClick={()=>{setActiveGenerator(item.id); setView('generator'); setIsSidebarOpen(false);}} className="bg-[#1E3A8A]/40 backdrop-blur-md p-6 lg:p-8 rounded-[2.5rem] border border-blue-500/30 shadow-sm hover:shadow-[0_0_20px_rgba(255,140,0,0.3)] hover:border-[#FF8C00] hover:-translate-y-1 transition-all cursor-pointer group">
        <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-6 shadow-lg`}><item.icon size={28}/></div>
        <h3 className="font-black text-slate-100 text-lg mb-2 leading-tight">{item.title}</h3>
        <p className="text-slate-300 text-xs leading-relaxed font-medium">{item.desc}</p>
        <div className="mt-6 flex items-center text-[10px] font-black text-[#FF8C00] uppercase tracking-widest">Mulai Susun <ChevronRight size={14} /></div>
      </div>
    ))}
  </div>
);

const Generator = ({ type, user, appId, userData, usageCount, onSuccess, isDemo = false }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [mode, setMode] = useState('preview'); 
  const [limitError, setLimitError] = useState(false);
  const [formError, setFormError] = useState("");
  
  const [form, setForm] = useState({
    namaGuru: userData?.name || '',
    namaSekolah: userData?.sekolah || '',
    mapel: '', 
    fase: 'D', 
    kelas: '7', 
    menitPerJP: '40', 
    jumlahJP: '2',
    jumlahPertemuan: '1',
    jumlahSlide: '5',
    temaDokumen: 'profesional', 
    gayaBahasa: 'Formal & Akademis', 
    cp: '', 
    tujuan: '', 
    materi: '', 
    modelPembelajaran: 'Problem Based Learning (PBL)',
    statusPG: true,
    statusEsai: true,
    jumlahPG: '5',
    opsiPG: 'A - D', 
    jumlahEsai: '3',
    jenjang: 'SMP',
    semester: 'Ganjil',
    profilPelajar: { beriman: true, berkebinekaan: false, gotongRoyong: false, mandiri: false, bernalarKritis: true, kreatif: false },
    logoSekolah: '',
    orientasi: 'Portrait',
    ukuranKertas: 'A4',
    namaKepsek: '',
    nipKepsek: '',
    nipGuru: '',
    komponenLayanan: 'Layanan Dasar',
    bidangLayanan: 'Pribadi',
    fungsiLayanan: 'Pemahaman',
    narasiCP: '',
    elemenCP: '',
    tingkatKognitif: 'C1-C3 (LOTS/MOTS)'
  });

  // FIX: Reset result and states when generator type changes
  useEffect(() => {
    setResult("");
    setMode('preview');
    setFormError("");
    setLimitError(false);
  }, [type]);

  const checkPlanValidity = () => {
    if (isDemo) return true; 
    const plan = userData?.plan || 'plus';
    const limit = PLANS[plan]?.limit || 5;
    return usageCount < limit;
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressedBase64 = await compressImage(file, 200, 0.5);
      setForm({...form, logoSekolah: compressedBase64});
    }
  };

  const generateAI = async () => {
    setFormError("");
    setLimitError(false);

    if (!checkPlanValidity()) {
      setLimitError(true);
      return;
    }
    
    if (type === 'analisis_cp' && (!form.mapel || !form.narasiCP)) {
      setFormError("Mohon lengkapi Mapel dan Narasi CP.");
      return;
    } else if (type !== 'analisis_cp' && (!form.mapel || !form.tujuan)) {
      setFormError("Mohon lengkapi data identitas, mata pelajaran/topik, dan tujuan.");
      return;
    }

    if (type === 'lkpd' && !form.statusPG && !form.statusEsai) {
      setFormError("Aktifkan minimal satu jenis soal (Pilihan Ganda atau Esai).");
      return;
    }

    setIsGenerating(true);
    setMode('preview');
    setResult("Memulai proses AI... Mohon tunggu sebentar...");
    
    const totalMenit = parseInt(form.jumlahJP || 0) * parseInt(form.menitPerJP || 0);
    const textAlokasiWaktu = `${form.jumlahPertemuan} Pertemuan (Alokasi per pertemuan: ${form.jumlahJP} JP x ${form.menitPerJP} Menit = ${totalMenit} Menit)`;
    
    const instruksiProporsional = `SANGAT PENTING: Karena ini dirancang untuk ${form.jumlahPertemuan} pertemuan, Anda WAJIB membagi "Tujuan Pembelajaran" dan "Langkah Kegiatan/Skenario" secara proporsional untuk tiap pertemuan. SETIAP pertemuan harus dibuatkan tabel kegiatan yang terpisah, dan total waktu pada masing-masing tabel pertemuan tersebut WAJIB berjumlah persis ${totalMenit} menit (gabungan dari waktu pendahuluan, inti, dan penutup).`;

    const profilAktif = Object.entries(form.profilPelajar).filter(([k,v]) => v).map(([k]) => k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())).join(', ');
    const logoImg = form.logoSekolah ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${form.logoSekolah}" width="100" /></div>` : '';
    
    let systemPrompt = `Anda adalah seorang Master Asisten Ahli Kurikulum Merdeka dan Dosen Ahli Pendidikan yang sangat profesional. Anda bertugas menyusun dokumen ${type.toUpperCase()} dengan kualitas TERBAIK, SANGAT DETAIL, KOMPREHENSIF, dan SIAP PAKAI tanpa perlu banyak revisi oleh guru. Dilarang keras meringkas, melewati bagian penting, atau menggunakan kata-kata seperti 'dan seterusnya' atau 'dll'. Semua poin harus dijabarkan dengan mendalam, berbobot, dan menggunakan Bahasa Indonesia baku yang akademis namun praktis. `;
    
    if (type === 'slide') {
      systemPrompt += `WAJIB gunakan struktur teks berpoin. Judul slide WAJIB diawali dengan double hashtag (## Judul Slide). Berikan teknik penceritaan (storytelling) yang kuat di materi.`;
    } else if (type === 'rpm' || type === 'modul' || type === 'rpl' || type === 'jobsheet' || type === 'kokurikuler' || type === 'analisis_cp') {
      systemPrompt += `Dokumen ini adalah ${type === 'rpm' ? 'Rencana Pembelajaran Mendalam (RPM)' : type === 'rpl' ? 'Rencana Pelaksanaan Layanan (RPL)' : type === 'jobsheet' ? 'Job Sheet (Lembar Kerja Praktik)' : type === 'kokurikuler' ? 'Modul Projek Kokurikuler (P5)' : type === 'analisis_cp' ? 'Analisis Capaian Pembelajaran (TP & ATP)' : 'Rencana Pelaksanaan Pembelajaran (RPP)'}. WAJIB menggunakan format Markdown yang rapi. Gunakan tag HTML <table> tanpa border untuk bagian pengesahan tanda tangan di akhir agar rapi. Pastikan semua tabel yang dibuat panjang, detail, dan tidak terpotong.`;
    } else {
      systemPrompt += `WAJIB menggunakan format TABEL MARKDOWN yang rapi untuk bagian isi. Bahasa Indonesia formal.`;
    }
    
    let userPrompt = "";
    if (type === 'analisis_cp') {
      userPrompt = `Lakukan Analisis Capaian Pembelajaran (CP) untuk merumuskan Tujuan Pembelajaran (TP) dan Alur Tujuan Pembelajaran (ATP).

      Identitas:
      - Mata Pelajaran: ${form.mapel}
      - Fase / Jenjang: Fase ${form.fase} / ${form.jenjang}
      - Tingkat Kognitif Target: ${form.tingkatKognitif}
      - Dimensi Profil Pelajar Pancasila: ${profilAktif || '-'}

      Narasi Capaian Pembelajaran (CP):
      "${form.narasiCP}"

      Tugas Anda:
      1. Ekstraksi Kompetensi (Kata Kerja Operasional / KKO) dan Lingkup Materi (Konten Inti) dari narasi CP di atas.
      2. Rumuskan Tujuan Pembelajaran (TP) yang memadukan kompetensi dan materi tersebut, disesuaikan dengan tingkat kognitif target. Sisipkan indikator Profil Pelajar Pancasila yang relevan.
      3. Tentukan urutan Alur Tujuan Pembelajaran (ATP) dari TP yang dihasilkan (berdasarkan hirarki pengajaran dari materi yang paling dasar hingga kompleks) dan susun ke dalam kolom tabel.

      STRUKTUR OUTPUT WAJIB (Gunakan Markdown yang rapi):
      ${logoImg}
      # ANALISIS CAPAIAN PEMBELAJARAN (TP & ATP)

      ## 1. Identitas
      [Buat tabel Identitas: Mata Pelajaran, Fase/Jenjang, Tingkat Kognitif Target]

      ## 2. Narasi Capaian Pembelajaran (CP)
      > *${form.narasiCP}*

      ## 3. Pemetaan & Alur Tujuan Pembelajaran (TP & ATP)
      [PENTING: Buat tabel dengan header persis seperti ini: | No | Kompetensi (KKO) | Lingkup Materi (Konten) | Rumusan Tujuan Pembelajaran (TP) | Kode TP | Profil Pelajar Pancasila | Alur (ATP) |]
      [Isi tabel dengan hasil ekstraksi dan perumusan TP. Gunakan format Kode TP berurutan, misal TP.1, TP.2, dst. Pada kolom 'Alur (ATP)', tuliskan tahapan urutan logis pengajarannya (contoh: "Tahap 1", "Tahap 2", dst. disertai penjelasan singkat mengapa tahapan ini diajarkan lebih dulu/belakangan).]

      ## Pengesahan
      <br/><br/>
      <table class="no-border-table" style="width:100%; text-align:center;">
        <tr>
          <td style="width:50%;">Mengetahui,<br/>Kepala Sekolah</td>
          <td style="width:50%;">Guru Mata Pelajaran</td>
        </tr>
        <tr>
          <td style="height:80px;"></td>
          <td></td>
        </tr>
        <tr>
          <td><strong>${form.namaKepsek || '[Nama Kepala Sekolah]'}</strong><br/>NIP. ${form.nipKepsek || '.......................'}</td>
          <td><strong>${form.namaGuru || '[Nama Guru]'}</strong><br/>NIP. ${form.nipGuru || '.......................'}</td>
        </tr>
      </table>`;
    } else if (type === 'lkpd') {
      let soalInstruction = "";
      if (form.statusPG) soalInstruction += `- Buatkan ${form.jumlahPG} soal Pilihan Ganda (PG) dengan format opsi jawaban dari ${form.opsiPG}. \n`;
      if (form.statusEsai) soalInstruction += `- Buatkan ${form.jumlahEsai} soal Esai/Uraian yang mendalam.\n`;

      userPrompt = `Buat LKPD (Lembar Kerja Peserta Didik) dengan level kognitif HOTS (Higher Order Thinking Skills).
      Identitas:
      - Nama Guru: ${form.namaGuru}
      - Sekolah: ${form.namaSekolah}
      - Mapel: ${form.mapel}
      - Kelas/Fase: ${form.kelas} / ${form.fase}
      - Topik: ${form.materi}
      - Tujuan: ${form.tujuan}

      Instruksi Soal:
      ${soalInstruction}
      - Soal harus berupa kasus nyata, studi literatur, atau pemecahan masalah yang merangsang nalar kritis siswa (HOTS).
      - Jangan menggunakan simbol aneh, gunakan markdown murni.
      - WAJIB sediakan Kunci Jawaban di bagian paling akhir dokumen beserta pembahasan lengkap mengapa jawaban tersebut benar.
      - JANGAN merubah atau menjabarkan Tujuan Pembelajaran, tulis persis seperti input.`;
    } else if (type === 'slide') {
      userPrompt = `Buat draf konten untuk Slide Presentasi Pembelajaran yang memukau.
      Identitas:
      - Mapel: ${form.mapel}
      - Kelas/Fase: ${form.kelas} / ${form.fase}
      - Topik: ${form.materi}
      - Tujuan: ${form.tujuan}
      - Gaya Bahasa Penyampaian: ${form.gayaBahasa}

      Instruksi: 
      - Buatkan ${form.jumlahSlide} slide. Setiap slide harus memiliki (1) Judul Slide, (2) Poin Materi yang mudah dibaca/ringkas, (3) Catatan Pembicara (Speaker Notes) yang SANGAT DETAIL di bawah poin untuk memandu guru saat menjelaskan, berikan analogi atau contoh kasus pada catatan pembicara tersebut.
      - JANGAN merubah atau menjabarkan Tujuan Pembelajaran, tulis persis seperti input.`;
    } else if (type === 'jobsheet') {
      userPrompt = `Buat Job Sheet (Lembar Kerja Praktik) standar industri untuk mata pelajaran kejuruan secara komprehensif.

      Identitas & Spesifikasi:
      - Pelaksana/Guru: ${form.namaGuru}
      - Sekolah: ${form.namaSekolah}
      - Sasaran (Kelas/Fase): Kelas ${form.kelas} / Fase ${form.fase}
      - Semester: ${form.semester}
      - Mata Pelajaran: ${form.mapel}
      - Alokasi Waktu: ${textAlokasiWaktu}
      - Pekerjaan/Topik Praktik: ${form.materi}
      - Tujuan Praktik: ${form.tujuan}

      ${instruksiProporsional}

      STRUKTUR OUTPUT WAJIB (Gunakan Format Markdown dan Tabel agar rapi):
      ${logoImg}
      # JOB SHEET / LEMBAR KERJA PRAKTIK

      ## I. Informasi Umum
      [Buat tabel: Mata Pelajaran, Topik Praktik, Kelas/Semester, Alokasi Waktu, Nama Instruktur, Tujuan Praktik (Tulis mentah: ${form.tujuan})]

      ## II. Tujuan Praktik
      ${form.tujuan} (Tuliskan persis seperti ini, JANGAN dijabarkan/diuraikan lagi)

      ## III. Keselamatan dan Kesehatan Kerja (K3)
      [Uraikan pedoman K3 yang SANGAT SPESIFIK dan sesuai dengan prosedur standar pada materi ${form.materi}, jangan gunakan K3 umum, jelaskan detail alat pelindung diri (APD) yang wajib dipakai.]

      ## IV. Alat dan Bahan
      [Buat 2 tabel terpisah: Tabel Alat (Nama Alat, Spesifikasi Detail/Ukuran, Jumlah) dan Tabel Bahan (Nama Bahan, Spesifikasi Detail, Jumlah)]

      ## V. Gambar Kerja / Rangkaian (Jika relevan)
      [Berikan deskripsi naratif atau panduan penempatan skema desain/gambar teknis dari pekerjaan ini.]

      ## VI. Langkah Kerja (SOP)
      [PENTING: Jabarkan langkah kerja untuk SETIAP PERTEMUAN (Total: ${form.jumlahPertemuan} Pertemuan). Buat tabel terpisah per pertemuan berisi: No, Urutan Kerja (harus sangat detail dan tidak boleh ada yang terlewat), Instruksi Spesifik / Keterangan K3 di langkah tersebut, dan Waktu Eksekusi (taruh di kolom paling kanan dengan total persis ${totalMenit} menit per tabel)]

      ## VII. Lembar Hasil / Laporan Pengamatan
      [Buat format tabel kosong yang detail untuk panduan siswa mengambil data pengamatan teknis/hasil pengukuran/hasil kerja]

      ## VIII. Evaluasi / Tugas
      [Berikan pertanyaan evaluasi tingkat lanjut (HOTS) yang berkaitan langsung dengan proses/troubleshooting saat praktik]

      ## Pengesahan
      <br/><br/>
      <table class="no-border-table" style="width:100%; text-align:center;">
        <tr>
          <td style="width:50%;">Mengetahui,<br/>Kepala Bengkel / Sekolah</td>
          <td style="width:50%;">Instruktur / Guru Kejuruan</td>
        </tr>
        <tr>
          <td style="height:80px;"></td>
          <td></td>
        </tr>
        <tr>
          <td><strong>${form.namaKepsek || '[Nama Kepala Bengkel]'}</strong><br/>NIP. ${form.nipKepsek || '.......................'}</td>
          <td><strong>${form.namaGuru || '[Nama Guru]'}</strong><br/>NIP. ${form.nipGuru || '.......................'}</td>
        </tr>
      </table>`;
    } else if (type === 'rpl') {
      userPrompt = `Buat Rencana Pelaksanaan Layanan (RPL) Bimbingan dan Konseling tingkat mahir yang komprehensif.

      Identitas & Spesifikasi:
      - Pelaksana: ${form.namaGuru}
      - Sekolah: ${form.namaSekolah}
      - Sasaran (Kelas/Fase): Kelas ${form.kelas} / Fase ${form.fase}
      - Semester: ${form.semester}
      - Topik/Tema: ${form.mapel}
      - Alokasi Waktu: ${textAlokasiWaktu}
      - Komponen Layanan: ${form.komponenLayanan}
      - Bidang Layanan: ${form.bidangLayanan}
      - Fungsi Layanan: ${form.fungsiLayanan}
      - Metode/Strategi: ${form.modelPembelajaran}
      - Tujuan Umum & Khusus: ${form.tujuan}
      - Topik Utama Materi: ${form.materi}
      - Dimensi Profil Pelajar Pancasila: ${profilAktif || '-'}

      ${instruksiProporsional}

      STRUKTUR OUTPUT WAJIB (Gunakan Format Markdown dan Tabel agar rapi):
      ${logoImg}
      # RENCANA PELAKSANAAN LAYANAN (RPL) BIMBINGAN DAN KONSELING

      ## 1. Identitas Layanan (Administratif)
      [Buat tabel: Satuan Pendidikan, Tahun Ajaran/Semester, Sasaran, Pelaksana, Alokasi Waktu, Tujuan Layanan (Tulis mentah: ${form.tujuan})]

      ## 2. Komponen dan Bidang Layanan
      [Buat tabel: Komponen Layanan, Bidang Layanan, Fungsi Layanan]

      ## 3. Konten Utama (Substansi)
      [Buat tabel: Topik/Tema, Tujuan Umum, Tujuan Khusus (Tulis persis: ${form.tujuan}, JANGAN diuraikan/dijabarkan lagi), Materi Layanan (Rangkuman mendalam)]

      ## 4. Strategi dan Metodologi
      [Uraikan secara profesional: Metode, Media & Alat (spesifik), Sumber Materi (cantumkan referensi buku/jurnal psikologi/BK yang relevan)]

      ## 5. Skenario Kegiatan (Tahapan)
      [PENTING: Jabarkan skenario kegiatan Bimbingan dan Konseling untuk SETIAP PERTEMUAN secara mendalam (Total: ${form.jumlahPertemuan} Pertemuan). Buat tabel terpisah per pertemuan berisi: Tahap (Pendahuluan: wajib sertakan Ice Breaking/Rapport, Inti: uraikan dinamika interaksi siswa dan konselor, Penutup), Uraian Kegiatan (Jangan meringkas), dan Waktu (taruh di kolom paling kanan dengan total persis ${totalMenit} menit per tabel)]

      ## 6. Evaluasi dan Pelaporan
      [Uraikan mendalam dengan indikator yang jelas: Evaluasi Proses (Antusiasme, dinamika kelompok), Evaluasi Hasil (Pemahaman/Understanding, Perasaan Positif/Comfortable, Rencana Tindakan/Action), Tindak Lanjut]

      ## 7. Lampiran
      - Uraian Materi (Jabarkan konten materi psikologis/bimbingannya dengan sangat detail)
      - Instrumen Evaluasi (Berikan draft lembar kuesionernya)
      - Media Visual (Deskripsi media pendukung)

      ## Pengesahan
      <br/><br/>
      <table class="no-border-table" style="width:100%; text-align:center;">
        <tr>
          <td style="width:50%;">Mengetahui,<br/>Kepala Sekolah</td>
          <td style="width:50%;">Guru / Konselor</td>
        </tr>
        <tr>
          <td style="height:80px;"></td>
          <td></td>
        </tr>
        <tr>
          <td><strong>${form.namaKepsek || '[Nama Kepala Sekolah]'}</strong><br/>NIP. ${form.nipKepsek || '.......................'}</td>
          <td><strong>${form.namaGuru || '[Nama Guru]'}</strong><br/>NIP. ${form.nipGuru || '.......................'}</td>
        </tr>
      </table>`;
    } else if (type === 'kokurikuler') {
      userPrompt = `Buat Modul Projek Kokurikuler (P5) yang SANGAT DETAIL, KOMPREHENSIF, dan SIAP PAKAI. Dilarang keras menyingkat materi.

      Identitas:
      - Penyusun: ${form.namaGuru}
      - Institusi: ${form.namaSekolah}
      - Jenjang & Fase: ${form.jenjang} / Fase ${form.fase}
      - Tema Projek: ${form.mapel}
      - Judul Projek: ${form.materi}
      - Alokasi Waktu: ${textAlokasiWaktu}
      - Dimensi Profil Pelajar Pancasila: ${profilAktif || '-'}

      STRUKTUR OUTPUT WAJIB (Gunakan Markdown yang rapi):
      ${logoImg}
      # MODUL PROJEK KOKURIKULER: ${form.materi.toUpperCase()}

      ## I. Identitas & Komponen Umum
      [Buat tabel: Judul Proyek, Tema Besar, Fase/Kelas, Alokasi Waktu, Penyusun, Institusi]
      - **Target Peserta Didik:** [Reguler/Inklusi]
      - **Sarana & Prasarana:** [Daftar alat dan media spesifik yang dibutuhkan]

      ## II. Pemetaan Dimensi & Tujuan (Inti)
      [Pilih 2-3 dimensi dari: ${profilAktif || 'Beriman, Berkebinekaan, Gotong Royong, Mandiri, Bernalar Kritis, Kreatif'}]
      [Buat tabel pemetaan yang berisi: Dimensi, Elemen, Sub-Elemen, dan Target Pencapaian Fase]

      ## III. Alur Aktivitas (Langkah Kerja)
      [PENTING: Jabarkan alur proyek menjadi 4 tahap besar. Buat tabel rincian aktivitas untuk masing-masing tahap dengan alokasi waktu yang jelas (total keseluruhan sesuai ${textAlokasiWaktu})]
      1. **Tahap Pengenalan:** [Aktivitas membangun kesadaran/eksplorasi isu]
      2. **Tahap Kontekstualisasi:** [Aktivitas menghubungkan isu dengan lingkungan sekolah/sekitar]
      3. **Tahap Aksi:** [Implementasi solusi/pembuatan produk/kampanye]
      4. **Tahap Refleksi & Tindak Lanjut:** [Evaluasi keberhasilan dan rencana keberlanjutan]

      ## IV. Asesmen (Penilaian)
      [Uraikan instrumen penilaian:]
      - **Asesmen Diagnostik:** [Tes awal lisan/tertulis]
      - **Asesmen Formatif:** [Jurnal, observasi progres]
      - **Asesmen Sumatif:** [Penilaian produk akhir / Panen Hasil Belajar]

      ## V. Lampiran & Rubrik Detail
      - **Lembar Kerja Peserta Didik (LKPD):** [Panduan langkah per tahapan untuk siswa]
      - **Rubrik Pencapaian:** [Buat tabel indikator performa dengan skala: Mulai Berkembang (MB), Sedang Berkembang (SB), Berkembang Sesuai Harapan (BSH), Sangat Berkembang (SAB)]
      - **Bahan Bacaan:** [Ringkasan materi esensial terkait topik ${form.materi}]

      ## Pengesahan
      <br/><br/>
      <table class="no-border-table" style="width:100%; text-align:center;">
        <tr>
          <td style="width:50%;">Mengetahui,<br/>Kepala Sekolah</td>
          <td style="width:50%;">Koordinator / Fasilitator Projek</td>
        </tr>
        <tr>
          <td style="height:80px;"></td>
          <td></td>
        </tr>
        <tr>
          <td><strong>${form.namaKepsek || '[Nama Kepala Sekolah]'}</strong><br/>NIP. ${form.nipKepsek || '.......................'}</td>
          <td><strong>${form.namaGuru || '[Nama Guru]'}</strong><br/>NIP. ${form.nipGuru || '.......................'}</td>
        </tr>
      </table>`;
    } else if (type === 'modul') {
      userPrompt = `Buat Rencana Pelaksanaan Pembelajaran (RPP) yang SANGAT DETAIL, KOMPREHENSIF, dan SIAP PAKAI. Dilarang keras menyingkat materi.

      Identitas:
      - Penyusun: ${form.namaGuru}
      - Institusi: ${form.namaSekolah}
      - Jenjang Sekolah: ${form.jenjang}
      - Kelas & Fase: Kelas ${form.kelas} / Fase ${form.fase}
      - Semester: ${form.semester}
      - Mata Pelajaran: ${form.mapel}
      - Alokasi Waktu: ${textAlokasiWaktu} 
      - Model Pembelajaran: ${form.modelPembelajaran}
      - Target Peserta Didik: Reguler
      - Topik Pokok: ${form.materi}
      - Tujuan Pembelajaran (TP): ${form.tujuan}
      - Dimensi Profil Pelajar Pancasila: ${profilAktif || '-'}
      - Gaya Bahasa Modul: ${form.gayaBahasa}

      ${instruksiProporsional}

      STRUKTUR OUTPUT WAJIB (Gunakan Markdown yang rapi):
      ${logoImg}
      # RENCANA PELAKSANAAN PEMBELAJARAN: ${form.mapel.toUpperCase()}

      ## BAGIAN I: INFORMASI UMUM
      [Buat dalam format tabel rapi berisi Identitas Dokumen (Penyusun, Institusi, Tahun, Jenjang, Kelas/Fase, Mapel, Alokasi Waktu, Tujuan Pembelajaran (Tulis mentah: ${form.tujuan})), Kompetensi Awal/Prasyarat, Profil Pelajar Pancasila, Sarana dan Prasarana, Target Peserta Didik, dan Model Pembelajaran]

      ## BAGIAN II: KOMPONEN INTI
      **A. Tujuan Pembelajaran (TP)**
      ${form.tujuan} (Tuliskan persis seperti ini, JANGAN dijabarkan atau dipecah menjadi indikator lain)

      **B. Pemahaman Bermakna**
      [Jelaskan pesan inti esensial atau filosofi mengapa materi ini sangat penting untuk masa depan siswa (Kontekstualisasi kehidupan nyata)]

      **C. Pertanyaan Pemantik**
      [Berikan 3-5 pertanyaan pemancing rasa ingin tahu yang menantang nalar kritis (HOTS) terkait topik]

      **D. Kegiatan Pembelajaran (SANGAT DETAIL)**
      [PENTING: Jabarkan Skenario Kegiatan Guru dan Siswa untuk SETIAP PERTEMUAN (Total: ${form.jumlahPertemuan} pertemuan). Skenario harus interaktif, nyata, dan sesuai sintaks model ${form.modelPembelajaran}. Jangan diringkas! Buat tabel terpisah per pertemuan dengan kolom: Tahap Pembelajaran (Pendahuluan, Inti, Penutup), Uraian Kegiatan Guru & Siswa, dan Alokasi Waktu (kolom waktu di paling kanan dengan total durasi persis ${totalMenit} menit tiap tabel pertemuannya)]

      **E. Asesmen (Penilaian)**
      [Uraikan strategi mendalam tentang Asesmen Diagnostik (Kognitif/Non-Kognitif), Formatif (saat proses), dan Sumatif (Akhir). Sertakan teknik dan bentuk asesmennya]

      **F. Pengayaan dan Remedial**
      [Strategi konkret untuk diferensiasi siswa: siswa yang cepat paham (Pengayaan) dan siswa yang tertinggal (Remedial)]

      **G. Refleksi Guru dan Peserta Didik**
      [Daftar pertanyaan panduan refleksi diri bagi guru dan siswa setelah pembelajaran selesai]

      ## BAGIAN III: LAMPIRAN
      **A. Lembar Kerja Peserta Didik (LKPD)**
      [Tugas atau panduan aktivitas siswa singkat]

      **B. Bahan Bacaan Guru & Siswa**
      [Tuliskan jabaran materi / bahan bacaan guru secara berbobot dan informatif berdasarkan materi: ${form.materi}]

      **C. Glosarium**
      [Daftar kata/istilah teknis penting beserta definisinya]

      **D. Daftar Pustaka**
      [Sumber referensi relevan (Buku teks, website, dsb)]

      **E. Rubrik Penilaian Singkat**
      [Berikan format rubrik penilaian/kriteria penilaian kompetensi secara jelas]

      ## Pengesahan
      <br/><br/>
      <table class="no-border-table" style="width:100%; text-align:center;">
        <tr>
          <td style="width:50%;">Mengetahui,<br/>Kepala Sekolah</td>
          <td style="width:50%;">Guru Mata Pelajaran</td>
        </tr>
        <tr>
          <td style="height:80px;"></td>
          <td></td>
        </tr>
        <tr>
          <td><strong>${form.namaKepsek || '[Nama Kepala Sekolah]'}</strong><br/>NIP. ${form.nipKepsek || '.......................'}</td>
          <td><strong>${form.namaGuru || '[Nama Guru]'}</strong><br/>NIP. ${form.nipGuru || '.......................'}</td>
        </tr>
      </table>`;
    } else if (type === 'rpm') {
      userPrompt = `Buat Rencana Pembelajaran Mendalam (RPM) secara detail dan komprehensif berfokus pada "Deep Learning".
      
      Identitas & Spesifikasi:
      - Pelaksana/Guru: ${form.namaGuru}
      - Sekolah: ${form.namaSekolah}
      - Jenjang / Kelas / Fase: ${form.jenjang} / Kelas ${form.kelas} / Fase ${form.fase}
      - Semester: ${form.semester}
      - Mata Pelajaran: ${form.mapel}
      - Alokasi Waktu: ${textAlokasiWaktu} (Susun pengalaman belajar proporsional untuk ${form.jumlahPertemuan} pertemuan)
      - Model Pembelajaran: ${form.modelPembelajaran}
      - Topik Kontekstual/Materi: ${form.materi}
      - Tujuan Pembelajaran: ${form.tujuan}
      - Gaya Bahasa: ${form.gayaBahasa}
      - Dimensi Profil Lulusan Pancasila: ${profilAktif || '-'}

      ${instruksiProporsional}

      STRUKTUR OUTPUT WAJIB (Gunakan Format Tabel Markdown yang rapi pada bagian yang memungkinkan):
      ${logoImg}
      # RENCANA PEMBELAJARAN MENDALAM

      ## 1. Komponen Identifikasi (Kompas Pembelajaran)
      [Buat tabel Identitas: Satuan Pendidikan, Nama Guru, Mata Pelajaran, Fase/Kelas, Semester, Alokasi Waktu, Tujuan Pembelajaran (Tulis mentah: ${form.tujuan})]
      - **Identifikasi Peserta Didik:** [Uraikan gambaran kesiapan belajar, minat, latar belakang, dan kebutuhan spesifik siswa]
      - **Identifikasi Materi:** [Analisis karakteristik materi konseptual/prosedural, tingkat kesulitan, dan relevansinya dengan kehidupan nyata berdasarkan topik: ${form.materi}]
      - **Dimensi Profil Lulusan:** [Uraikan karakter atau kompetensi lulusan yang ingin dicapai, fokus pada: ${profilAktif || 'Bernalar Kritis dan Kreatif'}]

      ## 2. Desain Pembelajaran (Kerangka Operasional)
      - **Tujuan Pembelajaran (TP):** ${form.tujuan} (Tuliskan persis seperti ini, JANGAN dijabarkan/dipetakan lagi)
      - **Topik Kontekstual:** [Jelaskan tema yang relevan dengan keseharian siswa dan bagaimana mengintegrasikan lintas disiplin ilmu pada topik ini]
      - **Karakteristik Pembelajaran:** [Jabarkan praktik pedagogis dengan model ${form.modelPembelajaran}, pemanfaatan teknologi digital, lingkungan belajar, dan kemitraan luar jika ada]

      ## 3. Pengalaman Belajar (Siklus Kognitif)
      [PENTING: Jabarkan pengalaman belajar untuk SETIAP PERTEMUAN (Total: ${form.jumlahPertemuan} Pertemuan). Rangkaian aktivitas WAJIB mengandung 3 tahap utama: Tahap Memahami (Understanding), Tahap Mengaplikasi (Applying), dan Tahap Merefleksi (Reflecting). Seluruh tahap harus mengusung prinsip Berkesadaran (Mindful), Bermakna (Meaningful), dan Menggembirakan (Joyful). Buat TABEL TERPISAH PER PERTEMUAN berisi kolom: Tahap (Padukan Pendahuluan/Inti/Penutup ke dalam siklus Memahami/Mengaplikasi/Merefleksi), Uraian Aktivitas Guru & Siswa (sangat detail, aktif, tidak sekadar menghafal), dan Waktu (kolom paling kanan, total persis ${totalMenit} menit per tabel)]

      ## 4. Asesmen Pembelajaran
      [Uraikan strategi penilaian yang berkelanjutan:]
      - **Asesmen Awal:** [Menilai pengetahuan prasyarat/kesiapan]
      - **Asesmen Proses (Formatif):** [Umpan balik selama pembelajaran berlangsung]
      - **Asesmen Akhir (Sumatif):** [Mengukur pencapaian kompetensi di akhir siklus]

      ## Pengesahan
      <br/><br/>
      <table class="no-border-table" style="width:100%; text-align:center;">
        <tr>
          <td style="width:50%;">Mengetahui,<br/>Kepala Sekolah</td>
          <td style="width:50%;">Guru Mata Pelajaran</td>
        </tr>
        <tr>
          <td style="height:80px;"></td>
          <td></td>
        </tr>
        <tr>
          <td><strong>${form.namaKepsek || '[Nama Kepala Sekolah]'}</strong><br/>NIP. ${form.nipKepsek || '.......................'}</td>
          <td><strong>${form.namaGuru || '[Nama Guru]'}</strong><br/>NIP. ${form.nipGuru || '.......................'}</td>
        </tr>
      </table>`;
    }

    const payload = { 
      contents: [{ parts: [{ text: userPrompt }] }], 
      systemInstruction: { parts: [{ text: systemPrompt }] } 
    };

    let aiText = null;
    let attempt = 0;
    const maxRetries = 5;
    const delays = [1000, 2000, 4000, 8000, 16000];

    while (attempt <= maxRetries && !aiText) {
      try {
        // Contoh struktur yang benar untuk Gemini 1.5
const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    contents: [{
      parts: [{
        text: prompt // Pastikan variabel prompt Anda ada di sini
      }]
    }]
  })
});
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!aiText) throw new Error("Respons AI kosong.");
      } catch (e) { 
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delays[attempt]));
        } else {
          setResult(`Terjadi kesalahan teknis saat menghubungkan ke AI. Mohon coba lagi. (${e.message})`);
        }
      }
      attempt++;
    }

    if (aiText) {
      setResult(aiText);
      if (!isDemo) {
        const today = new Date().toISOString().split('T')[0];
        const usageRef = doc(db, 'artifacts', appId, 'public', 'data', 'usages', `${today}_${userData.username}`);
        await setDoc(usageRef, { count: increment(1), date: today, username: userData.username }, { merge: true });
      }
    }
    setIsGenerating(false);
  };

  const saveToFirebase = async () => {
    if (!result || isDemo) return;
    
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'documents'), {
        title: `${(type || 'dokumen').toUpperCase()} - ${form.mapel || 'Tanpa Judul'} (${form.kelas || '-'})`,
        content: result, 
        type: type || 'lainnya', 
        temaDokumen: form.temaDokumen || 'profesional',
        orientasi: form.orientasi || 'Portrait',
        ukuranKertas: form.ukuranKertas || 'A4',
        username: userData?.username || 'anonymous',
        createdAt: serverTimestamp()
      });
      onSuccess();
    } catch (err) {
      console.error("Gagal menyimpan dokumen: ", err);
      setFormError("Gagal menyimpan dokumen ke arsip. Periksa koneksi internet Anda.");
    }
  };

  const currentTheme = useMemo(() => {
    return COLOR_THEMES.find(t => t.id === form.temaDokumen) || COLOR_THEMES[0];
  }, [form.temaDokumen]);

  // Fungsi untuk merender Live Preview (Sebelum Dihasilkan AI)
  const renderLivePreview = () => {
    const profilAktif = Object.entries(form.profilPelajar).filter(([k,v]) => v).map(([k]) => k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())).join(', ') || '-';
    const logoImg = form.logoSekolah ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${form.logoSekolah}" width="100" /></div>` : '';
    
    const totalMenit = parseInt(form.jumlahJP || 0) * parseInt(form.menitPerJP || 0);
    const textAlokasiWaktu = `${form.jumlahPertemuan} Pertemuan (Alokasi per pertemuan: ${form.jumlahJP} JP x ${form.menitPerJP} Menit = ${totalMenit} Menit)`;
    
    let mockupText = '';

    if (type === 'analisis_cp') {
      mockupText = `
${logoImg}
# ANALISIS CAPAIAN PEMBELAJARAN (TP & ATP)

## 1. Identitas
| Parameter | Keterangan |
|---|---|
| **Mata Pelajaran** | ${form.mapel || '[Belum Diisi]'} |
| **Fase / Jenjang** | Fase ${form.fase} / ${form.jenjang} |
| **Tingkat Kognitif** | ${form.tingkatKognitif} |

## 2. Narasi Capaian Pembelajaran (CP)
> *${form.narasiCP || '[Tempelkan teks CP pada form di samping]'}*

## 3. Pemetaan & Alur Tujuan Pembelajaran (TP & ATP)
*(Tabel Pemetaan Kompetensi, Lingkup Materi, Rumusan TP, serta Alur Tujuan Pembelajaran (ATP) yang terintegrasi Profil Pelajar Pancasila akan di-generate otomatis oleh AI di dalam satu tabel ini)*

## Pengesahan
<br/>
<table class="no-border-table" style="width:100%; text-align:center;">
  <tr>
    <td style="width:50%;">Mengetahui,<br/>Kepala Sekolah</td>
    <td style="width:50%;">Guru Mata Pelajaran</td>
  </tr>
  <tr>
    <td style="height:80px;"></td>
    <td></td>
  </tr>
  <tr>
    <td><strong>${form.namaKepsek || '[Nama Kepala Sekolah]'}</strong><br/>NIP. ${form.nipKepsek || '.......................'}</td>
    <td><strong>${form.namaGuru || '[Nama Guru]'}</strong><br/>NIP. ${form.nipGuru || '.......................'}</td>
  </tr>
</table>
      `;
    } else if (type === 'rpl') {
      mockupText = `
${logoImg}
# RENCANA PELAKSANAAN LAYANAN (RPL) BIMBINGAN DAN KONSELING

## 1. Identitas Layanan (Administratif)
| Parameter | Keterangan |
|---|---|
| **Satuan Pendidikan** | ${form.namaSekolah || '[Belum Diisi]'} |
| **Tahun Ajaran/Semester** | ${form.semester} |
| **Sasaran** | Kelas ${form.kelas} / Fase ${form.fase} |
| **Pelaksana** | ${form.namaGuru || '[Belum Diisi]'} |
| **Waktu / Alokasi** | ${textAlokasiWaktu} |
| **Tujuan Layanan** | ${form.tujuan || '[Belum Diisi]'} |

## 2. Komponen dan Bidang Layanan
| Komponen | Keterangan |
|---|---|
| **Komponen Layanan** | ${form.komponenLayanan} |
| **Bidang Layanan** | ${form.bidangLayanan} |
| **Fungsi Layanan** | ${form.fungsiLayanan} |

## 3. Konten Utama (Substansi)
| Komponen | Keterangan |
|---|---|
| **Topik / Tema** | ${form.mapel || '[Belum Diisi]'} |
| **Tujuan Khusus** | ${form.tujuan || '[Belum Diisi]'} |
| **Materi Layanan** | ${form.materi || '[Belum Diisi]'} |

## 4. Strategi dan Metodologi
* Strategi, Media, dan Alat akan disesuaikan otomatis oleh AI dengan metode **${form.modelPembelajaran}**.

## 5. Skenario Kegiatan (Tahapan)
*Rincian kegiatan untuk ${form.jumlahPertemuan} pertemuan akan disusun secara otomatis oleh AI di bagian ini menggunakan tabel dengan kolom waktu di sebelah kanan.*

## 6. Evaluasi dan Pelaporan
*Uraian evaluasi proses dan evaluasi hasil akan dibuatkan otomatis oleh AI.*

## 7. Lampiran
* Uraian Materi, Instrumen, dan Deskripsi Media akan dilampirkan di sini.

## Pengesahan
<br/>
<table class="no-border-table" style="width:100%; text-align:center;">
  <tr>
    <td style="width:50%;">Mengetahui,<br/>Kepala Sekolah</td>
    <td style="width:50%;">Guru / Konselor</td>
  </tr>
  <tr>
    <td style="height:80px;"></td>
    <td></td>
  </tr>
  <tr>
    <td><strong>${form.namaKepsek || '[Nama Kepala Sekolah]'}</strong><br/>NIP. ${form.nipKepsek || '.......................'}</td>
    <td><strong>${form.namaGuru || '[Nama Guru]'}</strong><br/>NIP. ${form.nipGuru || '.......................'}</td>
  </tr>
</table>
      `;
    } else if (type === 'kokurikuler') {
      mockupText = `
${logoImg}
# MODUL PROJEK KOKURIKULER: ${form.materi.toUpperCase() || '[JUDUL PROJEK]'}

## I. Identitas & Komponen Umum
| Parameter | Keterangan |
|---|---|
| **Judul Proyek** | ${form.materi || '[Belum Diisi]'} |
| **Tema Besar** | ${form.mapel || '[Belum Diisi]'} |
| **Fase / Kelas** | Fase ${form.fase} / Kelas ${form.kelas} |
| **Alokasi Waktu** | ${textAlokasiWaktu} |
| **Penyusun** | ${form.namaGuru || '[Belum Diisi]'} |
| **Institusi** | ${form.namaSekolah || '[Belum Diisi]'} |

* **Target Peserta Didik:** Reguler
* **Sarana & Prasarana:** (Akan diuraikan secara spesifik oleh AI)

## II. Pemetaan Dimensi & Tujuan (Inti)
*Pemetaan dimensi Profil Pelajar Pancasila (${profilAktif || '-'}) beserta Elemen, Sub-Elemen, dan Target Pencapaian Fase akan di-generate oleh AI dalam bentuk tabel.*

## III. Alur Aktivitas (Langkah Kerja)
*Alur proyek akan dijabarkan menjadi 4 tahap (Pengenalan, Kontekstualisasi, Aksi, Refleksi & Tindak Lanjut) sesuai dengan alokasi waktu ${textAlokasiWaktu}.*

## IV. Asesmen (Penilaian)
*Instrumen asesmen Diagnostik, Formatif, dan Sumatif akan disiapkan otomatis.*

## V. Lampiran & Rubrik Detail
* LKPD (Lembar Kerja Peserta Didik)
* Rubrik Pencapaian
* Bahan Bacaan

## Pengesahan
<br/>
<table class="no-border-table" style="width:100%; text-align:center;">
  <tr>
    <td style="width:50%;">Mengetahui,<br/>Kepala Sekolah</td>
    <td style="width:50%;">Koordinator / Fasilitator Projek</td>
  </tr>
  <tr>
    <td style="height:80px;"></td>
    <td></td>
  </tr>
  <tr>
    <td><strong>${form.namaKepsek || '[Nama Kepala Sekolah]'}</strong><br/>NIP. ${form.nipKepsek || '.......................'}</td>
    <td><strong>${form.namaGuru || '[Nama Guru]'}</strong><br/>NIP. ${form.nipGuru || '.......................'}</td>
  </tr>
</table>
      `;
    } else if (type === 'jobsheet') {
      mockupText = `
${logoImg}
# JOB SHEET / LEMBAR KERJA PRAKTIK

## I. Informasi Umum
| Parameter | Keterangan |
|---|---|
| **Nama Pekerjaan / Topik** | ${form.materi || '[Belum Diisi]'} |
| **Mata Pelajaran** | ${form.mapel || '[Belum Diisi]'} |
| **Fase / Kelas** | Fase ${form.fase} / Kelas ${form.kelas} |
| **Instruktur / Guru** | ${form.namaGuru || '[Belum Diisi]'} |
| **Waktu / Alokasi** | ${textAlokasiWaktu} |
| **Tujuan Praktik** | ${form.tujuan || '[Belum Diisi]'} |

## II. Tujuan Praktik
${form.tujuan || '[Belum Diisi]'}

## III. Keselamatan Kerja (K3)
*Pedoman kesehatan dan keselamatan kerja khusus untuk materi praktik akan disusun secara otomatis oleh AI di sini.*

## IV. Alat dan Bahan
*Tabel kebutuhan alat dan bahan kerja (beserta spesifikasi dan jumlah) akan di-generate oleh AI.*

## V. Gambar Kerja / Skema
*(Area khusus penempatan gambar / diagram rangkaian / desain).*

## VI. Langkah Kerja (SOP)
*Tabel standar operasional prosedur untuk ${form.jumlahPertemuan} pertemuan dengan kolom waktu di sebelah kanan akan dihasilkan di bagian ini.*

## VII. Lembar Pengamatan
*Format tabel kosong akan disiapkan untuk laporan praktikum siswa.*

## VIII. Evaluasi
*Pertanyaan analitis terkait praktik.*

## Pengesahan
<br/>
<table class="no-border-table" style="width:100%; text-align:center;">
  <tr>
    <td style="width:50%;">Mengetahui,<br/>Kepala Bengkel / Sekolah</td>
    <td style="width:50%;">Instruktur / Guru Kejuruan</td>
  </tr>
  <tr>
    <td style="height:80px;"></td>
    <td></td>
  </tr>
  <tr>
    <td><strong>${form.namaKepsek || '[Nama Kep. Bengkel]'}</strong><br/>NIP. ${form.nipKepsek || '.......................'}</td>
    <td><strong>${form.namaGuru || '[Nama Guru]'}</strong><br/>NIP. ${form.nipGuru || '.......................'}</td>
  </tr>
</table>
      `;
    } else if (type === 'modul') {
      mockupText = `
${logoImg}
# RENCANA PELAKSANAAN PEMBELAJARAN: ${form.mapel.toUpperCase() || '[MATA PELAJARAN]'}

## BAGIAN I: INFORMASI UMUM
| Parameter | Keterangan |
|---|---|
| **Penyusun** | ${form.namaGuru || '[Belum Diisi]'} |
| **Institusi** | ${form.namaSekolah || '[Belum Diisi]'} |
| **Jenjang/Kelas/Fase** | ${form.jenjang} / Kelas ${form.kelas} / Fase ${form.fase} |
| **Semester** | ${form.semester} |
| **Waktu / Alokasi** | ${textAlokasiWaktu} |
| **Tujuan Pembelajaran** | ${form.tujuan || '[Belum Diisi]'} |
| **Profil Pelajar Pancasila** | ${profilAktif} |
| **Model Pembelajaran** | ${form.modelPembelajaran} |

## BAGIAN II: KOMPONEN INTI
**A. Tujuan Pembelajaran**
${form.tujuan || '[Tujuan Pembelajaran Belum Diisi]'}

**B. Pemahaman Bermakna & Pertanyaan Pemantik**
*Akan disusun otomatis oleh AI berdasarkan topik ${form.materi || '[Belum Diisi]'}.*

**C. Kegiatan Pembelajaran**
*Rincian kegiatan untuk ${form.jumlahPertemuan} pertemuan akan disusun secara otomatis oleh AI di bagian ini menggunakan tabel dengan kolom waktu di sebelah kanan.*

**D. Asesmen, Pengayaan, dan Refleksi**
*Strategi asesmen (Diagnostik, Formatif, Sumatif) akan disiapkan otomatis.*

## BAGIAN III: LAMPIRAN
* LKPD (Lembar Kerja Peserta Didik)
* Bahan Bacaan Guru & Siswa
* Glosarium & Daftar Pustaka
* Rubrik Penilaian

## Pengesahan
<br/>
<table class="no-border-table" style="width:100%; text-align:center;">
  <tr>
    <td style="width:50%;">Mengetahui,<br/>Kepala Sekolah</td>
    <td style="width:50%;">Guru Mata Pelajaran</td>
  </tr>
  <tr>
    <td style="height:80px;"></td>
    <td></td>
  </tr>
  <tr>
    <td><strong>${form.namaKepsek || '[Nama Kepala Sekolah]'}</strong><br/>NIP. ${form.nipKepsek || '.......................'}</td>
    <td><strong>${form.namaGuru || '[Nama Guru]'}</strong><br/>NIP. ${form.nipGuru || '.......................'}</td>
  </tr>
</table>
      `;
    } else if (type === 'lkpd') {
      mockupText = `
# LEMBAR KERJA PESERTA DIDIK (LKPD)

## Informasi Umum
| Parameter | Keterangan |
|---|---|
| **Mata Pelajaran** | ${form.mapel || '[Belum Diisi]'} |
| **Fase / Kelas** | Fase ${form.fase} / Kelas ${form.kelas} |
| **Topik/Materi** | ${form.materi || '[Belum Diisi]'} |
| **Tujuan Pembelajaran** | ${form.tujuan || '[Belum Diisi]'} |

## A. Pilihan Ganda
*Akan disusun otomatis sebanyak ${form.jumlahPG} soal dengan opsi pilihan ${form.opsiPG}.*

## B. Uraian / Esai
*Akan disusun otomatis sebanyak ${form.jumlahEsai} soal esai.*

---
*Kunci jawaban akan dilampirkan pada halaman terakhir dokumen setelah di-generate.*
      `;
    } else if (type === 'slide') {
      mockupText = `
# SLIDE PRESENTASI: ${form.mapel.toUpperCase() || '[MATA PELAJARAN]'}

## Slide 1: Judul Presentasi
* Topik: ${form.materi || '[Belum Diisi]'}
* Fasilitator: ${form.namaGuru || '[Nama Guru]'}

## Slide 2: Tujuan Pembelajaran
* ${form.tujuan || '[Tujuan Pembelajaran Belum Diisi]'}

## Slide 3 - ${form.jumlahSlide}: Materi Inti
*Akan disusun otomatis oleh AI sebanyak ±${form.jumlahSlide} slide.*
*Gaya Bahasa: ${form.gayaBahasa}*

## Slide Terakhir: Kesimpulan & Tanya Jawab
* Ringkasan materi yang telah dipelajari.
* Sesi interaktif dengan siswa.
      `;
    } else {
      mockupText = `
${logoImg}
# RENCANA PEMBELAJARAN MENDALAM

## 1. Komponen Identifikasi (Kompas Pembelajaran)
| Parameter | Keterangan |
|---|---|
| **Nama Guru** | ${form.namaGuru || '[Belum Diisi]'} |
| **Nama Sekolah** | ${form.namaSekolah || '[Belum Diisi]'} |
| **Mata Pelajaran** | ${form.mapel || '[Belum Diisi]'} |
| **Fase / Kelas** | Fase ${form.fase} / Kelas ${form.kelas} |
| **Semester** | ${form.semester} |
| **Waktu / Alokasi** | ${textAlokasiWaktu} |
| **Tujuan Pembelajaran** | ${form.tujuan || '[Belum Diisi]'} |

* **Identifikasi Peserta Didik:** Kesiapan, minat, latar belakang, dan kebutuhan spesifik siswa.
* **Identifikasi Materi:** Analisis karakteristik materi ${form.materi || '[Topik]'} dan relevansinya secara nyata.
* **Dimensi Profil Lulusan:** ${profilAktif || 'Karakter utama lulusan yang disasar.'}

## 2. Desain Pembelajaran (Kerangka Operasional)
* **Tujuan Pembelajaran (TP):** ${form.tujuan || '[Belum Diisi]'}
* **Topik Kontekstual:** Tema terintegrasi disiplin ilmu.
* **Karakteristik Pembelajaran:** Praktik pedagogis menggunakan **${form.modelPembelajaran}**.

## 3. Pengalaman Belajar (Siklus Kognitif)
*Rincian pengalaman belajar untuk ${form.jumlahPertemuan} pertemuan akan disusun secara otomatis oleh AI di bagian ini menggunakan tabel dengan kolom waktu di sebelah kanan. Aktivitas akan mencakup siklus Memahami, Mengaplikasi, dan Merefleksi secara Mindful, Meaningful, dan Joyful.*

## 4. Asesmen Pembelajaran
* **Asesmen Awal:** Menilai pengetahuan prasyarat.
* **Asesmen Proses (Formatif):** Umpan balik selama pembelajaran.
* **Asesmen Akhir (Sumatif):** Mengukur capaian di akhir siklus.

## Pengesahan
<br/>
<table class="no-border-table" style="width:100%; text-align:center;">
  <tr>
    <td style="width:50%;">Mengetahui,<br/>Kepala Sekolah</td>
    <td style="width:50%;">Guru Mata Pelajaran</td>
  </tr>
  <tr>
    <td style="height:80px;"></td>
    <td></td>
  </tr>
  <tr>
    <td><strong>${form.namaKepsek || '[Nama Kepala Sekolah]'}</strong><br/>NIP. ${form.nipKepsek || '.......................'}</td>
    <td><strong>${form.namaGuru || '[Nama Guru]'}</strong><br/>NIP. ${form.nipGuru || '.......................'}</td>
  </tr>
</table>
      `;
    }
    
    return (
       <div className="flex justify-center bg-slate-100 min-h-full p-4 lg:p-8">
         <div 
           className={`prose prose-slate max-w-none p-10 transition-all duration-500 theme-wrapper bg-white shadow-xl border border-slate-200 ${isDemo ? 'select-none pointer-events-auto' : ''}`}
           style={{
             '--theme-title': `#${currentTheme.titleCol}`,
             '--theme-body': `#${currentTheme.bodyCol}`,
             width: '100%',
             maxWidth: form.orientasi === 'Landscape' ? '100%' : '850px',
             minHeight: form.orientasi === 'Landscape' ? '600px' : '1100px'
           }}
           onContextMenu={isDemo ? (e) => e.preventDefault() : undefined}
           onDragStart={isDemo ? (e) => e.preventDefault() : undefined}
         >
           <div dangerouslySetInnerHTML={{ __html: renderMarkdown(mockupText) }}></div>
         </div>
       </div>
    );
  };

  const isFullForm = type === 'rpm' || type === 'modul' || type === 'rpl' || type === 'jobsheet' || type === 'kokurikuler';
  const isAnalisisCP = type === 'analisis_cp';
  const isFullOrCP = isFullForm || isAnalisisCP;
  const showPreviewMode = !result && !isGenerating;

  return (
    <div className={`grid grid-cols-1 ${showPreviewMode ? 'lg:grid-cols-12 gap-6' : 'lg:grid-cols-12 gap-8'} pb-10 transition-all duration-500`}>
      
      {/* BAGIAN KIRI: INPUT FORM */}
      <div className={`${showPreviewMode ? 'lg:col-span-5' : 'lg:col-span-4'} space-y-6 h-full flex flex-col`}>
        
        {/* Banner Khusus Mode Demo */}
        {isDemo && (
          <div className="mb-2 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3">
            <Lock className="text-[#FF8C00] shrink-0" size={18} />
            <div>
              <p className="text-[10px] font-black text-[#FF8C00] uppercase">Mode Demonstrasi</p>
              <p className="text-[10px] text-slate-300 font-medium leading-tight mt-1">Anda sedang mencoba fitur AI. Hasil generate <b>tidak dapat diunduh</b> atau disalin. Silakan login untuk fitur penuh.</p>
            </div>
          </div>
        )}

        <div className={`bg-[#0F172A] rounded-[2rem] shadow-[0_0_20px_rgba(0,51,102,0.5)] border border-blue-500/30 p-8`}>
          <div className="flex justify-between items-center border-b border-blue-500/30 pb-4 mb-6">
            <h2 className="text-[12px] font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Edit3 size={16} className="text-[#FF8C00]"/> Form Parameter {type === 'rpm' ? 'RPM' : type === 'rpl' ? 'RPL BK' : type === 'jobsheet' ? 'JOB SHEET' : type === 'kokurikuler' ? 'MODUL PROJEK' : type === 'analisis_cp' ? 'ANALISIS CP' : type === 'lkpd' ? 'LKPD' : type === 'slide' ? 'SLIDE' : 'RPP'}
            </h2>
          </div>
          
          {limitError && !isDemo && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertTriangle className="text-red-400 shrink-0" size={18} />
              <div>
                <p className="text-[10px] font-black text-red-400 uppercase">Limit Tercapai!</p>
                <p className="text-[10px] text-red-300 font-medium leading-tight mt-1">Kuota paket {PLANS[userData?.plan || 'plus']?.label} hari ini sudah habis.</p>
              </div>
            </div>
          )}

          {formError && (
             <div className="mb-6 p-4 bg-orange-900/30 border border-orange-500/30 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
               <AlertCircle className="text-[#FF8C00] shrink-0" size={18} />
               <p className="text-[10px] text-slate-200 font-bold leading-tight mt-0.5">{formError}</p>
             </div>
          )}

          {/* INLINE INPUT FIELDS */}
          <div className="space-y-6">
            
            {/* 1. DATA UMUM */}
            <div className="bg-[#003366]/50 p-5 rounded-2xl border border-blue-500/30 space-y-4">
              <h3 className="text-[10px] font-black uppercase text-slate-300 flex items-center gap-2 mb-3"><LayoutDashboard size={14} className="text-[#FF8C00]"/> 1. Data Umum</h3>
              <div className="space-y-3">
                <input className="w-full px-4 py-3 bg-[#0F172A] rounded-xl border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white placeholder-slate-500 transition-all" value={form.mapel} onChange={e=>setForm({...form, mapel:e.target.value})} placeholder={type === 'rpl' ? 'Topik / Tema Layanan' : type === 'jobsheet' ? 'Mata Pelajaran Kejuruan' : type === 'kokurikuler' ? 'Tema Projek (Misal: Gaya Hidup Berkelanjutan)' : 'Mata Pelajaran (Wajib)'} />
                
                {isFullOrCP && (
                  <div className="grid grid-cols-2 gap-2">
                    <select className="w-full px-4 py-3 bg-[#0F172A] rounded-xl border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white transition-all" value={form.jenjang} onChange={e=>setForm({...form, jenjang:e.target.value})}>
                      {['SD','SMP','SMA','SMK'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <select className="w-full px-4 py-3 bg-[#0F172A] rounded-xl border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white transition-all" value={form.semester} onChange={e=>setForm({...form, semester:e.target.value})}>
                      {['Ganjil','Genap'].map(v => <option key={v} value={v}>Semester {v}</option>)}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-slate-400 px-1">Fase</span>
                    <select className="w-full px-4 py-3 bg-[#0F172A] rounded-xl border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white transition-all" value={form.fase} onChange={e=>setForm({...form, fase:e.target.value})}>{['A','B','C','D','E','F'].map(f => <option key={f} value={f}>Fase {f}</option>)}</select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-slate-400 px-1">Kelas</span>
                    <select className="w-full px-4 py-3 bg-[#0F172A] rounded-xl border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white transition-all" value={form.kelas} onChange={e=>setForm({...form, kelas:e.target.value})}>{[1,2,3,4,5,6,7,8,9,10,11,12].map(k => <option key={k} value={k}>Kelas {k}</option>)}</select>
                  </div>
                </div>

                {isFullForm && (
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-blue-500/30">
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-slate-400 px-1">Menit/JP</span>
                        <input type="number" className="w-full px-3 py-2 bg-[#0F172A] rounded-lg border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white" value={form.menitPerJP} onChange={e=>setForm({...form, menitPerJP:e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-slate-400 px-1">Jml JP</span>
                        <input type="number" className="w-full px-3 py-2 bg-[#0F172A] rounded-lg border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white" value={form.jumlahJP} onChange={e=>setForm({...form, jumlahJP:e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-slate-400 px-1">Pertemuan</span>
                        <select className="w-full px-2 py-2 bg-[#0F172A] rounded-lg border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white" value={form.jumlahPertemuan} onChange={e=>setForm({...form, jumlahPertemuan:e.target.value})}>
                          {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}x</option>)}
                        </select>
                      </div>
                    </div>
                )}
              </div>
            </div>

            {/* KHUSUS ANALISIS CP: DATA UTAMA */}
            {isAnalisisCP && (
              <div className="bg-[#003366]/50 p-5 rounded-2xl border border-blue-500/30 space-y-4">
                <h3 className="text-[10px] font-black uppercase text-slate-300 flex items-center gap-2 mb-3"><PenTool size={14} className="text-[#FF8C00]"/> 2. Data Utama (CP)</h3>
                <div className="space-y-3">
                  <textarea className="w-full px-4 py-3 bg-[#0F172A] rounded-xl border border-slate-700 text-xs font-medium min-h-[100px] outline-none focus:ring-2 focus:ring-[#FF8C00] text-white placeholder-slate-500 transition-all resize-y" value={form.narasiCP} onChange={e=>setForm({...form, narasiCP:e.target.value})} placeholder="Tempel/Salin Narasi Capaian Pembelajaran (CP) secara utuh di sini..." />
                  
                  <div className="space-y-1 mt-2 pt-2 border-t border-blue-500/30">
                    <span className="text-[8px] font-bold text-slate-400 px-1">Target Tingkat Kognitif</span>
                    <select className="w-full px-4 py-3 bg-[#0F172A] rounded-xl border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white transition-all" value={form.tingkatKognitif} onChange={e=>setForm({...form, tingkatKognitif:e.target.value})}>
                      <option value="C1-C3 (LOTS/MOTS)">Fokus C1-C3 (Mengingat, Memahami, Mengaplikasikan)</option>
                      <option value="C4-C6 (HOTS)">Fokus C4-C6 (Menganalisis, Mengevaluasi, Mencipta)</option>
                      <option value="Campuran Proporsional (C1-C6)">Campuran Proporsional (Semua Tingkatan)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* KHUSUS RPL: SPESIFIKASI LAYANAN */}
            {type === 'rpl' && (
              <div className="bg-[#003366]/50 p-5 rounded-2xl border border-blue-500/30 space-y-4">
                <h3 className="text-[10px] font-black uppercase text-slate-300 flex items-center gap-2 mb-3"><Heart size={14} className="text-[#FF8C00]"/> Spesifikasi Layanan BK</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-slate-400 px-1">Komponen</span>
                    <select className="w-full px-3 py-2 bg-[#0F172A] rounded-lg border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white" value={form.komponenLayanan} onChange={e=>setForm({...form, komponenLayanan:e.target.value})}>
                      {['Layanan Dasar','Layanan Responsif','Peminatan & Perencanaan Individual','Dukungan Sistem'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-slate-400 px-1">Bidang</span>
                    <select className="w-full px-3 py-2 bg-[#0F172A] rounded-lg border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white" value={form.bidangLayanan} onChange={e=>setForm({...form, bidangLayanan:e.target.value})}>
                      {['Pribadi','Sosial','Belajar','Karier'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-slate-400 px-1">Fungsi</span>
                    <select className="w-full px-3 py-2 bg-[#0F172A] rounded-lg border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white" value={form.fungsiLayanan} onChange={e=>setForm({...form, fungsiLayanan:e.target.value})}>
                      {['Pemahaman','Pencegahan','Pengentasan','Pemeliharaan & Pengembangan','Advokasi'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 2. DESAIN PEMBELAJARAN / STRATEGI LAYANAN */}
            {!isAnalisisCP && (
              <div className="bg-[#003366]/50 p-5 rounded-2xl border border-blue-500/30 space-y-4">
                <h3 className="text-[10px] font-black uppercase text-slate-300 flex items-center gap-2 mb-3"><PenTool size={14} className="text-[#FF8C00]"/> {type === 'rpl' ? 'Strategi Layanan' : type === 'jobsheet' ? 'Detail Praktikum' : type === 'kokurikuler' ? 'Detail Projek' : '2. Desain Pembelajaran'}</h3>
                <div className="space-y-3">
                  {isFullForm && type !== 'jobsheet' && type !== 'kokurikuler' && (
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-slate-400 px-1">{type === 'rpl' ? 'Metode / Teknik' : 'Model Pembelajaran'}</span>
                        <select className="w-full px-4 py-3 bg-[#0F172A] rounded-xl border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white transition-all" value={form.modelPembelajaran} onChange={e=>setForm({...form, modelPembelajaran:e.target.value})}>
                          {type === 'rpl' ? 
                            ['Diskusi Kelompok', 'Role Playing', 'Cinema Education', 'Problem Based Learning', 'Bimbingan Kelompok', 'Klasikal Interaktif', 'Tanya Jawab'].map(m => <option key={m} value={m}>{m}</option>)
                          : 
                            ['Problem Based Learning (PBL)', 'Project Based Learning (PjBL)', 'Discovery Learning', 'Inquiry Learning', 'Understanding by Design (UbD)', 'Teaching at the Right Level (TaRL)', 'Culturally Responsive Teaching (CRT)', 'Pembelajaran Berdiferensiasi', 'Direct Instruction'].map(m => <option key={m} value={m}>{m}</option>)
                          }
                        </select>
                      </div>
                  )}
                  <textarea className="w-full px-4 py-3 bg-[#0F172A] rounded-xl border border-slate-700 text-xs font-medium min-h-[80px] outline-none focus:ring-2 focus:ring-[#FF8C00] text-white placeholder-slate-500 transition-all resize-y" value={form.materi} onChange={e=>setForm({...form, materi:e.target.value})} placeholder={type === 'rpl' ? "Materi Inti Layanan" : type === 'jobsheet' ? "Nama Praktik / Pekerjaan Pokok" : type === 'kokurikuler' ? "Judul Projek (Misal: Sampahku Tanggung Jawabku)" : "Topik Utama / Materi Pokok"} />
                  <textarea className="w-full px-4 py-3 bg-[#0F172A] rounded-xl border border-slate-700 text-xs font-medium min-h-[80px] outline-none focus:ring-2 focus:ring-[#FF8C00] text-white placeholder-slate-500 transition-all resize-y" value={form.tujuan} onChange={e=>setForm({...form, tujuan:e.target.value})} placeholder={type === 'rpl' ? "Tujuan Khusus Layanan (Wajib)" : type === 'kokurikuler' ? "Tujuan Projek" : "Tujuan Pembelajaran (Wajib)"} />
                  
                  {(isFullForm || type === 'slide') && type !== 'jobsheet' && type !== 'kokurikuler' && (
                    <div className="space-y-1">
                        <span className="text-[8px] font-bold text-slate-400 px-1">Gaya Bahasa Modul/Slide</span>
                        <select className="w-full px-4 py-3 bg-[#0F172A] rounded-xl border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white transition-all" value={form.gayaBahasa} onChange={e=>setForm({...form, gayaBahasa:e.target.value})}>
                          <option value="Formal & Akademis">Formal & Akademis</option>
                          <option value="Komunikatif & Ramah">Komunikatif & Ramah</option>
                          <option value="Inspiratif & Memotivasi">Inspiratif & Memotivasi</option>
                          <option value="Interaktif & Diskusi">Interaktif & Diskusi</option>
                        </select>
                      </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. PROFIL LULUSAN & 4. LOGO */}
            {isFullOrCP && (
              <div className="bg-[#003366]/50 p-5 rounded-2xl border border-blue-500/30 space-y-6">
                {type !== 'jobsheet' && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase text-slate-300 flex items-center gap-2 mb-3"><Check size={14} className="text-[#FF8C00]"/> Integrasi Profil Pelajar Pancasila</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.keys(form.profilPelajar).map((key) => {
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        return (
                          <label key={key} className="flex items-center gap-2 text-[10px] font-bold text-slate-300 cursor-pointer hover:bg-[#0F172A] p-2 rounded-lg border border-transparent hover:border-slate-700 transition-all">
                            <input type="checkbox" checked={form.profilPelajar[key]} onChange={(e) => setForm({...form, profilPelajar: {...form.profilPelajar, [key]: e.target.checked}})} className="rounded text-[#FF8C00] focus:ring-[#FF8C00] bg-[#0F172A] border-slate-600" />
                            {label}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className={`${type !== 'jobsheet' ? 'pt-4 border-t border-blue-500/30' : ''}`}>
                  <h3 className="text-[10px] font-black uppercase text-slate-300 flex items-center gap-2 mb-3"><ImageIcon size={14} className="text-[#FF8C00]"/> Logo Sekolah</h3>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="block w-full text-[10px] text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[#0F172A] file:text-[#FF8C00] hover:file:bg-[#003366] transition-all cursor-pointer bg-[#003366]/50 border border-slate-700 rounded-xl" />
                  {form.logoSekolah && <p className="text-[9px] text-[#FF8C00] font-bold mt-2">✓ Logo berhasil dimuat</p>}
                </div>
              </div>
            )}

            {/* 5. PENGATURAN DOKUMEN */}
            <div className="bg-[#003366]/50 p-5 rounded-2xl border border-blue-500/30 space-y-4">
              <h3 className="text-[10px] font-black uppercase text-slate-300 flex items-center gap-2 mb-3"><Settings size={14} className="text-[#FF8C00]"/> Pengaturan Dokumen</h3>
              <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-slate-400 px-1 flex items-center gap-1"><Palette size={10}/> Tema Warna Dokumen Export</span>
                    <select className="w-full px-4 py-3 bg-[#0F172A] rounded-xl border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white transition-all" value={form.temaDokumen} onChange={e=>setForm({...form, temaDokumen:e.target.value})}>
                      {COLOR_THEMES.map(theme => <option key={theme.id} value={theme.id}>{theme.label}</option>)}
                    </select>
                    
                    {/* Live Preview Theme Colors */}
                    <div className="mt-2 h-8 rounded-lg flex overflow-hidden border border-slate-700 shadow-sm" title="Pratinjau Kombinasi Warna Dokumen (Hanya untuk Export Word)">
                      {currentTheme.colors.map((color, i) => (
                          <div key={i} className="flex-1 flex items-center justify-center text-[8px] font-black" style={{backgroundColor: color, color: i === 0 ? '#475569' : '#FFFFFF'}}>
                             {i === 0 ? 'Latar Kertas' : i === 1 ? 'Judul/Tabel' : 'Teks'}
                          </div>
                      ))}
                    </div>
                  </div>

                  {isFullOrCP && (
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-blue-500/30">
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-slate-400 px-1">Orientasi Halaman</span>
                        <select className="w-full px-3 py-2 bg-[#0F172A] rounded-lg border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white" value={form.orientasi} onChange={e=>setForm({...form, orientasi:e.target.value})}>
                          <option value="Portrait">Potrait</option>
                          <option value="Landscape">Landscape</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-slate-400 px-1">Ukuran Kertas</span>
                        <select className="w-full px-3 py-2 bg-[#0F172A] rounded-lg border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white" value={form.ukuranKertas} onChange={e=>setForm({...form, ukuranKertas:e.target.value})}>
                          <option value="A4">A4</option>
                          <option value="F4">F4 (Folio)</option>
                          <option value="Letter">Letter</option>
                          <option value="Legal">Legal</option>
                        </select>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* 6. DATA PENGESAHAN */}
            {isFullOrCP && (
              <div className="bg-[#003366]/50 p-5 rounded-2xl border border-blue-500/30 space-y-4">
                <h3 className="text-[10px] font-black uppercase text-slate-300 flex items-center gap-2 mb-3"><User size={14} className="text-[#FF8C00]"/> Data Pengesahan</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input className="w-full px-3 py-2 bg-[#0F172A] rounded-lg border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white placeholder-slate-500" value={form.namaKepsek} onChange={e=>setForm({...form, namaKepsek:e.target.value})} placeholder={type === 'jobsheet' ? "Nama Kep. Bengkel" : "Nama Kep. Sekolah"} />
                    <input className="w-full px-3 py-2 bg-[#0F172A] rounded-lg border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white placeholder-slate-500" value={form.nipKepsek} onChange={e=>setForm({...form, nipKepsek:e.target.value})} placeholder="NIP Kepala" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input className="w-full px-3 py-2 bg-[#0F172A] rounded-lg border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white placeholder-slate-500" value={form.namaGuru} onChange={e=>setForm({...form, namaGuru:e.target.value})} placeholder={type === 'jobsheet' ? "Nama Instruktur" : type === 'kokurikuler' ? "Koordinator / Fasilitator" : "Nama Pelaksana/Guru"} />
                    <input className="w-full px-3 py-2 bg-[#0F172A] rounded-lg border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white placeholder-slate-500" value={form.nipGuru} onChange={e=>setForm({...form, nipGuru:e.target.value})} placeholder="NIP Guru (Bila ada)" />
                  </div>
                </div>
              </div>
            )}

            {/* KONFIGURASI KHUSUS LKPD */}
            {type === 'lkpd' && (
              <div className="bg-[#003366]/50 p-5 rounded-2xl space-y-4 border border-blue-500/30">
                <h3 className="text-[10px] font-black uppercase text-slate-300 flex items-center gap-2 mb-2"><ListOrdered size={12} className="text-[#FF8C00]"/> Konfigurasi Soal</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black text-slate-300 uppercase flex items-center gap-2">
                      <CheckCircle size={12} className={form.statusPG ? "text-[#FF8C00]" : "text-slate-600"}/> Pilihan Ganda
                    </span>
                    <button onClick={() => setForm({...form, statusPG: !form.statusPG})} className={`relative w-10 h-5 rounded-full transition-all flex items-center ${form.statusPG ? 'bg-[#FF8C00]' : 'bg-slate-700'}`}>
                      <div className={`absolute w-3.5 h-3.5 bg-white rounded-full transition-all ${form.statusPG ? 'translate-x-5.5' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  {form.statusPG && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-1 bg-[#0F172A] p-3 rounded-xl border border-slate-700">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-slate-400 uppercase px-1">Jumlah Butir Soal</span>
                        <input type="number" min="0" max="50" className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00]" value={form.jumlahPG} onChange={e=>setForm({...form, jumlahPG:e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-slate-400 uppercase px-1">Opsi Jawaban</span>
                        <select className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00]" value={form.opsiPG} onChange={e=>setForm({...form, opsiPG:e.target.value})}>
                          <option value="A - C">A, B, C</option>
                          <option value="A - D">A, B, C, D</option>
                          <option value="A - E">A, B, C, D, E</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                <div className="h-px bg-slate-700 mx-2"></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black text-slate-300 uppercase flex items-center gap-2">
                      <CheckCircle size={12} className={form.statusEsai ? "text-[#3B82F6]" : "text-slate-600"}/> Soal Esai
                    </span>
                    <button onClick={() => setForm({...form, statusEsai: !form.statusEsai})} className={`relative w-10 h-5 rounded-full transition-all flex items-center ${form.statusEsai ? 'bg-[#3B82F6]' : 'bg-slate-700'}`}>
                      <div className={`absolute w-3.5 h-3.5 bg-white rounded-full transition-all ${form.statusEsai ? 'translate-x-5.5' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  {form.statusEsai && (
                    <div className="space-y-1 animate-in fade-in slide-in-from-top-1 bg-[#0F172A] p-3 rounded-xl border border-slate-700">
                      <span className="text-[8px] font-black text-slate-400 uppercase px-1">Jumlah Butir Soal</span>
                      <input type="number" min="0" max="20" className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg border border-slate-700 text-xs font-bold outline-none focus:ring-2 focus:ring-[#3B82F6]" value={form.jumlahEsai} onChange={e=>setForm({...form, jumlahEsai:e.target.value})} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* KONFIGURASI KHUSUS SLIDE */}
            {type === 'slide' && (
              <div className="bg-[#003366]/50 p-5 border border-blue-500/30 rounded-2xl space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-slate-300 flex items-center gap-2 mb-2"><Monitor size={12} className="text-[#FF8C00]"/> Konfigurasi Tambahan</h3>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-slate-500 uppercase px-2 flex items-center gap-1"><Layout size={10}/> Jumlah Slide Ideal</span>
                    <input type="number" min="3" max="20" className="w-full px-4 py-3 bg-[#0F172A] border border-slate-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF8C00] text-white" value={form.jumlahSlide} onChange={e=>setForm({...form, jumlahSlide:e.target.value})} />
                  </div>
              </div>
            )}

          </div> 
          {/* END INLINE INPUT FIELDS */}

          <button 
            onClick={generateAI} 
            disabled={isGenerating || (!isDemo && usageCount >= (PLANS[userData?.plan || 'plus']?.limit || 5)) || (type === 'lkpd' && !form.statusPG && !form.statusEsai)} 
            className={`w-full mt-8 py-4 rounded-2xl font-black uppercase text-[12px] tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all ${!isDemo && usageCount >= (PLANS[userData?.plan || 'plus']?.limit || 5) || (type === 'lkpd' && !form.statusPG && !form.statusEsai) ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none' : 'bg-[#FF8C00] text-white hover:bg-[#FFA726] hover:shadow-[0_0_15px_rgba(255,140,0,0.4)] active:scale-[0.98]'}`}
          >
            {isGenerating ? <Loader2 className="animate-spin w-5 h-5"/> : <><FileCode size={18}/> {showPreviewMode ? `Buat Dokumen` : 'Proses Ulang AI'}</>}
          </button>
        </div>
      </div>

      {/* BAGIAN KANAN: LIVE PREVIEW ATAU HASIL GENERATE */}
      <div className={`${showPreviewMode ? 'lg:col-span-7' : 'lg:col-span-8'} animate-in fade-in slide-in-from-right-8 duration-500`}>
        <div className="bg-[#0F172A] rounded-[2.5rem] shadow-[0_0_30px_rgba(0,51,102,0.5)] border border-blue-500/30 h-full min-h-[700px] flex flex-col overflow-hidden relative">
          <div className="p-6 bg-[#003366] border-b border-blue-500/30 text-white flex justify-between items-center z-20 relative">
            
            {/* Header Kanan Berubah Tergantung Mode (Preview Awal vs Hasil Generate) */}
            {showPreviewMode ? (
               <div className="flex items-center gap-2">
                 <Eye size={16} className="text-[#FF8C00]"/>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#FF8C00]">Pratinjau Langsung (Belum Dihasilkan AI)</span>
               </div>
            ) : (
               <div className="flex bg-[#0F172A] p-1 rounded-xl border border-slate-700">
                  <button onClick={() => { if(!isDemo) setMode('edit'); }} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${mode === 'edit' ? 'bg-[#FF8C00] text-white shadow-[0_0_10px_rgba(255,140,0,0.5)]' : 'text-slate-400 hover:text-white'} ${isDemo ? 'opacity-50 cursor-not-allowed' : ''}`} title={isDemo ? "Mode Edit dikunci pada Demonstrasi" : ""}>Edit</button>
                  <button onClick={()=>setMode('preview')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${mode === 'preview' ? 'bg-[#FF8C00] text-white shadow-[0_0_10px_rgba(255,140,0,0.5)]' : 'text-slate-400 hover:text-white'}`}>Preview</button>
               </div>
            )}

            {result && !showPreviewMode && (
              <div className="flex gap-2">
                {!isDemo ? (
                  <>
                    {type === 'slide' ? (
                      <button onClick={() => handleExportPPTX(`${type.toUpperCase()} - ${form.mapel}`, result, form.temaDokumen)} className="bg-[#FF8C00] px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-[0_0_10px_rgba(255,140,0,0.4)] hover:bg-[#FFA726] transition-all text-white"><Download size={14}/> PPTX</button>
                    ) : (
                      <>
                        <button onClick={() => handleExportDoc(`${type.toUpperCase()} - ${form.mapel}`, result, { themeId: form.temaDokumen, orientation: form.orientasi, paperSize: form.ukuranKertas })} className="bg-[#3B82F6] px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-[0_0_10px_rgba(59,130,246,0.4)] hover:bg-blue-500 transition-all text-white"><Download size={14}/> WORD</button>
                        {type === 'analisis_cp' && (
                          <button onClick={() => handleExportExcel(`${type.toUpperCase()} - ${form.mapel}`, result)} className="bg-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.4)] hover:bg-emerald-500 transition-all text-white"><Download size={14}/> EXCEL</button>
                        )}
                      </>
                    )}
                    <button onClick={saveToFirebase} className="bg-[#FF8C00] px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-[#FFA726] transition-all text-white shadow-[0_0_10px_rgba(255,140,0,0.4)]"><Save size={14}/> SIMPAN</button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 bg-[#FF8C00] text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase shadow-[0_0_15px_rgba(255,140,0,0.5)]">
                    <Lock size={14}/> Login Untuk Mengunduh
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex-1 relative overflow-auto scrollbar-hide z-10 bg-slate-100 rounded-b-[2.5rem]">
            {showPreviewMode ? (
               renderLivePreview()
            ) : mode === 'edit' ? (
               <textarea className="w-full h-full p-8 outline-none font-mono text-[13px] text-slate-800 bg-white whitespace-pre leading-relaxed" value={result} onChange={(e)=>setResult(e.target.value)} /> 
            ) : (
               <div className="flex justify-center min-h-full p-4 lg:p-8">
                 <div 
                   className={`prose prose-slate max-w-none p-10 transition-all duration-500 theme-wrapper bg-white shadow-xl border border-slate-200 ${isDemo ? 'select-none pointer-events-auto' : ''}`}
                   style={{
                     '--theme-title': `#${currentTheme.titleCol}`,
                     '--theme-body': `#${currentTheme.bodyCol}`,
                     width: '100%',
                     maxWidth: form.orientasi === 'Landscape' ? '100%' : '850px',
                     minHeight: form.orientasi === 'Landscape' ? '600px' : '1100px'
                   }}
                   onContextMenu={isDemo ? (e) => e.preventDefault() : undefined}
                   onDragStart={isDemo ? (e) => e.preventDefault() : undefined}
                 >
                   <div dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }}></div>
                 </div>
               </div>
            )}
            
            {isGenerating && <div className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-sm flex flex-col items-center justify-center z-30 rounded-b-[2.5rem]"><Loader2 className="w-12 h-12 text-[#FF8C00] animate-spin mb-4" /><p className="font-black text-[11px] uppercase tracking-widest text-[#FF8C00] animate-pulse shadow-[0_0_15px_rgba(255,140,0,0.2)] px-4 py-2 rounded-full border border-[#FF8C00]/30">Menyusun dokumen kurikulum...</p></div>}
          </div>
        </div>
      </div>

    </div>
  );
};

const MyDocuments = ({ user, appId, userData }) => {
  const [docs, setDocs] = useState([]);
  const [selected, setSelected] = useState(null);
  
  useEffect(() => {
    if (!user || !userData?.username) return; 
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'documents'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const allDocs = snap.docs.map(d => ({id:d.id, ...d.data()}));
      const myDocs = allDocs.filter(d => d.username === userData.username);
      setDocs(myDocs);
    }, (error) => {
      console.error("Error fetching documents:", error);
    });
    return () => unsubscribe();
  }, [user, appId, userData?.username]);

  const selectedTheme = useMemo(() => {
    if (!selected) return null;
    return COLOR_THEMES.find(t => t.id === selected.temaDokumen) || COLOR_THEMES[0];
  }, [selected]);
  
  if (selected) return (
    <div className="bg-[#0F172A] rounded-[3rem] shadow-[0_0_30px_rgba(0,51,102,0.5)] border border-blue-500/30 min-h-screen flex flex-col overflow-hidden">
      <div className="flex justify-between items-center p-8 border-b border-blue-500/30 bg-[#003366]/50">
        <button onClick={()=>setSelected(null)} className="text-[10px] font-black uppercase text-slate-300 flex items-center gap-2 hover:text-[#FF8C00] transition-colors"><ChevronLeft size={16}/> Kembali</button>
        <div className="flex gap-2">
          {selected.type === 'slide' ? (
            <button onClick={() => handleExportPPTX(selected.title, selected.content, selected.temaDokumen || 'profesional')} className="bg-[#FF8C00] text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase shadow-[0_0_15px_rgba(255,140,0,0.4)] hover:bg-[#FFA726] transition-all flex items-center gap-2"><Download size={16}/> Ekspor ke PPTX</button>
          ) : (
            <>
              <button onClick={() => handleExportDoc(selected.title, selected.content, { themeId: selected.temaDokumen, orientation: selected.orientasi, paperSize: selected.ukuranKertas })} className="bg-[#3B82F6] text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:bg-blue-500 transition-all flex items-center gap-2"><Download size={16}/> Ekspor ke Word</button>
              {selected.type === 'analisis_cp' && (
                <button onClick={() => handleExportExcel(selected.title, selected.content)} className="bg-emerald-600 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:bg-emerald-500 transition-all flex items-center gap-2"><Download size={16}/> Ekspor ke Excel</button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-slate-100 p-4 lg:p-8 rounded-b-[3rem]">
        <div 
          className={`p-10 prose prose-slate max-w-none transition-all duration-500 theme-wrapper bg-white shadow-xl border border-slate-200 mx-auto`}
          style={selectedTheme ? {
            '--theme-title': `#${selectedTheme.titleCol}`,
            '--theme-body': `#${selectedTheme.bodyCol}`,
            width: '100%',
            maxWidth: selected.orientasi === 'Landscape' ? '100%' : '850px',
            minHeight: selected.orientasi === 'Landscape' ? '600px' : '1100px'
          } : {
            width: '100%',
            maxWidth: selected.orientasi === 'Landscape' ? '100%' : '850px',
            minHeight: selected.orientasi === 'Landscape' ? '600px' : '1100px'
          }}
        >
          <h1 className="uppercase font-black text-2xl border-b-4 pb-4 mb-8" style={selectedTheme ? {borderColor: `var(--theme-title)`} : {borderColor: '#0f172a'}}>
            {selected.title}
          </h1>
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(selected.content) }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {docs.length > 0 ? docs.map(d => (
        <div key={d.id} className="bg-[#0F172A] p-8 rounded-[2.5rem] border border-blue-500/30 hover:border-[#FF8C00] hover:shadow-[0_0_15px_rgba(255,140,0,0.4)] transition-all group relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <span className={`text-[8px] font-black px-4 py-1.5 rounded-full uppercase border bg-[#003366] text-[#FF8C00] border-blue-500/30`}>{d.type === 'rpm' ? 'RPM' : d.type === 'rpl' ? 'RPL' : d.type === 'modul' ? 'RPP' : d.type === 'kokurikuler' ? 'PROJEK' : d.type === 'analisis_cp' ? 'ANALISIS CP' : d.type}</span>
            <button onClick={()=>deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'documents', d.id))} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
          </div>
          <h3 className="font-black text-white text-sm mb-8 uppercase line-clamp-2 h-10 leading-tight">{d.title}</h3>
          <button onClick={()=>setSelected(d)} className="w-full py-3 bg-[#FF8C00] text-white rounded-xl text-[9px] font-black uppercase hover:bg-[#FFA726] transition-all shadow-[0_0_10px_rgba(255,140,0,0.5)] border border-[#FF8C00]/50">Buka Dokumen</button>
        </div>
      )) : (
        <div className="col-span-full py-20 text-center bg-[#0F172A]/50 rounded-[2.5rem] border border-dashed border-blue-500/30">
           <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Belum ada dokumen yang tersimpan</p>
        </div>
      )}
    </div>
  );
};

const AdminPanel = ({ appId }) => {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ name: '', username: '', sekolah: '', plan: 'plus', masaAktif: '1' });
  
  useEffect(() => {
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'registry'));
    return onSnapshot(q, (snap) => setTeachers(snap.docs.map(d => ({id:d.id, ...d.data()}))));
  }, [appId]);

  const addTeacher = async (e) => {
    e.preventDefault();
    if (!form.name || !form.username) return;

    // Hitung tanggal kedaluwarsa berdasarkan masa aktif (bulan)
    const expiredDate = new Date();
    expiredDate.setMonth(expiredDate.getMonth() + parseInt(form.masaAktif));

    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'registry'), { 
      ...form, 
      expiredAt: expiredDate.toISOString(),
      createdAt: serverTimestamp() 
    });
    
    setForm({name:'', username:'', sekolah:'', plan: 'plus', masaAktif: '1'});
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0F172A] p-8 rounded-[2.5rem] border border-blue-500/30 shadow-[0_0_20px_rgba(0,51,102,0.5)]">
        <h2 className="text-[10px] font-black uppercase mb-6 tracking-widest text-slate-300 flex items-center gap-2"><User size={14} className="text-[#FF8C00]"/> Pendaftaran Akun Guru</h2>
        <form onSubmit={addTeacher} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <input className="px-5 py-4 bg-[#003366]/50 rounded-2xl text-xs font-bold border border-blue-500/30 outline-none focus:ring-2 focus:ring-[#FF8C00] transition-all text-white placeholder-slate-400" placeholder="Nama Guru" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          <input className="px-5 py-4 bg-[#003366]/50 rounded-2xl text-xs font-bold border border-blue-500/30 outline-none focus:ring-2 focus:ring-[#FF8C00] transition-all text-white placeholder-slate-400" placeholder="ID Akses" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required />
          <input className="px-5 py-4 bg-[#003366]/50 rounded-2xl text-xs font-bold border border-blue-500/30 outline-none focus:ring-2 focus:ring-[#FF8C00] transition-all text-white placeholder-slate-400" placeholder="Sekolah" value={form.sekolah} onChange={e=>setForm({...form, sekolah:e.target.value})} required />
          <select className="px-5 py-4 bg-[#003366]/50 rounded-2xl text-xs font-bold border border-blue-500/30 outline-none focus:ring-2 focus:ring-[#FF8C00] transition-all text-white" value={form.plan} onChange={e=>setForm({...form, plan:e.target.value})}>
            <option value="plus">Plus (5/Hari)</option>
            <option value="pro">Pro (20/Hari)</option>
            <option value="ultra">Ultra (50/Hari)</option>
          </select>
          <select className="px-5 py-4 bg-[#003366]/50 rounded-2xl text-xs font-bold border border-blue-500/30 outline-none focus:ring-2 focus:ring-[#FF8C00] transition-all text-white" value={form.masaAktif} onChange={e=>setForm({...form, masaAktif:e.target.value})}>
            <option value="1">Aktif 1 Bulan</option>
            <option value="3">Aktif 3 Bulan</option>
            <option value="6">Aktif 6 Bulan</option>
            <option value="12">Aktif 1 Tahun</option>
          </select>
          <button className="bg-[#FF8C00] text-white font-black rounded-2xl text-[10px] uppercase shadow-[0_0_15px_rgba(255,140,0,0.4)] hover:bg-[#FFA726] transition-all active:scale-95">Registrasi</button>
        </form>
      </div>
      
      <div className="bg-[#0F172A] rounded-[2.5rem] border border-blue-500/30 overflow-hidden shadow-[0_0_20px_rgba(0,51,102,0.5)]">
        <table className="w-full text-left">
          <thead className="bg-[#003366]/80 font-black uppercase text-[9px] text-slate-300 border-b border-blue-500/30">
            <tr>
              <th className="px-10 py-5">Identitas Pendidik</th>
              <th className="px-10 py-5">Username</th>
              <th className="px-10 py-5">Paket & Masa Aktif</th>
              <th className="px-10 py-5 text-right">Opsi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-500/10">
            {teachers.map(t => (
              <tr key={t.id} className="hover:bg-[#003366]/30 transition-colors">
                <td className="px-10 py-5 font-black text-white text-xs">{t.name}<br/><span className="text-[9px] font-bold text-slate-400 uppercase">{t.sekolah}</span></td>
                <td className="px-10 py-5 font-mono text-[#3B82F6] font-bold text-xs">{t.username}</td>
                <td className="px-10 py-5">
                 <div className="flex flex-col items-start gap-1">
                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${PLANS[t.plan || 'plus']?.color || 'bg-slate-800 text-slate-400'} ${PLANS[t.plan || 'plus']?.border || 'border-slate-700'}`}>
                     {PLANS[t.plan || 'plus']?.label || 'Plus'}
                   </span>
                   {t.expiredAt && (
                     <span className="text-[8px] font-bold text-slate-400 uppercase">
                       Exp: {new Date(t.expiredAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                     </span>
                   )}
                 </div>
                </td>
                <td className="px-10 py-5 text-right"><button onClick={()=>deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'registry', t.id))} className="text-red-400 hover:text-red-600 p-2 transition-colors"><Trash2 size={16}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', desc: '', image: '' });

  useEffect(() => {
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'gallery'));
    return onSnapshot(q, (snap) => setItems(snap.docs.map(d => ({id: d.id, ...d.data()}))));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressedBase64 = await compressImage(file, 600, 0.5);
      setForm({...form, image: compressedBase64});
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.image) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'gallery'), {
      ...form,
      createdAt: serverTimestamp()
    });
    setForm({ title: '', desc: '', image: '' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0F172A] p-8 rounded-[2.5rem] border border-blue-500/30 shadow-[0_0_20px_rgba(0,51,102,0.5)]">
        <h2 className="text-[10px] font-black uppercase mb-6 tracking-widest text-slate-300 flex items-center gap-2"><ImageIcon size={14} className="text-[#FF8C00]"/> Tambah Foto Galeri</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="px-5 py-4 bg-[#003366]/50 rounded-2xl text-xs font-bold border border-blue-500/30 outline-none focus:ring-2 focus:ring-[#FF8C00] transition-all text-white placeholder-slate-400" placeholder="Judul Dokumentasi" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
          <input className="px-5 py-4 bg-[#003366]/50 rounded-2xl text-xs font-bold border border-blue-500/30 outline-none focus:ring-2 focus:ring-[#FF8C00] transition-all text-white placeholder-slate-400" placeholder="Deskripsi Singkat" value={form.desc} onChange={e=>setForm({...form, desc:e.target.value})} required />
          <input type="file" accept="image/*" onChange={handleUpload} className="block w-full text-[10px] text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[#0F172A] file:text-[#FF8C00] hover:file:bg-[#003366] transition-all cursor-pointer bg-[#003366]/50 border border-blue-500/30 rounded-2xl" required />
          <button className="bg-[#FF8C00] text-white font-black rounded-2xl text-[10px] uppercase shadow-[0_0_15px_rgba(255,140,0,0.4)] hover:bg-[#FFA726] transition-all active:scale-95">Unggah Foto</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-[#0F172A] p-4 rounded-[2rem] border border-blue-500/30 hover:shadow-[0_0_15px_rgba(255,140,0,0.4)] hover:border-[#FF8C00] transition-all group relative overflow-hidden flex flex-col">
            <div className="w-full h-32 bg-slate-900 rounded-[1.5rem] mb-4 overflow-hidden border border-slate-800">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-black text-white text-sm px-2 uppercase line-clamp-1">{item.title}</h3>
            <p className="text-slate-400 text-[10px] font-bold px-2 mt-1 uppercase line-clamp-2 mb-4">{item.desc}</p>
            <div className="mt-auto pt-2 border-t border-blue-500/30 px-2 flex justify-end">
              <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'gallery', item.id))} className="text-red-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
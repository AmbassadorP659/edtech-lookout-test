import React, { useState, useEffect, useRef, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  updateDoc
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  Trash2,
  Globe,
  Lock,
  X,
  MessageSquare,
  Eye,
  Search as SearchIcon,
  Check,
  ShieldCheck,
  Filter,
  Rocket,
  Compass,
  Plus,
  ChevronDown
} from 'lucide-react';

// --- Firebase Configuration ---
// These globals are provided by the environment
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'edtech-lookout-v1-7';

// Admin Key for Curator Features
const ADMIN_SECRET = "pirkl"; 

const EducatorNote = ({ note }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollHeight > textRef.current.offsetHeight);
    }
  }, [note]);

  if (!note) return null;

  return (
    <div className="relative mt-4 mb-6 pt-3 px-1 group/note">
      {/* Visual Tape Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-5 bg-white/40 backdrop-blur-[1px] border border-white/20 rotate-[-2deg] z-10 shadow-sm pointer-events-none" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%)' }} />
      
      <div 
        onClick={() => (isOverflowing || isExpanded) && setIsExpanded(!isExpanded)}
        className={`bg-gradient-to-br from-[#FFFDE7] to-[#FFF9C4] p-4 rounded-sm shadow-md transition-all duration-300 rotate-[-1deg] group-hover/note:rotate-0 font-lexend ${isOverflowing || isExpanded ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex items-center gap-1.5 text-[#5D4037] mb-2">
          <MessageSquare size={12} />
          <span className="text-[10px] font-black uppercase tracking-wider">Educator Note</span>
        </div>
        <p ref={textRef} className={`text-[14px] text-[#3E2723] font-medium leading-relaxed italic ${!isExpanded ? 'line-clamp-2' : ''}`}>
          "{note}"
        </p>
        {isOverflowing && !isExpanded && (
          <div className="mt-1 text-[10px] font-bold text-[#8D6E63] flex justify-end">Read More...</div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  
  const [adminMode, setAdminMode] = useState(false);
  const [viewMode, setViewMode] = useState('live'); 
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInput, setAuthInput] = useState('');
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [selectedSubmissionTags, setSelectedSubmissionTags] = useState([]);

  // Auth Management
  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  // Data Listeners
  useEffect(() => {
    if (!user) return;

    // RULE 1: Strict collection paths
    const tagsRef = collection(db, 'artifacts', appId, 'public', 'data', 'categories');
    const linksRef = collection(db, 'artifacts', appId, 'public', 'data', 'links');

    const unsubTags = onSnapshot(query(tagsRef), (snap) => {
      setTags(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => a.name.localeCompare(b.name)));
    }, (err) => console.error(err));

    const unsubLinks = onSnapshot(query(linksRef), (snap) => {
      setResources(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => console.error(err));

    return () => { unsubTags(); unsubLinks(); };
  }, [user]);

  const filteredResources = useMemo(() => {
    let result = resources.filter(res => {
      const matchesStatus = viewMode === 'live' ? res.approved : !res.approved;
      const matchesSearch = (res.title + res.notes).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedFilters.length === 0 || res.categories?.some(c => selectedFilters.includes(c));
      return matchesStatus && matchesSearch && matchesTags;
    });

    if (sortBy === 'newest') return result.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return result.sort((a, b) => a.title.localeCompare(b.title));
  }, [resources, viewMode, searchTerm, selectedFilters, sortBy]);

  const handleSubmission = async (e) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'links'), {
      title: newTitle,
      url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
      notes: newNotes,
      categories: selectedSubmissionTags,
      approved: adminMode,
      timestamp: Date.now(),
      submittedBy: user.uid
    });
    
    setShowSubmissionModal(false);
    setNewTitle(''); setNewUrl(''); setNewNotes(''); setSelectedSubmissionTags([]);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white font-lexend">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-800 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading the Lookout...</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col font-lexend overflow-hidden selection:bg-blue-100">
      
      {/* Header */}
      <header className="px-8 py-5 bg-white border-b flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-800 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-[-1deg]">
            <Eye size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#0F172A] tracking-tight">The EdTech Lookout</h1>
            <span className="text-[9px] text-blue-600 font-black uppercase tracking-widest">Maine Educator Resources</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSubmissionModal(true)}
            className="px-5 py-2.5 bg-blue-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md hover:bg-blue-700 transition-all"
          >
            Share Discovery
          </button>
          <button 
            onClick={() => adminMode ? setAdminMode(false) : setShowAuthModal(true)}
            className={`p-2.5 rounded-xl transition-all ${adminMode ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            {adminMode ? <ShieldCheck size={18} /> : <Lock size={18} />}
          </button>
        </div>
      </header>

      {/* Tags Filter Bar */}
      <div className="px-8 py-4 bg-white border-b flex items-center gap-4 shrink-0 overflow-x-auto no-scrollbar">
        <Filter size={14} className="text-slate-400 shrink-0" />
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => setSelectedFilters(prev => prev.includes(tag.name) ? prev.filter(t => t !== tag.name) : [...prev, tag.name])}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border ${
              selectedFilters.includes(tag.name) ? 'bg-blue-800 border-blue-800 text-white' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm"
                placeholder="Search tools, strategies, or subjects..."
              />
            </div>
            <select 
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 bg-white border border-slate-200 rounded-2xl font-black text-[9px] uppercase tracking-widest text-slate-500"
            >
              <option value="newest">Latest Added</option>
              <option value="alpha">A-Z</option>
            </select>
          </div>

          {adminMode && (
            <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl w-fit">
              <button onClick={() => setViewMode('live')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'live' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-500'}`}>Live Directory</button>
              <button onClick={() => setViewMode('pending')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'pending' ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-500'}`}>In Review</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {filteredResources.map(res => (
              <div key={res.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-slate-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Globe size={20} />
                  </div>
                  <div className="flex flex-wrap justify-end gap-1 max-w-[60%]">
                    {res.categories?.map(cat => (
                      <span key={cat} className="px-2 py-0.5 bg-slate-100 text-[8px] font-black text-slate-500 rounded-md uppercase tracking-wider">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight">{res.title}</h3>
                <EducatorNote note={res.notes} />

                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                  <a href={res.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-800 font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform">
                    Explore <Rocket size={12} />
                  </a>
                  {adminMode && (
                    <div className="flex gap-1">
                      {viewMode === 'pending' && (
                        <button onClick={() => updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'links', res.id), { approved: true })} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100"><Check size={14} /></button>
                      )}
                      <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'links', res.id))} className="p-1.5 bg-rose-50 text-rose-600 rounded-md hover:bg-rose-100"><Trash2 size={14} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl p-8 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-black text-slate-900">Share Discovery</h2>
              <button onClick={() => setShowSubmissionModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            <input required value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border rounded-xl outline-none text-sm font-medium" placeholder="Title of the tool or resource" />
            <input required value={newUrl} onChange={e => setNewUrl(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border rounded-xl outline-none text-sm font-medium" placeholder="Website URL" />
            <textarea value={newNotes} onChange={e => setNewNotes(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border rounded-xl outline-none text-sm font-medium h-24" placeholder="How can educators use this effectively?" />
            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <button key={tag.id} type="button" onClick={() => setSelectedSubmissionTags(prev => prev.includes(tag.name) ? prev.filter(t => t !== tag.name) : [...prev, tag.name])} className={`px-3 py-1.5 rounded-lg text-[9px] font-bold ${selectedSubmissionTags.includes(tag.name) ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-500'}`}>{tag.name}</button>
              ))}
            </div>
            <button onClick={handleSubmission} className="w-full py-4 bg-blue-800 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all">Submit to Lookout</button>
          </div>
        </div>
      )}

      {/* Curator Access Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[1.5rem] p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-black mb-4">Curator Access</h3>
            <input type="password" value={authInput} onChange={e => setAuthInput(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl mb-4 outline-none focus:ring-2 focus:ring-blue-100" placeholder="Enter Access Key" />
            <div className="flex gap-2">
               <button onClick={() => setShowAuthModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-[10px] uppercase">Cancel</button>
               <button onClick={() => { if(authInput === ADMIN_SECRET){setAdminMode(true);setShowAuthModal(false);} setAuthInput(''); }} className="flex-1 py-3 bg-blue-800 text-white rounded-xl font-black text-[10px] uppercase">Verify</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

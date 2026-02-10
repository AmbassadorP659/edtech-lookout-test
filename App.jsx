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
  writeBatch,
  updateDoc,
  getDocs,
  setDoc,
  getDoc
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  Trash2,
  Cpu,
  Globe,
  Lock,
  X,
  Edit3,
  FileText,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  MessageSquare,
  Sparkles,
  ScanEye,
  Search as SearchIcon,
  Check,
  CalendarClock,
  ShieldCheck,
  CheckSquare,
  Square,
  PlusCircle,
  MinusCircle,
  ArrowDownAZ,
  ChevronDown,
  Filter,
  Tags,
  CheckCircle,
  Download,
  Upload,
  Link2,
  Database,
  Calendar,
  Plus,
  Video,
  Info,
  Rocket,
  Compass
} from 'lucide-react';




/**
 * VERSION: Lookout V2.7
 * DESCRIPTION: Updated Share Discovery form labels to 13px font size.
 */




// --- Firebase Configuration & Initialization ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'edtech-lookout-v6';




const ADMIN_SECRET = "pirkl";
const PERMANENT_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQIowIxryUrmvwrUCO9Y_Rc8oeNp9sA1cFaqEPheVQO9QxjGfAp15PhidjZCNXBVzhkQOCgjqAnxdue/pub?gid=1701335740&single=true&output=csv";




const fetchCSVData = async (url) => {
  const cacheBuster = `&t=${Date.now()}`;
  try {
    const response = await fetch(url + cacheBuster);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.text();
  } catch (err) {
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url + cacheBuster)}`;
      const proxyResponse = await fetch(proxyUrl);
      if (!proxyResponse.ok) throw new Error("Proxy fetch failed");
      const data = await proxyResponse.json();
      return data.contents;
    } catch (proxyErr) {
       const proxyUrl2 = `https://corsproxy.io/?${encodeURIComponent(url + cacheBuster)}`;
       const response2 = await fetch(proxyUrl2);
       if (!response2.ok) throw new Error("Secondary proxy failed");
       return await response2.text();
    }
  }
};




const getResourceMetadata = (url, override) => {
  if (override) {
    if (override === 'Youtube' || override === 'Video') return { iconName: override, color: 'text-red-700', type: 'Video' };
    if (override === 'FileText') return { iconName: 'FileText', color: 'text-slate-600', type: 'Document' };
    if (override === 'Globe') return { iconName: 'Globe', color: 'text-blue-800', type: 'Official' };
    if (override === 'Instagram') return { iconName: 'Instagram', color: 'text-pink-700', type: 'Reel' };
    if (override === 'Facebook') return { iconName: 'Facebook', color: 'text-blue-800', type: 'Social' };
    if (override === 'Linkedin') return { iconName: 'Linkedin', color: 'text-blue-900', type: 'Professional' };
  }
  if (!url) return { iconName: 'Globe', color: 'text-blue-800', type: 'Official' };
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return { iconName: 'Youtube', color: 'text-red-700', type: 'Video' };
  if (lowerUrl.includes('instagram.com')) return { iconName: 'Instagram', color: 'text-pink-700', type: 'Reel' };
  if (lowerUrl.includes('facebook.com')) return { iconName: 'Facebook', color: 'text-blue-800', type: 'Social' };
  if (lowerUrl.includes('linkedin.com')) return { iconName: 'Linkedin', color: 'text-blue-900', type: 'Professional' };
  if (lowerUrl.includes('google.com') || lowerUrl.includes('google/')) return { iconName: 'Globe', color: 'text-emerald-800', type: 'Official' };
  if (lowerUrl.includes('canva.com') || lowerUrl.includes('canva.site')) return { iconName: 'Sparkles', color: 'text-indigo-800', type: 'Design' };
  return { iconName: 'Globe', color: 'text-blue-800', type: 'Official' };
};




const IconRenderer = ({ name, size = 16, className = "" }) => {
  const icons = { FileText, Youtube, Instagram, Facebook, Linkedin, Globe, Sparkles, Video };
  const IconComponent = icons[name] || Globe;
  return <IconComponent size={size} className={className} />;
};




const EducatorNote = ({ note }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);




  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;
      setIsOverflowing(element.scrollHeight > element.offsetHeight);
    }
  }, [note]);




  if (!note) return null;




  const toggleNote = (e) => {
    if (!isOverflowing && !isExpanded) return;
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };




  return (
    <div className="relative mt-4 mb-6 pt-3 px-1 group/note">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-5 bg-white/40 backdrop-blur-[1px] border border-white/20 rotate-[-2deg] z-10 shadow-sm pointer-events-none" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%)' }} />
      <div
        onClick={toggleNote}
        className={`bg-gradient-to-br from-[#FFFDE7] to-[#FFF9C4] p-4 rounded-sm shadow-[2px_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 rotate-[-1deg] group-hover/note:rotate-0 font-lexend ${isOverflowing || isExpanded ? 'cursor-pointer hover:shadow-[4px_6px_16px_rgba(0,0,0,0.12)]' : 'cursor-default'} `}
      >
        <div className="flex items-center gap-1.5 text-[#5D4037] mb-2 pointer-events-none">
          <MessageSquare size={12} className="fill-amber-800/30"/>
          <span className="text-[10px] font-black uppercase tracking-wider">Educator Note</span>
        </div>
        <p
          ref={textRef}
          className={`text-[14px] text-[#3E2723] font-medium leading-relaxed italic pointer-events-none ${!isExpanded ? 'line-clamp-2' : ''}`}
        >
          "{note}"
        </p>
        {(isOverflowing || isExpanded) && (
          <div className="text-[#5D4037] group-hover/note:text-black text-[11px] font-bold mt-2 flex items-center gap-1 transition-colors underline decoration-solid decoration-amber-800/20">
            {isExpanded ? (
              <>Collapse note <MinusCircle size={10} /></>
            ) : (
              <>Expand note <PlusCircle size={10} /></>
            )}
          </div>
        )}
      </div>
    </div>
  );
};




function parseCSV(text) {
  if (!text) return [];
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (char === '"' && inQuotes && nextChar === '"') { currentField += '"'; i++; }
    else if (char === '"') { inQuotes = !inQuotes; }
    else if (char === ',' && !inQuotes) { currentRow.push(currentField.trim()); currentField = ''; }
    else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (currentField || currentRow.length > 0) { currentRow.push(currentField.trim()); rows.push(currentRow); currentField = ''; currentRow = []; }
      if (char === '\r' && nextChar === '\n') i++;
    } else { currentField += char; }
  }
  if (currentField || currentRow.length > 0) { currentRow.push(currentField.trim()); rows.push(currentRow); }
  return rows;
}




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
  const [selectedIds, setSelectedIds] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState('');
  const [passError, setPassError] = useState(false);
  const [publishedCsvUrl, setPublishedCsvUrl] = useState(PERMANENT_CSV_URL);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showBulkTagModal, setShowBulkTagModal] = useState(false);
  const [showCsvToolsModal, setShowCsvToolsModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [customTagInput, setCustomTagInput] = useState('');
  const [selectedSubmissionTags, setSelectedSubmissionTags] = useState([]);
  const [iconOverride, setIconOverride] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);
  const [isSubmissionTagDropdownOpen, setIsSubmissionTagDropdownOpen] = useState(false);
 
  // State for onboarding animation
  const [shouldAnimateOnboarding, setShouldAnimateOnboarding] = useState(false);




  const resourcesRef = useRef([]);
  const tagsRef = useRef([]);
  const dropdownRef = useRef(null);
  const submissionDropdownRef = useRef(null);
  const fileInputRef = useRef(null);




  useEffect(() => { resourcesRef.current = resources; }, [resources]);
  useEffect(() => { tagsRef.current = tags; }, [tags]);




  // Session-based animation logic
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcomeAnimation');
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setShouldAnimateOnboarding(true);
        sessionStorage.setItem('hasSeenWelcomeAnimation', 'true');
      }, 1000); // 1s delay
      return () => clearTimeout(timer);
    }
  }, []);




  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTagsDropdownOpen(false);
      }
      if (submissionDropdownRef.current && !submissionDropdownRef.current.contains(event.target)) {
        setIsSubmissionTagDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);




  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const style = document.createElement('style');
    style.innerHTML = `
      body, button, input, textarea, select { font-family: 'Lexend', sans-serif !important; }
     
      @keyframes softPulse {
        0% {
          transform: scale(1);
          background-color: rgb(248, 250, 252);
          border-color: rgb(148, 163, 184); /* Slate-400 equivalent for bolder look */
          color: rgb(30, 58, 138); /* Blue-900 equivalent */
        }
        50% {
          transform: scale(1.15);
          background-color: white;
          border-color: rgb(16, 185, 129); /* Emerald-500 */
          color: rgb(5, 150, 105); /* Emerald-600 */
        }
        100% {
          transform: scale(1);
          background-color: rgb(248, 250, 252);
          border-color: rgb(148, 163, 184);
          color: rgb(30, 58, 138);
        }
      }




      @keyframes iconPulse {
        0% { background-color: white; border-color: rgb(241, 245, 249); color: inherit; }
        50% { background-color: rgb(236, 253, 245); border-color: rgb(209, 250, 229); color: rgb(5, 150, 105); }
        100% { background-color: white; border-color: rgb(241, 245, 249); color: inherit; }
      }




      @keyframes labelPulse {
        0% { color: rgb(71, 85, 105); }
        50% { color: rgb(16, 185, 129); }
        100% { color: rgb(71, 85, 105); }
      }




      @keyframes startPulse {
        0% { color: rgb(30, 58, 138); }
        50% { color: rgb(4, 120, 87); }
        100% { color: rgb(30, 58, 138); }
      }




      .onboarding-pulse {
        animation: softPulse 1.2s ease-in-out;
      }
      .onboarding-pulse-icon {
        animation: iconPulse 1.2s ease-in-out;
      }
      .onboarding-pulse-label {
        animation: labelPulse 1.2s ease-in-out;
      }
      .onboarding-pulse-start {
        animation: startPulse 1.2s ease-in-out;
      }




      @media (prefers-reduced-motion: reduce) {
        .onboarding-pulse, .onboarding-pulse-icon, .onboarding-pulse-label, .onboarding-pulse-start {
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);




  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else { await signInAnonymously(auth); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);




  useEffect(() => {
    if (!user || loading) return;
    const syncData = async () => {
      try {
        const text = await fetchCSVData(publishedCsvUrl);
        await processIncomingCsv(text);
      } catch (err) {
        console.error("Auto-sync failed:", err);
      }
    };
    syncData();
    const interval = setInterval(syncData, 300000);
    return () => clearInterval(interval);
  }, [user, loading, publishedCsvUrl]);




  useEffect(() => {
    if (!user) return;
    const configDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'config', 'appSettings');
    onSnapshot(configDocRef, (docSnap) => {
      if (docSnap.exists()) setPublishedCsvUrl(docSnap.data().publishedCsvUrl || PERMANENT_CSV_URL);
      else setDoc(configDocRef, { publishedCsvUrl: PERMANENT_CSV_URL });
    });
    onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'categories')), (s) => {
      setTags(s.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'links')), (s) => {
      setResources(s.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, [user]);




  const processIncomingCsv = async (text) => {
    const parsedRows = parseCSV(text);
    const batch = writeBatch(db);
    const existingUrls = new Set(resourcesRef.current.map(r => r.url));
    const existingTags = new Set(tagsRef.current.map(t => t.name));
    let addedCount = 0;




    parsedRows.slice(1).forEach(row => {
      const [title, link, catsStr, notes, dateVal] = row;
      if (link && !existingUrls.has(link)) {
        let finalTimestamp = Date.now();
        if (dateVal) {
          const parsedDate = new Date(dateVal);
          if (!isNaN(parsedDate.getTime())) finalTimestamp = parsedDate.getTime();
        }
        const rowCats = catsStr ? catsStr.split(/[,;|]/).map(c => c.trim()).filter(Boolean) : [];
        rowCats.forEach(catName => {
          if (catName && !existingTags.has(catName)) {
            batch.set(doc(collection(db, 'artifacts', appId, 'public', 'data', 'categories')), { name: catName });
            existingTags.add(catName);
          }
        });
        batch.set(doc(collection(db, 'artifacts', appId, 'public', 'data', 'links')), {
          title: title || 'Untitled Discovery',
          url: link,
          categories: rowCats,
          notes: notes || '',
          timestamp: finalTimestamp,
          approved: true
        });
        addedCount++;
      }
    });
    if (addedCount > 0) await batch.commit();
    return addedCount;
  };




  const handleExportCSV = () => {
    const headers = ['Title', 'Link', 'Tags', 'Notes', 'Date', 'Status'];
    const rows = resources.map(r => [
      `"${(r.title || '').replace(/"/g, '""')}"`,
      `"${(r.url || '').replace(/"/g, '""')}"`,
      `"${(r.categories || []).join(', ').replace(/"/g, '""')}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      `"${formatDate(r.timestamp)}"`,
      r.approved ? 'Approved' : 'Pending'
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lookout_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };




  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      await processIncomingCsv(text);
    };
    reader.readAsText(file);
  };




  const updatePublishedUrl = async () => {
    const newUrl = prompt("Enter the Published CSV URL from Google Sheets:", publishedCsvUrl);
    if (newUrl && newUrl !== publishedCsvUrl) {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'config', 'appSettings'), { publishedCsvUrl: newUrl });
      setPublishedCsvUrl(newUrl);
    }
  };




  const categoryCounts = useMemo(() => {
    const counts = {};
    resources.forEach(r => {
      if (r.approved && r.categories) {
        r.categories.forEach(cat => { counts[cat] = (counts[cat] || 0) + 1; });
      }
    });
    return counts;
  }, [resources]);




  const processedResources = useMemo(() => {
    let list = resources.filter(r => {
      const isCorrectStatus = viewMode === 'live' ? r.approved : !r.approved;
      const matchesFilter = selectedFilters.length === 0 || r.categories?.some(c => selectedFilters.includes(c));
      const matchesSearch = (r.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (r.notes || "").toLowerCase().includes(searchTerm.toLowerCase());
      return isCorrectStatus && matchesFilter && matchesSearch;
    });
    return sortBy === 'newest' ? list.sort((a,b) => b.timestamp - a.timestamp) : list.sort((a,b) => (a.title || "").localeCompare(b.title || ""));
  }, [resources, selectedFilters, searchTerm, sortBy, viewMode]);




  const toggleFilter = (tag) => {
    setSelectedFilters(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };




  const handleBulkApprove = async () => {
    const batch = writeBatch(db);
    selectedIds.forEach(id => batch.update(doc(db, 'artifacts', appId, 'public', 'data', 'links', id), { approved: true }));
    await batch.commit();
    setSelectedIds([]);
  };




  const handleBulkDelete = async () => {
    const batch = writeBatch(db);
    selectedIds.forEach(id => batch.delete(doc(db, 'artifacts', appId, 'public', 'data', 'links', id)));
    await batch.commit();
    setSelectedIds([]);
  };




  const handleBulkTagUpdate = async () => {
    if (selectedIds.length === 0) return;
    const batch = writeBatch(db);
    selectedIds.forEach(id => {
      batch.update(doc(db, 'artifacts', appId, 'public', 'data', 'links', id), { categories: selectedSubmissionTags });
    });
    await batch.commit();
    setShowBulkTagModal(false);
    setSelectedIds([]);
    resetForm();
  };




  const handleSingleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'links', id));
    setSelectedIds(prev => prev.filter(x => x !== id));
  };




  const handleSingleApprove = async (e, id) => {
    e.stopPropagation();
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'links', id), { approved: true });
  };




  const handleSingleEdit = (e, res) => {
    e.stopPropagation();
    setEditingId(res.id);
    setNewTitle(res.title);
    setNewUrl(res.url);
    setNewNotes(res.notes);
    setSelectedSubmissionTags(res.categories || []);
    setIconOverride(res.iconOverride || null);
    setShowSubmissionModal(true);
  };




  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const selectAll = () => setSelectedIds(selectedIds.length === processedResources.length && processedResources.length > 0 ? [] : processedResources.map(r => r.id));




  const handleUpsert = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    const existingTagNames = tags.map(t => t.name.toLowerCase());
    for (const tag of selectedSubmissionTags) {
        if (!existingTagNames.includes(tag.toLowerCase())) {
            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'categories'), { name: tag });
        }
    }
    const data = {
      title: newTitle,
      url: newUrl,
      notes: newNotes,
      categories: selectedSubmissionTags,
      approved: adminMode,
      iconOverride: iconOverride || null,
      timestamp: editingId ? (resources.find(r => r.id === editingId)?.timestamp || Date.now()) : Date.now()
    };
    if (editingId) await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'links', editingId), data);
    else await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'links'), data);
    setShowSubmissionModal(false);
    resetForm();
    setIsAdding(false);
  };




  const handleAddCustomTag = () => {
    if (!customTagInput.trim()) return;
    const cleaned = customTagInput.trim();
    if (!selectedSubmissionTags.includes(cleaned)) {
        setSelectedSubmissionTags(prev => [...prev, cleaned]);
    }
    setCustomTagInput('');
  };




  const resetForm = () => {
    setEditingId(null);
    setNewTitle('');
    setNewUrl('');
    setNewNotes('');
    setSelectedSubmissionTags([]);
    setCustomTagInput('');
    setIconOverride(null);
  };
 
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };




  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Cpu className="animate-spin text-blue-800" /></div>;




  return (
    <div className="h-screen bg-slate-50 flex flex-col font-lexend overflow-hidden text-[#1E293B]">
      {/* HEADER SECTION */}
      <div className="shrink-0 z-50 shadow-sm border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <header className="px-6 py-5 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 shrink-0">
              <div className="bg-blue-800 p-3 rounded-2xl text-white shadow-md"><ScanEye size={24} /></div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#0F172A]">The EdTech Lookout</h1>
                <span className="text-[11px] text-[#475569] font-black uppercase tracking-widest block mt-1">Maine Educator's Innovation Hub</span>
              </div>
            </div>




            {/* START HERE BUTTON */}
            <div className="hidden lg:flex flex-1 justify-center px-4">
              <button
                onClick={() => setShowOnboardingModal(true)}
                className={`flex items-center gap-3 px-5 py-2.5 bg-slate-50 border-2 border-slate-300 text-blue-900 rounded-2xl hover:bg-white hover:border-emerald-300 hover:text-emerald-700 hover:shadow-sm transition-all duration-300 group ${shouldAnimateOnboarding ? 'onboarding-pulse' : ''}`}
              >
                <div className={`bg-white p-2 rounded-xl border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors ${shouldAnimateOnboarding ? 'onboarding-pulse-icon' : ''}`}>
                  <Compass size={18} className="group-hover:text-emerald-600" />
                </div>
                <div className="text-center leading-tight">
                  <p className={`text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-500 text-center ${shouldAnimateOnboarding ? 'onboarding-pulse-label' : ''}`}>New to the Lookout?</p>
                  <p className={`text-[11px] font-black uppercase tracking-wider text-blue-900 group-hover:text-emerald-700 text-center ${shouldAnimateOnboarding ? 'onboarding-pulse-start' : ''}`}>Start Here</p>
                </div>
              </button>
            </div>




            <div className="flex items-center gap-3 shrink-0">
              {adminMode && (
                <div className="flex bg-slate-100 p-1 rounded-xl mr-2">
                  <button onClick={() => {setViewMode('live'); setSelectedIds([]);}} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 transition-all ${viewMode === 'live' ? 'bg-white shadow-sm text-blue-900' : 'text-[#475569]'}`}><Globe size={14} /> Live</button>
                  <button onClick={() => {setViewMode('moderation'); setSelectedIds([]);}} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 transition-all relative ${viewMode === 'moderation' ? 'bg-white shadow-sm text-amber-900' : 'text-[#475569]'}`}><ShieldCheck size={14} /> Queue</button>
                </div>
              )}
              <button onClick={() => { resetForm(); setShowSubmissionModal(true); }} className="px-6 py-3 rounded-2xl text-xs font-black bg-blue-800 text-white shadow-md hover:bg-blue-900 uppercase tracking-widest transition-all hover:scale-[1.02]">Share Discovery</button>
              {adminMode ? <button onClick={() => setAdminMode(false)} className="px-3 py-1.5 bg-amber-100 text-amber-900 text-[10px] font-black rounded-lg border border-amber-300 uppercase">Admin Off</button> : <button onClick={() => setShowAuthModal(true)} className="text-slate-400 hover:text-black p-2 transition-colors"><Lock size={18}/></button>}
            </div>
          </header>




          {/* Mobile Start Here Button */}
          <div className="lg:hidden px-6 pb-4">
             <button
                onClick={() => setShowOnboardingModal(true)}
                className={`w-full flex items-center justify-center gap-4 px-5 py-3 bg-slate-50 border-2 border-slate-300 text-blue-900 rounded-xl ${shouldAnimateOnboarding ? 'onboarding-pulse' : ''}`}
              >
                <Compass size={18} />
                <div className="text-center leading-tight">
                  <p className={`text-[9px] font-black uppercase tracking-widest text-slate-500 text-center ${shouldAnimateOnboarding ? 'onboarding-pulse-label' : ''}`}>New to the Lookout?</p>
                  <p className={`text-[10px] font-black uppercase tracking-wider text-blue-900 text-center ${shouldAnimateOnboarding ? 'onboarding-pulse-start' : ''}`}>Start Here</p>
                </div>
              </button>
          </div>




          {adminMode && (
            <div className="bg-[#0F172A] px-6 py-3 flex items-center justify-between text-white border-t border-white/10 rounded-t-2xl mx-4 lg:mx-0">
              <div className="flex items-center gap-6">
                <button onClick={selectAll} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-blue-300 transition-colors">
                  {selectedIds.length === processedResources.length && processedResources.length > 0 ? <CheckSquare size={16} className="text-blue-400" /> : <Square size={16} />}
                  {selectedIds.length === processedResources.length && processedResources.length > 0 ? 'Deselect All' : 'Select Page'}
                </button>
                <div className="h-4 w-px bg-white/10 mx-2" />
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions:</span>
                  <button onClick={() => setShowCsvToolsModal(true)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 transition-all">
                    <Database size={12} /> Data Tools
                  </button>
                  {selectedIds.length > 0 && (
                    <button onClick={() => { resetForm(); setShowBulkTagModal(true); }} className="px-3 py-1.5 bg-blue-900/40 border border-blue-400/30 text-blue-100 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 hover:bg-blue-900/60 transition-all">
                      <Tags size={12} /> Tag {selectedIds.length} Selected
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {viewMode === 'moderation' && (
                  <button onClick={handleBulkApprove} disabled={selectedIds.length === 0} className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-emerald-600 disabled:opacity-40 transition-all">
                    Approve Selected
                  </button>
                )}
                <button onClick={handleBulkDelete} disabled={selectedIds.length === 0} className="p-2.5 bg-rose-800 hover:bg-rose-700 text-white rounded-xl disabled:opacity-40 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}




          {/* FILTERING TOOLBAR */}
          <div className="px-6 py-4 flex flex-col gap-4 border-t border-slate-100">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full flex items-center gap-3">
                <div className="shrink-0 bg-blue-50 border border-blue-100 px-4 py-3 rounded-2xl flex items-center gap-2 shadow-sm">
                  <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Resources</span>
                  <span className="text-sm font-black text-blue-800">{processedResources.length}</span>
                </div>
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569]" size={18} />
                  <input className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-100 placeholder-[#64748B] text-[#1E293B] font-medium transition-all" placeholder="Search curated tools..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
              </div>




              <div className="relative w-full md:w-auto" ref={dropdownRef}>
                <button onClick={() => setIsTagsDropdownOpen(!isTagsDropdownOpen)} className={`w-full md:w-64 px-5 py-3 border rounded-2xl text-xs font-black uppercase flex items-center justify-between transition-all shadow-sm ${selectedFilters.length > 0 ? 'bg-blue-50 border-blue-400 text-blue-900' : 'bg-white border-slate-200 text-[#334155] hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-2">
                    <Tags size={16} className={selectedFilters.length > 0 ? 'text-blue-800' : 'text-[#64748B]'} />
                    <span>{selectedFilters.length > 0 ? `${selectedFilters.length} Tags` : 'Filter Tags'}</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isTagsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isTagsDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-[100] max-h-80 overflow-y-auto p-1.5 scrollbar-thin">
                    <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between mb-1">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Available Tags</span>
                      {selectedFilters.length > 0 && (
                        <button onClick={() => setSelectedFilters([])} className="text-[9px] font-black uppercase text-rose-600 hover:text-rose-800 transition-colors">Reset</button>
                      )}
                    </div>
                    {tags.sort((a,b) => a.name.localeCompare(b.name)).map(tag => {
                      const count = categoryCounts[tag.name] || 0;
                      const isSelected = selectedFilters.includes(tag.name);
                      return (
                        <button key={tag.id} onClick={() => toggleFilter(tag.name)} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all mb-0.5 ${isSelected ? 'bg-blue-800 text-white' : 'hover:bg-slate-50 text-[#334155]'}`}>
                          <span>{tag.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-blue-900/40 text-blue-100' : 'bg-slate-100 text-slate-500 font-black'}`}>{count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>




              <button onClick={() => setSortBy(sortBy === 'newest' ? 'alphabetical' : 'newest')} className="px-5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase text-[#334155] flex items-center gap-2 hover:bg-slate-50 whitespace-nowrap shadow-sm">
                {sortBy === 'newest' ? <CalendarClock size={16} className="text-blue-800" /> : <ArrowDownAZ size={16} className="text-blue-800" />} {sortBy === 'newest' ? 'Recent' : 'A-Z'}
              </button>
            </div>
          </div>
        </div>
      </div>




      {/* SCROLLABLE CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-6 bg-slate-100 shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto gap-8">
          {processedResources.map(res => {
            const meta = getResourceMetadata(res.url, res.iconOverride);
            const isSelected = selectedIds.includes(res.id);
            return (
              <div
                key={res.id}
                onClick={() => adminMode && toggleSelect(res.id)}
                className={`bg-white border rounded-[2.5rem] p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col relative cursor-pointer group ${isSelected ? 'ring-4 ring-blue-800' : 'border-slate-200'}`}
              >
                {adminMode && (
                  <div className="absolute top-5 right-5 z-10">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-blue-800 border-blue-800 text-white' : 'bg-white border-slate-300 text-transparent'}`}>
                      <Check size={14} strokeWidth={4} />
                    </div>
                  </div>
                )}
                <div className="flex gap-4 mb-3 pr-8">
                  <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 ${meta.color} shadow-sm border border-slate-100`}><IconRenderer name={meta.iconName} size={20} /></div>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener"
                    onClick={e => e.stopPropagation()}
                    className="font-bold text-[#0F172A] leading-tight text-[22px] group-hover:underline group-hover:text-blue-800 transition-all underline-offset-4 decoration-2 decoration-blue-800/30"
                  >
                    {res.title || "Untitled Discovery"}
                  </a>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {res.categories?.map((c, i) => (
                    <span key={i} className="text-[10px] uppercase font-black text-[#1E3A8A] bg-blue-100 px-2.5 py-1 rounded-md tracking-wider">{c}</span>
                  ))}
                </div>
                <EducatorNote note={res.notes} />
                <div className="mt-auto pt-5 border-t border-slate-100 flex justify-between items-center text-[10px] font-black uppercase text-[#64748B]">
                  <span className="flex items-center gap-1.5 tracking-widest">
                    <Calendar size={12} className="text-blue-800/60" />
                    {formatDate(res.timestamp)}
                  </span>
                  {adminMode && (
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      {!res.approved && (
                        <button onClick={(e) => handleSingleApprove(e, res.id)} className="p-2 text-emerald-800 hover:bg-emerald-50 rounded-lg">
                          <Check size={16} />
                        </button>
                      )}
                      <button onClick={(e) => handleSingleEdit(e, res)} className="text-slate-400 hover:text-blue-800 p-2 rounded-lg"><Edit3 size={16}/></button>
                      <button onClick={(e) => handleSingleDelete(e, res.id)} className="text-slate-400 hover:text-rose-800 p-2 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>




      {/* ONBOARDING MODAL */}
      {showOnboardingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-[#F8FAFC]">
               <div className="flex items-center gap-4">
                  <div className="bg-[#E8F5E9] p-3 rounded-2xl text-[#2E7D32] shadow-sm"><Compass size={24} /></div>
                  <h2 className="text-xl font-black text-[#0F172A] tracking-tight uppercase tracking-widest">Welcome to the Lookout</h2>
               </div>
               <button onClick={() => setShowOnboardingModal(false)} className="p-2.5 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
           
            <div className="p-8 space-y-8">
              <section className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> How to Use This Site
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 flex flex-col gap-3 shadow-sm">
                       <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 rounded-lg text-blue-800"><MessageSquare size={16} /></div>
                          <h4 className="font-black text-[11px] uppercase tracking-wide text-[#0F172A]">Educator Notes</h4>
                       </div>
                       <p className="text-[12px] text-[#475569] leading-relaxed font-medium">On each card, you'll find the 'why.' I vet these tools so you can skip the trial-and-error.</p>
                    </div>
                    <div className="bg-emerald-50/50 p-5 rounded-3xl border border-emerald-100 flex flex-col gap-3 shadow-sm">
                       <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-800"><Filter size={16} /></div>
                          <h4 className="font-black text-[11px] uppercase tracking-wide text-[#0F172A]">Smart Filtering</h4>
                       </div>
                       <p className="text-[12px] text-[#475569] leading-relaxed font-medium">Use Tags to find specific platforms like Google Workspace or focus areas like AI Chatbots.</p>
                    </div>
                    <div className="bg-amber-50/50 p-5 rounded-3xl border border-amber-100 flex flex-col gap-3 shadow-sm sm:col-span-2 lg:col-span-1">
                       <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-amber-100 rounded-lg text-amber-800"><PlusCircle size={16} /></div>
                          <h4 className="font-black text-[11px] uppercase tracking-wide text-[#0F172A]">Join the Search</h4>
                       </div>
                       <p className="text-[12px] text-[#475569] leading-relaxed font-medium">Found a game-changer? Use 'Share Discovery' to help grow this resource for all Maine teachers.</p>
                    </div>
                 </div>
              </section>
              <section className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 mb-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> About Me
                </h3>
                <p className="text-[#64748B] text-xs md:text-sm leading-relaxed font-medium italic">
                  "I’m so glad you’re here. I've spent 17 years teaching ELA in Maine, so I know firsthand that any tool you add to your plate has to be worth the time it takes to learn it. Today, I work with educators across Maine to thoughtfully integrate technology that actually makes teaching more sustainable and learning more engaging."
                </p>
              </section>
              <button onClick={() => setShowOnboardingModal(false)} className="w-full py-4 bg-[#2D5A27] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3">
                 Enter The Lookout <Rocket size={18} />
              </button>
            </div>
          </div>
        </div>
      )}




      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-sm:max-w-[320px] max-w-sm">
            <h2 className="text-2xl font-black mb-6 text-center">Admin Access</h2>
            <input
              type="password"
              className={`w-full p-4 border rounded-2xl mb-6 text-center text-lg ${passError ? 'border-rose-500 bg-rose-50' : 'border-slate-300'}`}
              placeholder="Enter Access Key"
              value={passwordAttempt}
              onChange={e => {setPasswordAttempt(e.target.value); setPassError(false);}}
              onKeyDown={e => {
                if(e.key === 'Enter') {
                  if(passwordAttempt === ADMIN_SECRET) {
                    setAdminMode(true);
                    setShowAuthModal(false);
                    setPasswordAttempt('');
                  } else setPassError(true);
                }
              }}
            />
            <div className="flex gap-4">
              <button onClick={() => {
                if(passwordAttempt === ADMIN_SECRET) {
                  setAdminMode(true);
                  setShowAuthModal(false);
                  setPasswordAttempt('');
                } else setPassError(true);
              }} className="flex-1 bg-blue-800 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-blue-900 transition-all">Unlock</button>
              <button onClick={() => setShowAuthModal(false)} className="px-8 border border-slate-300 rounded-2xl font-black uppercase text-xs hover:bg-slate-50 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}




      {/* SUBMISSION MODAL */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-lg z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="bg-blue-800 p-2 rounded-xl text-white"><Sparkles size={18} /></div>
                <h2 className="text-xl font-black text-[#0F172A]">{editingId ? 'Edit Resource' : 'Share Discovery'}</h2>
              </div>
              <button onClick={() => setShowSubmissionModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
           
            <form onSubmit={handleUpsert} className="p-8 overflow-y-auto space-y-5 scrollbar-thin">
              {adminMode && (
                <div className="space-y-2">
                  <label className="text-[13px] font-black uppercase tracking-widest text-emerald-900 ml-1">Icon Style</label>
                  <div className="flex flex-wrap gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200">
                    {[
                      { id: 'Globe', icon: Globe, label: 'Web' },
                      { id: 'FileText', icon: FileText, label: 'Doc' },
                      { id: 'Video', icon: Video, label: 'Video' },
                      { id: 'Instagram', icon: Instagram, label: 'Insta' },
                      { id: 'Facebook', icon: Facebook, label: 'FB' },
                      { id: 'Linkedin', icon: Linkedin, label: 'LinkIn' }
                    ].map(option => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setIconOverride(option.id === iconOverride ? null : option.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[9px] font-black uppercase transition-all ${
                          (iconOverride === option.id) || (iconOverride === null && option.id === 'Globe' && !editingId)
                            ? 'bg-blue-800 border-blue-900 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        <option.icon size={12} />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-black uppercase tracking-widest text-emerald-900 ml-1">Discovery Title</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-sm" placeholder="e.g. AI Prompt Guide" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-black uppercase tracking-widest text-emerald-900 ml-1">Direct Link</label>
                  <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium" placeholder="https://..." value={newUrl} onChange={e => setNewUrl(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-black uppercase tracking-widest text-emerald-900 ml-1">Educator Perspective</label>
                <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all min-h-[80px] text-sm font-medium resize-none leading-relaxed" placeholder="Why is this valuable?" value={newNotes} onChange={e => setNewNotes(e.target.value)} />
              </div>
              <div className="space-y-1.5" ref={submissionDropdownRef}>
                <label className="text-[13px] font-black uppercase tracking-widest text-emerald-900 ml-1">Categories & Tags</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <button type="button" onClick={() => setIsSubmissionTagDropdownOpen(!isSubmissionTagDropdownOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                      <span className={selectedSubmissionTags.length > 0 ? 'text-blue-800 font-bold' : 'text-slate-400'}>{selectedSubmissionTags.length > 0 ? `${selectedSubmissionTags.length} tags selected` : 'Select existing tags...'}</span>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform ${isSubmissionTagDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isSubmissionTagDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-[210] max-h-48 overflow-y-auto p-1 scrollbar-thin">
                        {tags.sort((a,b) => a.name.localeCompare(b.name)).map(tag => (
                          <button key={tag.id} type="button" onClick={() => setSelectedSubmissionTags(prev => prev.includes(tag.name) ? prev.filter(t => t !== tag.name) : [...prev, tag.name])} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs mb-0.5 ${selectedSubmissionTags.includes(tag.name) ? 'bg-blue-800 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
                            <span>{tag.name}</span>
                            {selectedSubmissionTags.includes(tag.name) && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative w-40 flex items-center">
                    <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-100" placeholder="New tag..." value={customTagInput} onChange={e => setCustomTagInput(e.target.value)} onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); handleAddCustomTag(); }}} />
                    <button type="button" onClick={handleAddCustomTag} className="absolute right-2 text-blue-800 hover:text-blue-600"><PlusCircle size={18} /></button>
                  </div>
                </div>
                {selectedSubmissionTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedSubmissionTags.map((tag, idx) => (
                      <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-800 rounded-lg">
                        {tag}
                        <button type="button" onClick={() => setSelectedSubmissionTags(prev => prev.filter(t => t !== tag))} className="text-blue-400 hover:text-blue-800"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isAdding} className="w-full py-4 bg-blue-800 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-blue-900 disabled:opacity-50 transition-all text-xs">
                  {isAdding ? 'Processing...' : (editingId ? 'Save Changes' : 'Submit to Lookout')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}




      {/* CSV TOOLS MODAL */}
      {showCsvToolsModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-10 py-7 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-4">
                <Database className="text-blue-800" size={20} />
                <h2 className="text-xl font-black text-[#0F172A]">Inventory Data Tools</h2>
              </div>
              <button onClick={() => setShowCsvToolsModal(false)} className="p-3 hover:bg-slate-200 rounded-full transition-colors"><X /></button>
            </div>
            <div className="p-10 space-y-6">
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Files</h3>
                <div className="grid grid-cols-2 gap-5">
                  <button onClick={handleExportCSV} className="flex flex-col items-center gap-4 p-8 bg-slate-50 border border-slate-200 rounded-[2rem] hover:border-blue-400 hover:bg-blue-50 transition-all group">
                    <Download className="text-slate-400 group-hover:text-blue-800" size={24} />
                    <span className="text-[11px] font-black uppercase text-[#1E293B]">Backup CSV</span>
                  </button>
                  <button onClick={() => fileInputRef.current.click()} className="flex flex-col items-center gap-4 p-8 bg-slate-50 border border-slate-200 rounded-[2rem] hover:border-blue-400 hover:bg-blue-50 transition-all group">
                    <Upload className="text-slate-400 group-hover:text-blue-800" size={24} />
                    <span className="text-[11px] font-black uppercase text-[#1E293B]">Restore CSV</span>
                    <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                  </button>
                </div>
              </section>
              <section className="space-y-4 pt-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sheet Live Sync</h3>
                <button onClick={updatePublishedUrl} className="w-full flex items-center justify-between p-6 bg-blue-50 border border-blue-100 rounded-[2rem] hover:bg-blue-100 transition-all group">
                  <div className="flex items-center gap-4">
                    <Globe size={22} className="text-blue-800" />
                    <div className="text-left">
                      <div className="text-[11px] font-black uppercase text-blue-900">Sync Source</div>
                      <div className="text-[10px] text-blue-700/60 font-medium truncate max-w-[200px]">{publishedCsvUrl}</div>
                    </div>
                  </div>
                  <Edit3 size={16} className="text-blue-800 opacity-40 group-hover:opacity-100" />
                </button>
              </section>
            </div>
          </div>
        </div>
      )}




      {/* BULK TAG MODAL */}
      {showBulkTagModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[250] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden">
             <div className="px-10 py-7 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-black">Tag Selected</h2>
              <button onClick={() => setShowBulkTagModal(false)} className="p-3 hover:bg-slate-200 rounded-full transition-colors"><X /></button>
            </div>
            <div className="p-10">
              <p className="text-xs font-bold text-slate-500 mb-5 uppercase tracking-tight">Updating tags for {selectedIds.length} items:</p>
              <div className="flex flex-wrap gap-2.5 mb-10">
                {tags.map(tag => (
                  <button key={tag.id} onClick={() => setSelectedSubmissionTags(prev => prev.includes(tag.name) ? prev.filter(t => t !== tag.name) : [...prev, tag.name])} className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${selectedSubmissionTags.includes(tag.name) ? 'bg-blue-800 text-white shadow-md' : 'bg-slate-50 border border-slate-200 text-[#334155]'}`}>
                    {tag.name}
                  </button>
                ))}
              </div>
              <button onClick={handleBulkTagUpdate} className="w-full py-5 bg-blue-800 text-white rounded-[2rem] font-black uppercase text-xs shadow-lg hover:bg-blue-900 transition-all">Apply to Selection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
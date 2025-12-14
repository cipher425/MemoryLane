import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; 
import { 
  ArrowLeft, Image as ImageIcon, Video, FileText, Mic, Calendar, 
  Sparkles, Plus, Mail, Check, X, Folder, Users, Link as LinkIcon, Wand2, ChevronDown 
} from "lucide-react";
import toast from "react-hot-toast";
import { generateAIMessage } from "../utils/gemini"; 

export default function CreateCapsule({ addCapsule }) {
  const navigate = useNavigate();
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const dropdownRef = useRef(null); 

  
  const [title, setTitle] = useState("");
  const [collection, setCollection] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  
  
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const collectionOptions = ["Family History", "Group Trip", "Team Event", "Personal", "Anniversary", "Birthday"];
  
  const [email, setEmail] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [collabEmail, setCollabEmail] = useState("");
  const [collaborators, setCollaborators] = useState([]);

  const [message, setMessage] = useState("");
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCollectionOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e, type) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);
    try {
      const filePromises = files.map(async (file) => {
        const base64 = await convertToBase64(file);
        return { name: file.name, type: type, url: base64 };
      });
      const newFiles = await Promise.all(filePromises);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    } catch (error) {
      toast.error("Error uploading file");
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddRecipient = () => {
    if (email && !recipients.includes(email)) {
      setRecipients([...recipients, email]);
      setEmail("");
    }
  };

  const handleAddCollaborator = () => {
    if (collabEmail && !collaborators.includes(collabEmail)) {
      setCollaborators([...collaborators, collabEmail]);
      setCollabEmail("");
      toast.success("Collaborator added!");
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText("https://memorylane.app/join/capsule-123");
    toast.success("Invite link copied!");
  };

  
  const handleAIMagic = async () => {
    if (!title) {
        toast.error("Please enter a Title first so the AI knows what to write!");
        return;
    }
    
    setIsGeneratingAI(true);
    const generatedText = await generateAIMessage(title, collection, recipients[0] || "Future Me");
    
    if (generatedText) {
        setMessage(generatedText);
        setShowMessageInput(true); 
        toast.success("AI wrote a message for you! ✨");
    }
    setIsGeneratingAI(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUploading) return;

    const newCapsule = {
      id: Date.now(),
      title,
      collection,
      unlockDate,
      recipients: recipients.length > 0 ? recipients : [email].filter(Boolean),
      collaborators: collaborators,
      status: "locked",
      content: {
        text: message,
        files: selectedFiles,
      }
    };

    addCapsule(newCapsule);
    navigate("/dashboard");
    toast.success("Capsule created successfully!");
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
        <Header />
        
        <div className="max-w-4xl mx-auto px-6 py-10 pb-20">
            <button
                onClick={() => navigate("/dashboard")}
                className="group flex items-center text-sm font-medium text-slate-500 hover:text-sky-600 transition-colors mb-8"
            >
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-3 shadow-sm group-hover:border-sky-200 group-hover:text-sky-600 transition-all">
                    <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                </div>
                Back to Dashboard
            </button>

            <div className="mb-10 pl-2">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Create Shared Capsule</h1>
                <p className="text-slate-500 mt-3 text-lg font-medium">
                    Invite family to contribute memories before the capsule locks.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                
                <div className="bg-white p-8 rounded-[32px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] border border-slate-100/60 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-1">Capsule Title</label>
                            <div className="relative group">
                                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
                                <input 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    required 
                                    placeholder="e.g., Grandma's 80th Birthday" 
                                    className="w-full rounded-2xl border-transparent bg-slate-50 pl-11 pr-5 py-4 font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-sky-200 focus:ring-4 focus:ring-sky-500/10 transition-all duration-300 outline-none" 
                                />
                            </div>
                        </div>

                        
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-1">Collection</label>
                            
                            <div className="relative" ref={dropdownRef}>
                                
                                <Folder className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none z-10 ${isCollectionOpen ? 'text-sky-500' : 'text-slate-400'}`} size={18} />
                                
                                <button 
                                    type="button"
                                    onClick={() => setIsCollectionOpen(!isCollectionOpen)}
                                    className={`w-full flex items-center justify-between rounded-2xl border-transparent bg-slate-50 pl-11 pr-5 py-4 font-medium text-left transition-all duration-300 outline-none group ${isCollectionOpen ? 'ring-4 ring-sky-500/10 bg-white border-sky-200' : 'hover:bg-sky-50/80'}`}
                                >
                                    <span className={`truncate ${collection ? "text-slate-900" : "text-slate-400"}`}>
                                        {collection || "Select a theme..."}
                                    </span>
                                    <ChevronDown 
                                        size={18} 
                                        className={`text-slate-400 shrink-0 transition-transform duration-300 ${isCollectionOpen ? "rotate-180 text-sky-500" : ""}`} 
                                    />
                                </button>

                                
                                {isCollectionOpen && (
                                    <div className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-2 max-h-60 overflow-y-auto">
                                            {collectionOptions.map((option) => (
                                                <div 
                                                    key={option}
                                                    onClick={() => {
                                                        setCollection(option);
                                                        setIsCollectionOpen(false);
                                                    }}
                                                    className={`px-4 py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors flex items-center justify-between ${collection === option ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                                >
                                                    {option}
                                                    {collection === option && <Check size={16} />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-[32px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] border border-indigo-100/60">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Collaboration Mode</h3>
                            <p className="text-sm text-slate-500 font-medium">Allow others to add photos & videos</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input 
                                type="email" 
                                value={collabEmail} 
                                onChange={(e) => setCollabEmail(e.target.value)} 
                                placeholder="Enter contributor's email..." 
                                className="w-full rounded-2xl border-transparent bg-white pl-11 pr-4 py-4 font-medium text-slate-900 focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 outline-none shadow-sm" 
                            />
                        </div>
                        <button type="button" onClick={handleAddCollaborator} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95">
                            Invite
                        </button>
                         <button type="button" onClick={copyInviteLink} className="bg-white hover:bg-slate-50 text-slate-600 px-6 rounded-2xl font-bold transition-all border border-slate-200 flex items-center gap-2">
                            <LinkIcon size={18} /> Link
                        </button>
                    </div>

                    {collaborators.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {collaborators.map((c, i) => (
                                <div key={i} className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-indigo-200">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"/>
                                    {c}
                                    <button onClick={() => setCollaborators(prev => prev.filter(x => x !== c))} className="hover:text-indigo-900"><X size={12} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. MEDIA UPLOAD KA SECTION*/}
                <div className="bg-white p-8 rounded-[32px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] border border-slate-100/60">
                    <div className="flex justify-between items-center mb-6">
                        <label className="text-sm font-bold text-slate-700 ml-1">Your Contribution</label>
                        {isUploading && <span className="text-xs font-bold text-sky-600 animate-pulse">Uploading...</span>}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <UploadButton label="Photo" icon={<ImageIcon size={24} />} onClick={() => photoInputRef.current.click()} />
                        <UploadButton label="Video" icon={<Video size={24} />} onClick={() => videoInputRef.current.click()} />
                        <UploadButton label="Message" icon={<FileText size={24} />} onClick={() => setShowMessageInput(!showMessageInput)} active={showMessageInput} />
                        <UploadButton label="Audio" icon={<Mic size={24} />} onClick={() => audioInputRef.current.click()} />

                        <input type="file" ref={photoInputRef} className="hidden" accept="image/*" multiple onChange={(e) => handleFileChange(e, 'photo')} />
                        <input type="file" ref={videoInputRef} className="hidden" accept="video/*" multiple onChange={(e) => handleFileChange(e, 'video')} />
                        <input type="file" ref={audioInputRef} className="hidden" accept="audio/*" multiple onChange={(e) => handleFileChange(e, 'audio')} />
                    </div>

                    {showMessageInput && (
                        <div className="mb-6 animate-fadeIn relative">
                            
                            <button
                                type="button"
                                onClick={handleAIMagic}
                                disabled={isGeneratingAI}
                                className="absolute right-3 top-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 z-10 hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                                {isGeneratingAI ? (
                                    <>Thinking...</>
                                ) : (
                                    <><Wand2 size={12} /> AI Write</>
                                )}
                            </button>

                            <textarea 
                                value={message} 
                                onChange={(e) => setMessage(e.target.value)} 
                                rows="5" 
                                className="w-full rounded-2xl bg-slate-50 p-5 pt-10 text-slate-700 font-medium focus:ring-4 focus:ring-sky-500/10 outline-none resize-none" 
                                placeholder="Write a note... (Or click 'AI Write' to generate one!)" 
                            />
                        </div>
                    )}

                    {selectedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                            {selectedFiles.map((f, i) => (
                                <div key={i} className="flex items-center gap-3 bg-slate-50 pl-3 pr-2 py-2 rounded-xl border border-slate-100">
                                    <span className="text-lg">{f.type === 'photo' ? '📷' : f.type === 'video' ? '🎥' : '🎵'}</span>
                                    <span className="text-xs font-semibold text-slate-600 truncate max-w-[100px]">{f.name}</span>
                                    <button type="button" onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[32px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] border border-slate-100/60 space-y-3">
                        <label className="text-sm font-bold text-slate-700 ml-1">Unlock Date</label>
                        <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
                            <input type="date" value={unlockDate} onChange={(e) => setUnlockDate(e.target.value)} required className="w-full rounded-2xl bg-slate-50 pl-11 pr-5 py-4 font-medium text-slate-700 focus:bg-white focus:border-sky-200 focus:ring-4 focus:ring-sky-500/10 transition-all outline-none" />
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[32px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] border border-slate-100/60 space-y-3">
                        <label className="text-sm font-bold text-slate-700 ml-1">Send Final Capsule To</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1 group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="recipient@email.com" className="w-full rounded-2xl bg-slate-50 pl-11 pr-4 py-4 font-medium text-slate-900 focus:bg-white focus:border-sky-200 focus:ring-4 focus:ring-sky-500/10 transition-all outline-none" />
                            </div>
                            <button type="button" onClick={handleAddRecipient} className="bg-slate-100 hover:bg-slate-200 text-slate-700 w-14 rounded-2xl flex items-center justify-center transition-colors"><Plus size={24} /></button>
                        </div>
                        {recipients.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {recipients.map((r, i) => (
                                    <div key={i} className="bg-sky-50 text-sky-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-sky-100">{r}<Check size={12} strokeWidth={3} /></div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <button type="submit" disabled={isUploading} className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl shadow-sky-200/50 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 ${isUploading ? 'bg-slate-300 text-white cursor-wait' : 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white hover:shadow-sky-300/60'}`}>
                    {isUploading ? 'Processing...' : <><Sparkles size={20} fill="currentColor" /> Create Shared Capsule</>}
                </button>
            </form>
        </div>
    </div>
  );
}

function UploadButton({ label, icon, onClick, active }) {
    return (
        <button type="button" onClick={onClick} className={`flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] border-2 border-dashed transition-all duration-300 group ${active ? 'border-sky-400 bg-sky-50' : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/50'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${active ? 'bg-sky-100 text-sky-600' : 'bg-slate-50 text-slate-400 group-hover:bg-sky-100 group-hover:text-sky-600 group-hover:scale-110'}`}>{icon}</div>
            <span className={`text-sm font-bold transition-colors ${active ? 'text-sky-700' : 'text-slate-500 group-hover:text-sky-700'}`}>{label}</span>
        </button>
    );
}
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Download, Share2, Send, MessageCircle, Heart, Smile, User } from "lucide-react";
import { saveCapsuleToDB } from "../utils/db"; // Ensure hum comments save kar sakein
import toast from "react-hot-toast";

export default function CapsuleView({ capsules }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [capsule, setCapsule] = useState(null);
  
  
  const [comment, setComment] = useState("");
  const [interactions, setInteractions] = useState({
    comments: [],
    reactions: { "❤️": 0, "🥹": 0, "😂": 0, "😮": 0, "🙏": 0 }
  });

  
  useEffect(() => {
    if (capsules.length > 0) {
      const found = capsules.find((c) => c.id.toString() === id);
      if (found) {
        setCapsule(found);
        
        setInteractions(found.interactions || {
          comments: [],
          reactions: { "❤️": 0, "🥹": 0, "😂": 0, "😮": 0, "🙏": 0 }
        });
      }
    }
  }, [capsules, id]);

  if (!capsule) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Memory...</div>;

  const isLocked = capsule.status !== "unlocked";

  
  const handleReaction = async (emoji) => {
    const updatedReactions = { 
        ...interactions.reactions, 
        [emoji]: (interactions.reactions[emoji] || 0) + 1 
    };

    const newInteractions = { ...interactions, reactions: updatedReactions };
    setInteractions(newInteractions);

    
    const updatedCapsule = { ...capsule, interactions: newInteractions };
    await saveCapsuleToDB(updatedCapsule);
    toast.success("Reaction added!");
  };

  
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now(),
      user: "Family Member", 
      text: comment,
      timestamp: new Date().toLocaleString()
    };

    const updatedComments = [newComment, ...interactions.comments];
    const newInteractions = { ...interactions, comments: updatedComments };
    
    setInteractions(newInteractions);
    setComment("");

    
    const updatedCapsule = { ...capsule, interactions: newInteractions };
    await saveCapsuleToDB(updatedCapsule);
    toast.success("Message posted.");
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] pb-20">
      
      {/* HEADER  */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors text-sm font-bold"
          >
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                <ArrowLeft size={16} />
            </div>
            Back
          </button>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-all">
                <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 mt-8">
        
        {/* CAPSULE CONTENT CARD (Main Dabba) */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden mb-8">
            
            
            <div className={`h-32 w-full ${isLocked ? 'bg-slate-100' : 'bg-gradient-to-r from-sky-400 to-indigo-500'}`} />

            <div className="px-8 pb-8 -mt-12">
               
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100/50 relative">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-[11px] font-bold uppercase tracking-wider border border-sky-100 mb-3 inline-block">
                                {capsule.collection || "Memory"}
                            </span>
                            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
                                {capsule.title}
                            </h1>
                            <p className="text-slate-400 text-sm font-medium mt-2 flex items-center gap-2">
                                <Clock size={14} /> 
                                {isLocked ? "Unlocks on" : "Unlocked on"} {capsule.unlockDate}
                            </p>
                        </div>
                    </div>
                </div>

                
                {isLocked ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">🔒</div>
                        <h2 className="text-2xl font-bold text-slate-700">This memory is locked</h2>
                        <p className="text-slate-500 mt-2 max-w-md mx-auto">
                            This time capsule is sealed until <span className="font-bold text-slate-900">{capsule.unlockDate}</span>. 
                            Come back then to relive the memories!
                        </p>
                    </div>
                ) : (
                    /* UNLOCKED CONTENT VIEW (Agar khul gaya toh yeh dikhega) */
                    <div className="mt-8 space-y-8 animate-fadeIn">
                        
                        
                        {capsule.content?.text && (
                            <div className="prose prose-slate max-w-none">
                                <p className="text-lg text-slate-700 leading-relaxed font-serif whitespace-pre-wrap">
                                    "{capsule.content.text}"
                                </p>
                            </div>
                        )}

                        
                        {capsule.content?.files?.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Attached Memories</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {capsule.content.files.map((file, idx) => (
                                        <div key={idx} className="group relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                                            {file.type === "photo" ? (
                                                <img src={file.url} alt={file.name} className="w-full h-48 object-cover transition-transform group-hover:scale-105" />
                                            ) : file.type === "video" ? (
                                                <video src={file.url} controls className="w-full h-48 object-cover bg-black" />
                                            ) : (
                                                <div className="h-24 flex items-center justify-center gap-2 text-slate-500">
                                                    🎵 Audio Clip
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-end p-2 opacity-0 group-hover:opacity-100">
                                                <a href={file.url} download={file.name} className="p-2 bg-white rounded-full shadow-md text-slate-700 hover:text-sky-600">
                                                    <Download size={16} />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        
        {!isLocked && (
            <div className="space-y-6">
                
                
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Heart size={16} className="text-rose-500" /> Reactions
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(interactions.reactions).map(([emoji, count]) => (
                            <button 
                                key={emoji}
                                onClick={() => handleReaction(emoji)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 hover:bg-sky-50 border border-slate-100 hover:border-sky-200 transition-all active:scale-95 group"
                            >
                                <span className="text-xl group-hover:scale-110 transition-transform">{emoji}</span>
                                <span className="text-sm font-bold text-slate-600 group-hover:text-sky-700">{count}</span>
                            </button>
                        ))}
                    </div>
                </div>

                
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <MessageCircle size={16} className="text-sky-500" /> Messages
                    </h3>

                    
                    <form onSubmit={handlePostComment} className="flex gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                            <User size={20} />
                        </div>
                        <div className="flex-1 relative">
                            <input 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share a thought or memory..." 
                                className="w-full bg-slate-50 border-transparent focus:bg-white border focus:border-sky-200 rounded-2xl py-3 px-5 pr-12 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                            />
                            <button 
                                type="submit" 
                                disabled={!comment.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-sky-500 text-white rounded-xl shadow-md hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>

                    
                    <div className="space-y-6">
                        {interactions.comments.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-sm">
                                No messages yet. Be the first to add one!
                            </div>
                        ) : (
                            interactions.comments.map((c) => (
                                <div key={c.id} className="flex gap-4 animate-fadeIn">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                                        {c.user.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-slate-900 text-sm">{c.user}</span>
                                            <span className="text-[10px] text-slate-400 font-medium">{c.timestamp}</span>
                                        </div>
                                        <div className="bg-slate-50 px-4 py-3 rounded-2xl rounded-tl-none text-slate-600 text-sm leading-relaxed">
                                            {c.text}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
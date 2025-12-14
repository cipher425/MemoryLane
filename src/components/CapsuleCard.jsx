import { Link } from "react-router-dom";
import { Lock, Unlock, Clock, Trash2, Sparkles, Folder, ChevronRight, Users } from "lucide-react";
import { useState, useEffect } from "react";

export default function CapsuleCard({ capsule, onDelete }) {
  const isUnlocked = capsule.status === "unlocked";
  const [timeLeft, setTimeLeft] = useState(null);

  
  const theme = isUnlocked
    ? {
        // UNLOCKED (Jab capsule khul jaye to Success color)
        wrapper: "border-emerald-100 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.1)] hover:shadow-[0_8px_16px_-4px_rgba(16,185,129,0.2)] hover:border-emerald-300",
        bgGradient: "bg-gradient-to-br from-white to-emerald-50/30",
        iconBox: "bg-emerald-100/80 text-emerald-600 ring-1 ring-emerald-200",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
        dot: "bg-emerald-500",
        footer: "bg-emerald-50/60 border-emerald-100",
        accent: "text-emerald-600",
      }
    : {
        // LOCKED (Jab capsule abhi band ho to Waiting color)
        wrapper: "border-slate-200 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_16px_-4px_rgba(249,115,22,0.15)] hover:border-orange-200",
        bgGradient: "bg-gradient-to-br from-white to-slate-50",
        iconBox: "bg-orange-50 text-orange-500 ring-1 ring-orange-100",
        badge: "bg-slate-50 text-slate-600 border-slate-200",
        dot: "bg-orange-400",
        footer: "bg-white border-slate-100",
        accent: "text-orange-500",
      };

     // TIMER KA LOGIC 
  useEffect(() => {
    if (isUnlocked) return; 
    const updateTimer = () => {
      const now = new Date();
      const [year, month, day] = capsule.unlockDate.split("-").map(Number);
      const targetDate = new Date(year, month - 1, day, 0, 0, 0);
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft(null); 
      } else {
        
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft({
          days: d,
          hours: h.toString().padStart(2, "0"),
          minutes: m.toString().padStart(2, "0"),
          seconds: s.toString().padStart(2, "0"),
        });
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000); 
    return () => clearInterval(interval);
  }, [capsule.unlockDate, isUnlocked]);

  const handleDelete = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${capsule.title}"?`)) {
      onDelete(capsule.id);
    }
  };

  return (
    <Link
      to={`/capsule/${capsule.id}`}
      className={`group relative flex flex-col justify-between h-full rounded-[24px] border p-1 transition-all duration-500 hover:-translate-y-1.5 ${theme.wrapper} ${theme.bgGradient}`}
    >
      <div className="p-5 flex flex-col h-full">
        
        {/*HEADER WALI LINE */}
        <div className="flex justify-between items-start mb-5 h-10">
        
          <div className={`p-3 rounded-2xl shadow-sm transition-all duration-300 group-hover:scale-105 ${theme.iconBox}`}>
            {isUnlocked ? <Unlock size={22} strokeWidth={2.5} /> : <Lock size={22} strokeWidth={2.5} />}
          </div>
          
          
          <button
            onClick={handleDelete}
            className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 hover:shadow-sm rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0"
            title="Delete Capsule"
          >
            <Trash2 size={18} />
          </button>
        </div>

        
        <div className="mb-6 relative">
          
          
          <div className="flex flex-wrap gap-2 mb-3">
             
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${theme.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${theme.dot} animate-pulse`} />
                {capsule.collection || "General"}
            </div>

            
            {capsule.collaborators && capsule.collaborators.length > 0 && (
                <div className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-full border bg-indigo-50 text-indigo-600 border-indigo-100 text-[10px] font-bold uppercase tracking-wider">
                    <Users size={12} />
                    Group
                </div>
            )}
          </div>

          <h3 className="text-[19px] font-extrabold leading-snug text-slate-800 line-clamp-2 tracking-tight group-hover:text-black transition-colors">
            {capsule.title}
          </h3>
          
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-xs text-slate-400 font-medium">
                {isUnlocked ? "Memory unlocked on" : "Scheduled for"}
            </span>
            <span className={`text-xs font-semibold ${theme.accent}`}>
                {capsule.unlockDate}
            </span>
          </div>
        </div>

        
        <div className="mt-auto">
          {isUnlocked ? (
            
            <div className={`rounded-xl p-4 flex items-center justify-between transition-all duration-300 group-hover:bg-emerald-100/50 ${theme.footer}`}>
              <div className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-full shadow-sm text-emerald-500 ring-1 ring-emerald-100">
                    <Sparkles size={14} fill="currentColor" />
                </div>
                <div>
                    <p className="text-[10px] uppercase font-bold text-emerald-400 leading-none mb-0.5">Status</p>
                    <p className="text-sm font-bold text-emerald-700 leading-none">Ready to View</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-emerald-400 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          ) : (
            //  DIGITAL GHADI WALA UI 
            <div className={`rounded-xl p-1 border ${theme.footer}`}>
              {timeLeft ? (
                <div className="flex items-center justify-between px-2 py-2">
                  <TimeUnit value={timeLeft.days} label="DAYS" color="text-slate-700" />
                  <Separator />
                  <TimeUnit value={timeLeft.hours} label="HRS" color="text-slate-700" />
                  <Separator />
                  <TimeUnit value={timeLeft.minutes} label="MIN" color="text-slate-700" />
                  <Separator />
                  <TimeUnit value={timeLeft.seconds} label="SEC" color={theme.accent} highlight />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-3 text-orange-500 animate-pulse bg-orange-50/50 rounded-lg">
                   <div className="flex items-center gap-2 text-sm font-bold">
                       <Clock size={16} className="animate-spin-slow" /> 
                       Unlocking...
                   </div>
                   <span className="text-[10px] font-semibold opacity-70 mt-1">Check back in a moment</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}



function TimeUnit({ value, label, color, highlight }) {
  return (
    <div className="flex flex-col items-center min-w-[36px]">
      <span className={`text-xl font-bold font-mono leading-none tabular-nums tracking-tight ${color} ${highlight ? "drop-shadow-sm" : ""}`}>
        {value}
      </span>
      <span className="text-[9px] font-bold text-slate-400 mt-1.5 tracking-wider scale-90">
        {label}
      </span>
    </div>
  );
}

function Separator() {
    return (
        <div className="flex flex-col gap-1 -mt-3 opacity-30">
            <div className="w-0.5 h-0.5 rounded-full bg-slate-900" />
            <div className="w-0.5 h-0.5 rounded-full bg-slate-900" />
        </div>
    );
}
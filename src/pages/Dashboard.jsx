import Header from "../components/Header";
import CapsuleCard from "../components/CapsuleCard";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Clock, Lock, Unlock, TrendingUp, Plus, Folder, LayoutGrid } from "lucide-react";

export default function Dashboard({ capsules, handleLogout, deleteCapsule }) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  
  const demoLockedCapsule = {
    id: "demo-locked-999",
    title: "Mystery Box 2026",
    collection: "Future Goals",
    unlockDate: "2026-01-01", 
    status: "locked",
    privacy: "private",
    content: { text: "This is a locked memory." }
  };

  
  const allCapsules = [demoLockedCapsule, ...capsules];

  // --- CATEGORIES(Folders) ---
  
  const categories = useMemo(() => {
    const unique = new Set(allCapsules.map(c => c.collection).filter(Boolean));
    return ["All", ...Array.from(unique).sort()];
  }, [allCapsules]);

  
  const filteredCapsules = useMemo(() => {
    if (activeCategory === "All") return allCapsules;
    return allCapsules.filter(c => c.collection === activeCategory);
  }, [allCapsules, activeCategory]);

  
  const stats = useMemo(() => {
    const safeCapsules = allCapsules || [];
    const total = safeCapsules.length;
    const locked = safeCapsules.filter((c) => c.status !== "unlocked").length;
    const unlocked = safeCapsules.filter((c) => c.status === "unlocked").length;

    
    const lockedCapsules = safeCapsules.filter((c) => c.status !== "unlocked");
    let nextUnlock = "-";
    
    if (lockedCapsules.length > 0) {
      
      const sorted = [...lockedCapsules].sort((a, b) => new Date(a.unlockDate) - new Date(b.unlockDate));
      const nextDate = new Date(sorted[0].unlockDate);
      const now = new Date();
      const diffTime = nextDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      nextUnlock = diffDays > 0 ? `${diffDays}d` : "Soon";
    }

    return { total, locked, unlocked, nextUnlock };
  }, [allCapsules]);

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <Header handleLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-6 mt-10 pb-20">
        
        {/* HEADER SECTION  */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">My Time Capsules</h2>
            <p className="mt-2 text-slate-500">Preserve your precious memories for the future</p>
          </div>
          <button
            onClick={() => navigate("/create")}
            className="flex items-center gap-2 bg-[#0EA5E9] text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-sky-200 hover:bg-sky-600 active:scale-95 transition-all"
          >
            <Plus size={20} />
            Create Capsule
          </button>
        </div>

        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <StatCard icon={<Clock size={24} />} value={stats.total} label="Total Capsules" color="bg-blue-100 text-blue-600" />
          <StatCard icon={<Lock size={24} />} value={stats.locked} label="Locked" color="bg-orange-100 text-orange-600" />
          <StatCard icon={<Unlock size={24} />} value={stats.unlocked} label="Unlocked" color="bg-green-100 text-green-600" />
          <StatCard icon={<TrendingUp size={24} />} value={stats.nextUnlock} label="Next Unlock" color="bg-purple-100 text-purple-600" />
        </div>

        
        {categories.length > 1 && (
            <div className="mb-8 overflow-x-auto pb-2">
                <div className="flex items-center gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                                activeCategory === cat 
                                ? "bg-slate-800 text-white border-slate-800 shadow-md transform scale-105" 
                                : "bg-white text-slate-600 border-gray-200 hover:border-slate-300 hover:bg-gray-50"
                            }`}
                        >
                            {cat === "All" ? <LayoutGrid size={16} /> : <Folder size={16} />}
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        )}

        
        {(!filteredCapsules || filteredCapsules.length === 0) ? (
           
           <div className="text-center bg-white rounded-3xl p-16 shadow-sm border border-gray-100 animate-fadeIn">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">📭</div>
             <h3 className="text-xl font-semibold text-gray-900">No capsules found</h3>
             <p className="text-gray-500 mt-2">
                {activeCategory === "All" 
                    ? "Start by creating your first time capsule!" 
                    : `You haven't created any "${activeCategory}" capsules yet.`}
             </p>
             {activeCategory !== "All" && (
                 <button onClick={() => setActiveCategory("All")} className="mt-6 text-[#0EA5E9] font-medium hover:underline">
                    View all capsules
                 </button>
             )}
           </div>
        ) : (
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
            {filteredCapsules.map((capsule) => (
              <CapsuleCard 
                key={capsule.id} 
                capsule={capsule} 
                onDelete={deleteCapsule}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


function StatCard({ icon, value, label, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm border border-slate-100">
      <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}
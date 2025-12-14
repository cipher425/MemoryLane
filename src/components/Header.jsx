import { Link, useLocation } from "react-router-dom";
import { Clock, LogOut, User } from "lucide-react";

export default function Header({ handleLogout }) {
  const location = useLocation();

  return (
    
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* LEFT LOGO */}
        <Link 
          to="/dashboard" 
          className="flex items-center gap-2.5 group"
        >
          <div className="bg-sky-100 p-1.5 rounded-full text-sky-500 group-hover:bg-sky-200 transition-colors">
            <Clock size={20} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">
            MemoryLane
          </span>
        </Link>

        {/* RIGHT */}
        <div className="flex items-center gap-6">

          {/* NAV LINKS */}
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/dashboard"
              className={`transition-colors ${
                location.pathname === "/dashboard"
                  ? "text-sky-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/create"
              className={`transition-colors ${
                location.pathname === "/create"
                  ? "text-sky-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Create Capsule
            </Link>
          </nav>

          
          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

          
          <div className="flex items-center gap-3">
            
            <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-sm font-bold border border-sky-100">
              <User size={18} />
            </div>
            
            {/* Logout Button */}
            {handleLogout && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors border border-gray-200 px-3 py-1.5 rounded-lg hover:border-red-200 hover:bg-red-50"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
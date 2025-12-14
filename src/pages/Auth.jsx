import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Heart, 
  Gift, 
  Camera, 
  ArrowRight, 
  Clock 
} from "lucide-react";

export default function Auth({ handleLogin }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleLogin) {
      const success = handleLogin(email, password);
      if (success) navigate('/dashboard');
    } else {
      console.log("Login clicked", email, password);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-hidden flex flex-col justify-between font-sans selection:bg-sky-200 selection:text-sky-900">
      
      {/* Animation ka Styles */}
      <style>{`
        @keyframes float {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 15s ease-in-out infinite; }
        .animate-float-delayed { animation: float 18s ease-in-out infinite reverse; }
        .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>

      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45rem] h-[45rem] bg-sky-200/40 rounded-full blur-[100px] mix-blend-multiply animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45rem] h-[45rem] bg-blue-200/40 rounded-full blur-[100px] mix-blend-multiply animate-float-delayed" />
      </div>

      {/* Header Logo */}
      <div className="relative z-10 px-6 py-6 lg:px-8 animate-fade-up">
        <div className="flex items-center gap-2.5 text-xl font-bold text-slate-800 tracking-tight">
          <div className="bg-white p-2 rounded-xl shadow-sm text-sky-600 ring-1 ring-slate-900/5 hover:scale-110 transition-transform duration-300">
            <Clock size={20} strokeWidth={2.5} className="animate-pulse" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
            MemoryLane
          </span>
        </div>
      </div>

      
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 lg:px-12 gap-12 lg:gap-24 w-full py-8">
        
        {/* Ye Left Column hai */}
        <div className="flex-1 max-w-xl space-y-10">
          <div className="space-y-6 animate-fade-up delay-100">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Preserve today. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                Relive tomorrow.
              </span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Create digital time capsules filled with your most precious memories. 
              Set a future unlock date and surprise yourself or loved ones with moments from the past.
            </p>
          </div>

          {/* text ke neeche ka animation */}
          <div className="space-y-4 animate-fade-up delay-200">
            {[
              { icon: Heart, title: "Preserve Memories", desc: "Capture precious moments for the future" },
              { icon: Gift, title: "Time-locked Surprises", desc: "Set unlock dates or life events" },
              { icon: Camera, title: "Rich Media", desc: "Photos, videos, audio & letters" }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="group bg-white/60 backdrop-blur-md p-4 rounded-2xl flex items-start gap-5 border border-white/50 shadow-sm hover:shadow-lg hover:shadow-sky-500/10 hover:bg-white/90 hover:-translate-y-1 transition-all duration-300 cursor-default"
                style={{ animationDelay: `${0.3 + (idx * 0.1)}s` }} 
              >
                <div className="bg-sky-50 p-3 rounded-xl text-sky-500 group-hover:bg-sky-500 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <feature.icon size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{feature.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Auth Card (Login wala area) */}
        <div className="flex-1 w-full max-w-[440px] animate-fade-up delay-300">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 ring-1 ring-slate-900/5 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-shadow duration-500">
            
           
            <div className="bg-slate-100/80 p-1.5 rounded-2xl flex mb-8 relative">
              
              <div 
                className={`absolute top-1.5 bottom-1.5 rounded-xl bg-white shadow-sm transition-all duration-300 ease-spring ${
                  isLoginView ? 'left-1.5 w-[calc(50%-6px)]' : 'left-[calc(50%+3px)] w-[calc(50%-6px)]'
                }`}
              />
              
              <button
                onClick={() => setIsLoginView(true)}
                className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-colors duration-300 relative z-10 ${
                  isLoginView ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLoginView(false)}
                className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-colors duration-300 relative z-10 ${
                  !isLoginView ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Sign Up
              </button>
            </div>

            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              
              <div className="space-y-2 group">
                <label className="text-sm font-semibold text-slate-700 ml-1 transition-colors group-focus-within:text-sky-600">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={20} className="text-slate-400 group-focus-within:text-sky-500 transition-colors duration-300 group-focus-within:scale-110" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-300"
                  />
                </div>
              </div>

              
              <div className="space-y-2 group">
                <label className="text-sm font-semibold text-slate-700 ml-1 transition-colors group-focus-within:text-sky-600">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={20} className="text-slate-400 group-focus-within:text-sky-500 transition-colors duration-300 group-focus-within:scale-110" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all duration-300"
                  />
                </div>
              </div>

              
              <button
                type="submit"
                className="w-full group bg-gradient-to-r from-sky-500 to-blue-600 hover:to-blue-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-sky-500/40 active:translate-y-0 active:scale-[0.98]"
              >
                <span className="relative">
                  {isLoginView ? "Login" : "Create Account"}
                </span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </form>

            {/* Neeche ka text (Footer) */}
            <p className="mt-8 text-center text-sm text-slate-500">
              {isLoginView ? "Don't have an account?" : "Already have an account?"}{" "}
              <button 
                onClick={() => setIsLoginView(!isLoginView)}
                className="text-sky-600 font-semibold hover:text-sky-700 hover:underline transition-colors"
              >
                {isLoginView ? "Sign up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Mai Copyright */}
      <div className="relative z-10 py-6 text-center text-sm text-slate-400 font-medium animate-fade-up delay-300">
        © 2025 Rituraj Mishra. 
      </div>
    </div>
  );
}
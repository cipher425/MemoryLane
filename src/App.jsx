import { Routes, Route, useLocation, useNavigate } from "react-router-dom"; 
import { useState, useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast"; 
import { AnimatePresence, motion } from "framer-motion";

import { getAllCapsules, saveCapsuleToDB, deleteCapsuleFromDB } from "./utils/db"; 
import { sendUnlockNotification } from "./utils/emailService";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateCapsule from "./pages/CreateCapsule";
import Collaboration from "./pages/Collaboration";
import CapsuleView from "./pages/CapsuleView";

import { capsules as dummyData } from "./data/dummyData";

function App() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [capsules, setCapsules] = useState([]);
  const notifiedRef = useRef(new Set()); 
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsFirstLoad(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const savedCapsules = await getAllCapsules();
      if (savedCapsules.length > 0) {
        setCapsules(savedCapsules.sort((a, b) => b.id - a.id));
        
        
        savedCapsules.forEach(c => {
            if(c.status === "unlocked") notifiedRef.current.add(c.id);
        });
      } else {
        setCapsules(dummyData);
      }
    };
    loadData();
  }, []);

  const addCapsule = async (newCapsule) => {
    setCapsules((prev) => [newCapsule, ...prev]);
    await saveCapsuleToDB(newCapsule);
  };

  const deleteCapsule = async (id) => {
    setCapsules((prev) => prev.filter((c) => c.id !== id));
    await deleteCapsuleFromDB(id);
    if (notifiedRef.current.has(id)) {
        notifiedRef.current.delete(id);
    }
  };

  
  const handleLogout = () => {
    navigate("/");
  };

  const handleLogin = () => true;

 
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now(); 
      
      setCapsules((prevCapsules) => {
        let hasChanges = false;
        
        const updated = prevCapsules.map((capsule) => {
          if (capsule.status === "unlocked") return capsule;
          
          const unlockDateObj = new Date(capsule.unlockDate);
          
          const unlockTime = unlockDateObj.getTime() + (unlockDateObj.getTimezoneOffset() * 60000);
          
          if (unlockTime <= now) {
            hasChanges = true;
            
            
            const unlockedCapsule = { ...capsule, status: "unlocked" };
            
           
            if (!notifiedRef.current.has(capsule.id)) {
                notifiedRef.current.add(capsule.id);
                
                sendUnlockNotification(unlockedCapsule); 
                saveCapsuleToDB(unlockedCapsule);
            }
            return unlockedCapsule;
          }
          return capsule;
        });

        return hasChanges ? updated : prevCapsules;
      });
    }, 1000); 
    
    return () => clearInterval(interval);
  }, []);

  const getAnimationType = (pathname) => {
    if (isFirstLoad) return "cinematic";
    if (pathname === "/create") return "float"; 
    return "soft";
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#F8FBFF] overflow-hidden">
      <Toaster position="top-center" />
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          <Route path="/" element={
            <SmartTransition type={getAnimationType(location.pathname)}>
              <Auth handleLogin={handleLogin} />
            </SmartTransition>
          } />
          
          <Route path="/dashboard" element={
            <SmartTransition type={getAnimationType(location.pathname)}>
              <Dashboard 
                  capsules={capsules} 
                  handleLogout={handleLogout} 
                  deleteCapsule={deleteCapsule} 
              />
            </SmartTransition>
          } />
          
          <Route path="/create" element={
            <SmartTransition type={getAnimationType(location.pathname)}>
              <CreateCapsule addCapsule={addCapsule} />
            </SmartTransition>
          } />
          
          <Route path="/collaboration/:id" element={
            <SmartTransition type={getAnimationType(location.pathname)}>
              <Collaboration />
            </SmartTransition>
          } />
          
          <Route path="/capsule/:id" element={
            <SmartTransition type={getAnimationType(location.pathname)}>
              <CapsuleView capsules={capsules} />
            </SmartTransition>
          } />

        </Routes>
      </AnimatePresence>
    </div>
  );
}

// ANIMATIONs
const animations = {
  soft: {
    initial: { opacity: 0, y: 10, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.99 },
    transition: { duration: 0.35, ease: "easeOut" } 
  },
  float: {
    initial: { opacity: 0, scale: 0.98 }, 
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 }, 
    transition: { duration: 0.4, ease: "easeOut" }
  },
  cinematic: {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0 },
    transition: { duration: 1.0, ease: "easeOut" }
  }
};

const SmartTransition = ({ children, type }) => {
  const activeAnim = animations[type] || animations.soft;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={activeAnim}
      
      className="no-scrollbar absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden z-0"
      style={{ willChange: "transform, opacity" }} 
    >
      {children}
    </motion.div>
  );
};

export default App;
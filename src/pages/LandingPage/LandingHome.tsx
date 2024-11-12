import React, { useEffect, useState } from "react";
import LandingHeader from "./LandingHeader";
import LandingContant from "./LandingContant";
import VeiwApps from "./VeiwApps";
import { useLocation } from "react-router-dom";

const LandingHome: React.FC = () => {
  const [mode, setMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/landing' && location.hash === '#appsSection') {
      document.getElementById('appsSection')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  

  return (
    <div
      className={`${
        mode ? "bg-white" : "bg-[#1A2023]"
      } text-white min-h-screen p-10`}
    >
      {/* Header */}
      <LandingHeader mode={mode} setMode={setMode} />

      {/* Main Content */}
      <LandingContant mode={mode} setMode={setMode} />
      <div id="appsSection">
      <VeiwApps  mode={mode}/>
      </div>
    </div>
  );
};

export default LandingHome;

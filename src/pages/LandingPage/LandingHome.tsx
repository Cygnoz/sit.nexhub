import React, { useState } from "react";
import LandingHeader from "./LandingHeader";
import LandingContant from "./LandingContant";
import VeiwApps from "./VeiwApps";

const LandingHome: React.FC = () => {
  const [mode, setMode] = useState(false);

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
      <VeiwApps  mode={mode} setMode={setMode}/>
    </div>
  );
};

export default LandingHome;

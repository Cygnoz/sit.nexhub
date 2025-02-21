import logo from "../../../public/billbizzlogoLanding.png";
import logoLight from "../../../public/bill-bizz-logo.png";
import ArrowrightUp from "../../assets/icons/ArrowrightUp";
import BellDot from "../../assets/icons/BellDot";
import Sun from "../../assets/icons/Sun";
import Moon from "../../assets/icons/Moon";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../Components/model/Modal";
import Button from "../../Components/Button";
import SettingsIcons from "../../assets/icons/SettingsIcon";
import ModuleSearch from "../../Components/ModuleSearch";

type Props = {
  setMode?: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: boolean;
};

function LandingHeader({ mode, setMode }: Props) {
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve mode from localStorage, if it exists
    const storedMode = localStorage.getItem("mode");
    if (storedMode !== null) {
      setMode?.(storedMode === "true");
    }
  }, [setMode]);

  const toggleMode = () => {
    if (setMode) {
      setMode((prev) => {
        const newMode = !prev;
        localStorage.setItem("mode", newMode.toString());
        return newMode;
      });
    }
  };

  const handleLogout = () => {
    ["authToken", "savedIndex", "savedSelectedIndex"].forEach((item) =>
      localStorage.removeItem(item)
    );
    navigate("/login");
    setLogoutModalOpen(false);
  };

  const closeModal = () => {
    setLogoutModalOpen(false);
  };

  return (
    <header
      className={`${
        mode ? "bg-[#EAEBEB]" : "bg-[#2C353B]"
      } text-[#DFD1B4] flex items-center justify-between p-4 rounded-full mb-8 px-6 w-full`}
    >
      <div
        onClick={() => navigate("/landing")}
        className="flex items-center space-x-2 cursor-pointer"
      >
        <img
          src={mode ? logo : logoLight}
          alt="Bill Bizz Logo"
          className="h-7 w-[22px]"
        />
        <h1
          className={`text-lg font-medium ${
            mode ? "text-[#303F58]" : "text-[#F7E7CE]"
          } `}
        >
          BILL BIZZ
        </h1>
      </div>
      <div className=" z-9999 w-[45%]">
        <ModuleSearch page="landing" />
      </div>
      <div className="flex items-center space-x-4">
        <button
          className={`${
            mode ? "bg-white" : "bg-[#404B52]"
          } text-[#DFD1B4] w-[38px] h-[38px] flex justify-center items-center rounded-full`}
        >
          <BellDot color={mode ? "#4B5C79" : "white"} />
        </button>
        <button
          onClick={() => navigate("/settings")}
          className={`${
            mode ? "bg-white" : "bg-[#404B52]"
          } text-[#DFD1B4] w-[38px] h-[38px] flex justify-center items-center rounded-full`}
        >
          <SettingsIcons color={mode ? "#4B5C79" : "white"} />
        </button>

        <button className="bg-[#FCFFED] text-[#585953] text-[12px] w-[138px] h-[38px] rounded-full font-semibold flex items-center justify-center gap-1 ">
          Let's Connect
          <div>
            <ArrowrightUp />
          </div>
        </button>
        {mode ? (
          <button
            className="bg-white border-white rounded-full border-4"
            onClick={toggleMode}
          >
            <div className="bg-[#EAEBEB] p-1 rounded-full">
              <Moon />
            </div>
          </button>
        ) : (
          <button
            className="bg-[#F3F3F3] border-[#7A8087] p-1 rounded-full border-4"
            onClick={toggleMode}
          >
            <div className="bg-[#F3F3F3] rounded-full">
              <Sun />
            </div>
          </button>
        )}
      </div>

      {isLogoutModalOpen && (
        <Modal
          open
          onClose={closeModal}
          className="rounded-lg p-8 w-[546px] h-[160px] text-[#303F58] space-y-8 relative"
        >
          <p className="text-sm">Are you sure you want to log out?</p>
          <div className="flex justify-end gap-2 mb-3">
            <Button
              onClick={closeModal}
              variant="secondary"
              className="pl-8 pr-8 text-sm h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              variant="primary"
              className="pl-8 pr-8 text-sm h-10"
            >
              Ok
            </Button>
          </div>
        </Modal>
      )}
    </header>
  );
}

export default LandingHeader;

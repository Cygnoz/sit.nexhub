import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "../Components/SearchBar";
import Button from "../Components/Button";
import ChevronLeft from "../assets/icons/ChevronLeft";
import { settingsList } from "../assets/constants/index";
import { useNavigate } from "react-router-dom";
import CloseButton from "../assets/icons/CloseButton";
import SettingsIcons from "../assets/icons/SettingsIcon";

type Props = {};

const SettingsSidebar = ({ }: Props) => {
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  console.log(search);

  const navigate = useNavigate();
  const location = useLocation();

  const [selectedMain, setSelectedMain] = useState<number | null>(null);
  const [selectedSub, setSelectedSub] = useState<{
    mainIndex: number | null;
    subIndex: number | null;
  }>({ mainIndex: null, subIndex: null });

  useEffect(() => {
    settingsList.forEach((main, mainIndex) => {
      if (location.pathname.includes(main.nav)) {
        setSelectedMain(mainIndex);
      }
      main.subhead.forEach((sub, subIndex) => {
        if (location.pathname === sub.subRoute) {
          setSelectedMain(mainIndex);
          setSelectedSub({ mainIndex, subIndex });
        }
      });
    });
  }, [location]);

  const handleSubClick = (mainIndex: number, subIndex: number) => {
    setSelectedMain(mainIndex);
    setSelectedSub({ mainIndex, subIndex });
    setIsSidebarOpen(false); // Close sidebar after selection
  };

  const handleBackClick = () => {
    navigate("/settings");
  };

  return (
    <>
      {/* Overlay (Blocks background content when sidebar is open) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Hamburger Button */}
      <button
        className="sm:hidden fixed top-16 left-3 z-50 bg-white p-2 rounded-md shadow-md"
        onClick={() => setIsSidebarOpen(true)}
      >
        <SettingsIcons />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed sm:relative top-0 left-0 h-full sm:h-auto w-[75%] sm:w-[27%] bg-white border-r-2 border-neutral-300 text-textColor p-6 transition-transform duration-300 ease-in-out
      ${isSidebarOpen ? "translate-x-0 z-[50]" : "-translate-x-full sm:translate-x-0"} 
      sm:z-[10]`}
      >
      {/* Close Button */}
      <button
        className="sm:hidden absolute top-6 right-4 text-black"
        onClick={() => setIsSidebarOpen(false)}
      >
        <CloseButton />
      </button>

      {/* Back Button */}
      <Button onClick={handleBackClick} variant="secondary" size="sm">
        <ChevronLeft color="currentColor" className="h-5 w-5" strokeWidth="2" />
        <p className="text-sm font-medium">Back</p>
      </Button>

      {/* Title & Search */}
      <div className="relative mt-6">
        <p className="text-xl font-bold">Settings</p>
        <div className="mt-4">
          <SearchBar placeholder="Search" onSearchChange={setSearch} searchValue="" />
        </div>
      </div>

      {/* Sidebar Menu */}
      <div className="h-[100vh] overflow-y-auto hide-scrollbar">
        {settingsList.map((main, mainIndex) => (
          <div key={main.nav}>
            <div
              className={`relative flex items-center text-lg gap-3 p-2 my-2 rounded-lg cursor-pointer ${selectedMain === mainIndex || selectedSub.mainIndex === mainIndex
                  ? "bg-[#F3E6E6]"
                  : ""
                }`}
            >
              <main.icon color="currentColor" />
              <p className="font-semibold text-base">{main.nav}</p>
            </div>

            <ul>
              {main.subhead.map((sub, subIndex) => (
                <Link to={sub.subRoute || "#"} key={sub.headName}>
                  <li
                    className={`my-3 text-sm cursor-pointer ${selectedSub.mainIndex === mainIndex && selectedSub.subIndex === subIndex
                        ? "text-[#820000] font-bold"
                        : "font-semibold text-dropdownText"
                      }`}
                    onClick={() => handleSubClick(mainIndex, subIndex)}
                  >
                    {sub.headName}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div >
    </>
  );
};

export default SettingsSidebar;

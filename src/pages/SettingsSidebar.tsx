import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "../Components/SearchBar";
import Button from "../Components/Button";
import ChevronLeft from "../assets/icons/ChevronLeft";
import { settingsList } from "../assets/constants/index";
import { useNavigate } from "react-router-dom";

type Props = {};

const SettingsSidebar = ({}: Props) => {
  const [search, setSearch] = useState("");
  console.log(search);
  
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedMain, setSelectedMain] = useState<number | null>(null);
  const [selectedSub, setSelectedSub] = useState<{
    mainIndex: number | null;
    subIndex: number | null;
  }>({ mainIndex: null, subIndex: null });

  // This effect will run on mount and when the location changes
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

  // const handleMainClick = (index: number) => {
  //   setSelectedMain(index);
  //   setSelectedSub({ mainIndex: index, subIndex: null });
  // };

  const handleSubClick = (mainIndex: number, subIndex: number) => {
    setSelectedMain(mainIndex);
    setSelectedSub({ mainIndex, subIndex });
  };

  const handleBackClick = () => {
    navigate("/settings");
  };



  return (
    <div className="overflow-y-scroll  pt-6 hide-scrollbar col-span-3 border-neutral-300 text-textColor h-auto border-r-2 px-7 bg-white w-[27%]">
      <Button onClick={handleBackClick} variant="secondary" size="sm">
        <ChevronLeft
          color="currentColor"
          className="h-5 w-5"
          strokeWidth="2"
        />
        <p className="text-sm font-medium">Back</p>
      </Button>
      <div className="relative mt-6">
        <p className="text-xl">
          <b>Settings</b>
        </p>
        <div className="mt-4">
          <SearchBar
            placeholder="Search"
            onSearchChange={setSearch}
            searchValue=""
          />
        </div>
      </div>

      <div className="h-[100vh]">
        {settingsList.map((main, mainIndex) => (
          <div key={main.nav}>
            <div
              className={`relative flex items-center text-lg gap-3 p-2 my-2 rounded-lg cursor-pointer ${
                selectedMain === mainIndex ||
                selectedSub.mainIndex === mainIndex
                  ? "bg-[#F3E6E6]"
                  : ""
              }`}
              // onClick={() => handleMainClick(mainIndex)}
            >
              <main.icon color="currentColor" />
              <p className="font-semibold text-base text-textColor">
                {main.nav}
              </p>
            </div>

            <ul>
              {main.subhead.map((sub, subIndex) => (
                <Link to={sub.subRoute || "#"} key={sub.headName}>
                  <li
                    className={`my-3 text-sm cursor-pointer ${
                      selectedSub.mainIndex === mainIndex &&
                      selectedSub.subIndex === subIndex
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
    </div>
  );
};

export default SettingsSidebar;

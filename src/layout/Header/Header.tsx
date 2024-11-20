import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import navlist from "../../assets/constants";
import SettingsIcons from "../../assets/icons/SettingsIcon";
import viewAppsIcon from "../../assets/Images/Frame 629925.png";
import SearchBar from "../../Components/SearchBar";
import { PreviousPathContext } from "../../context/ContextShare";
import useApi from "../../Hooks/useApi";
import { endponits } from "../../Services/apiEndpoints";
import Notification from "./HeaderIcons/Notification";
import Organization from "./HeaderIcons/Organization";
import RefferEarn from "./HeaderIcons/RefferEarn";
type Props = {};

const Header = ({}: Props) => {
  const navigate = useNavigate();
  const { setPreviousPath } = useContext(PreviousPathContext)!;
  
  const handleNavigate = () => {
    navigate("/landing#appsSection");
  };

  const [searchValue, setSearchValue] = useState<string>("");
  const [organizationData, setOrganizationData] = useState<any>(null);
  const { request: getOneOrganization } = useApi("get", 5004);

  const handleLogout = () => {
    ['authToken', 'savedIndex', 'savedSelectedIndex'].forEach(item => localStorage.removeItem(item));
    navigate("/login");
    toast.error("Session expired. Please log in again.");
  };

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const url = `${endponits.GET_ONE_ORGANIZATION}`;
        const apiResponse = await getOneOrganization(url);
        if (!apiResponse.response?.data) {
          handleLogout();
        } else {
          setOrganizationData(apiResponse.response.data);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Error fetching organization data";
        toast.error(errorMessage);
      }
    };

    fetchOrganization();
  }, []);

  const handleGoToSettings = () => {
    navigate("/settings");
  
    // Retrieve values from localStorage and parse them as numbers
    const savedIndex = localStorage.getItem('savedIndex');
    const savedSelectedIndex = localStorage.getItem('savedSelectedIndex');
  
    // Check if values are not null before parsing them as integers
    const index = savedIndex !== null ? parseInt(savedIndex, 10) : 0;
    const selectedIndex = savedSelectedIndex !== null ? parseInt(savedSelectedIndex, 10) : 0;
  
    // Ensure navlist has the appropriate structure and check index bounds
    if (navlist[index]?.subhead?.[selectedIndex]?.subRoute) {
      setPreviousPath(navlist[index].subhead[selectedIndex].subRoute);
    } else {
      console.warn("Invalid index or subhead in navlist.");
    }
  };
  


  return (
    <div
      className="p-4 flex items-center gap-2 w-full border-b-slate-400 border-y-orange-200"
      style={{ borderBottom: "1.5px solid rgba(28, 28, 28, 0.1)" }}
    >
      <Toaster reverseOrder={false} />
      <div className="w-[68%]">
        <SearchBar
          placeholder="Search"
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
      </div>
      <div
        className="flex ms-14 justify-center items-center gap-2 cursor-pointer"
        onClick={handleNavigate}
      >
        <img src={viewAppsIcon} alt="View Apps Icon" />
        <span className="text-xs font-semibold text-dropdownText whitespace-nowrap">
          View Apps
        </span>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <div className="tooltip" data-tooltip="Notifications">
          <Notification />
        </div>
        <div className="tooltip" data-tooltip="Refer & Earn">
          <RefferEarn />
        </div>
        <p onClick={handleGoToSettings} className="tooltip" data-tooltip="Settings">
          <SettingsIcons size="md" />
        </p>
        <div className="tooltip" data-tooltip="Organization">
          <Organization organizationData={organizationData} />
        </div>
      </div>
    </div>
  );
};

export default Header;

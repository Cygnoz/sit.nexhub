import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../../Components/SearchBar";
import SettingsIcons from "../../assets/icons/SettingsIcon";
import Notification from "./HeaderIcons/Notification";
import RefferEarn from "./HeaderIcons/RefferEarn";
import Organization from "./HeaderIcons/Organization";
import { useState, useEffect } from "react";
import viewAppsIcon from "../../assets/Images/Frame 629925.png";
import { endponits } from "../../Services/apiEndpoints";
import useApi from "../../Hooks/useApi";
import toast, { Toaster } from "react-hot-toast";

type Props = {};

const Header = ({ }: Props) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/landing");
  };

  const [searchValue, setSearchValue] = useState<string>("");
  const [organizationData, setOrganizationData] = useState<any>(null);
  const { request: getOneOrganization } = useApi("get", 5004);

  const handleLogout = () => {
    localStorage.clear();
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
        <Link to="/settings" className="tooltip" data-tooltip="Settings">
          <SettingsIcons size="md" />
        </Link>
        <div className="tooltip" data-tooltip="Organization">
          <Organization organizationData={organizationData} />
        </div>
      </div>

    </div>
  );
};

export default Header;

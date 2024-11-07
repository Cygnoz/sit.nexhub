import logo from "../../../public/billbizzlogoLanding.png";
import logoLight from "../../../public/bill-bizz-logo.png";
import ArrowrightUp from '../../assets/icons/ArrowrightUp';
import BellDot from '../../assets/icons/BellDot';
import BellRing from '../../assets/icons/BellRing';
import LogOut from '../../assets/icons/LogOut';
import SearchIcon from '../../assets/icons/SearchIcon';
import Sun from '../../assets/icons/Sun';
import UserRound from '../../assets/icons/UserRound';
import UserRoundCog from '../../assets/icons/UserRoundCog';
import MenuDropdown from '../../Components/menu/MenuDropdown';
import Moon from "../../assets/icons/Moon";
import { useNavigate } from "react-router-dom";
import OrganizationIcon from "../../assets/icons/OrganizationIcon";
import { useState } from "react";
import Modal from "../../Components/model/Modal";
import Button from "../../Components/Button";

type Props = {
  setMode?: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: boolean
};

function LandingHeader({ mode, setMode }: Props) {
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const confirmLogout = () => {
    setLogoutModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    setLogoutModalOpen(false);
  };

  const closeModal = () => {
    setLogoutModalOpen(false);
  };

  return (
    <header className={`${mode ? 'bg-[#EAEBEB]' : 'bg-[#2C353B]'} text-[#DFD1B4] flex items-center justify-between p-4 rounded-full mb-8 px-6`}>
      <div onClick={() => navigate('/landing')} className="flex items-center space-x-2 cursor-pointer">
        <img
          src={mode ? logo : logoLight}
          alt="Bill Bizz Logo"
          className="h-7 w-[22px]"
        />
        <h1 className={`text-lg font-medium ${mode ? 'text-[#303F58]' : 'text-[#F7E7CE]'} `}>BILL BIZZ</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className={`${mode ? 'bg-white' : 'bg-[#404B52]'} rounded-full relative items-center w-[372px] h-[38px] flex gap-1`}>
          <SearchIcon color={mode ? '#303F58' : 'white'} />
          <input placeholder='Search' type="text" className={`ms-9 ${mode ? 'text-[#303F58]' : 'text-white'} bg-[#404B52] outline-none ${mode ? 'bg-white' : 'bg-[#404B52]'}`} />
        </div>
        <button className={`${mode ? 'bg-white' : 'bg-[#404B52]'} text-[#DFD1B4] w-[38px] h-[38px] flex justify-center items-center rounded-full`}>
          <BellDot color={mode ? '#4B5C79' : 'white'} />
        </button>
        <MenuDropdown
          menuItems={[
            {
              label: 'My Profile',
              icon: <UserRound color={mode ? '#4B5C79' : '#DFE1E2'} size="18" />,
              onClick: () => {
                // Directly use item properties
              },
            },
            {
              label: 'Support',
              icon: <UserRoundCog color={mode ? '#4B5C79' : '#DFE1E2'} size={18} />,
              onClick: () => {
                console.log('Delete clicked with id:', 1);
                // handleDelete(item._id); // Directly use item properties
              },
            },
            {
              label: 'My Subscription',
              icon: <BellRing color={mode ? '#4B5C79' : '#DFE1E2'} />,
              onClick: () => {
                console.log('Delete clicked with id:', 1);
                // handleDelete(item._id); // Directly use item properties
              },
            },
            {
              label: 'Log Out',
              icon: <LogOut color={mode ? '#4B5C79' : '#DFE1E2'} />,
              onClick: confirmLogout,
            },
          ]}
          backgroundColor={mode ? "bg-white" : "bg-[#3C474D]"}
          textColor={mode ? 'text-[#4B5C79]' : 'text-[#DFE1E2]'}
          trigger={<OrganizationIcon height="10" width="10" />}
          position="center"
          underline
          underlineColor='text-[#DFE1E2]'
        />

        <button className="bg-[#FCFFED] text-[#585953] text-[12px] w-[138px] h-[38px] rounded-full font-semibold flex items-center justify-center gap-1 ">
          Let's Connect
          <div>
            <ArrowrightUp />
          </div>
        </button>
        <button className={` ${mode ? 'bg-white' : 'bg-[#F3F3F3]'} ${mode ? 'border-[white]' : 'border-[#7A8087]'} p-1 rounded-full border-4 `}>
          <div onClick={() => setMode && setMode(prev => !prev)} className={`${mode ? 'bg-[#F6F6F6]' : 'bg-[#F3F3F3]'} rounded-full`}>
            {mode ? <Moon /> : <Sun />}
          </div>
        </button>
      </div>

      {isLogoutModalOpen && (
        <Modal
          open
          onClose={closeModal}
          className="rounded-lg p-8 w-[546px] h-[160px] text-[#303F58] space-y-8 absolute top-0"
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrganizationIcon from "../../../assets/icons/OrganizationIcon";
import SettingsIcons from "../../../assets/icons/SettingsIcon";
import Button from "../../../Components/Button";
import Drawer from "../../../Components/drawer/drawer";
import Modal from "../../../Components/model/Modal";

type Props = {
  organizationData: any;
};

const Organization = ({ organizationData }: Props) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

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
    <>
      <button onClick={toggleDrawer}>
        <OrganizationIcon />
      </button>

      <Drawer onClose={toggleDrawer} open={isDrawerOpen} position="right">
        <div className="flex items-center justify-between p-5">
          <h5 className="text-md font-semibold text-gray-700">
            My Organizations
          </h5>
          <div className="flex gap-2 items-center">
            <SettingsIcons size="sm" />
            <button
              onClick={toggleDrawer}
              className="font-normal text-textColor hover:text-gray-700 text-3xl -mt-1"
            >
              &times;
            </button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {organizationData ? (
            <div className="flex flex-col border border-slate-200 p-4 rounded-md shadow-sm">
              <div className="flex items-center mb-4">
                <OrganizationIcon />
                <div className="flex-grow">
                  <h5 className="font-bold text-sm text-gray-700">
                    {organizationData.organizationName}
                  </h5>
                  <p className="text-xs text-gray-700">
                    Organization ID: {organizationData.organizationId}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-700">
                Address Line 1: {organizationData.addline1}
              </p>
              <p className="text-xs text-gray-700">
                Address Line 2: {organizationData.addline2}
              </p>
              <p className="text-xs text-gray-700">
                City: {organizationData.city}
              </p>
              <p className="text-xs text-gray-700">
                State: {organizationData.state}
              </p>
              <p className="text-xs text-gray-700">
                Country: {organizationData.organizationCountry}
              </p>
              <p className="text-xs text-gray-700">
                Pincode: {organizationData.pincode}
              </p>
              <p className="text-xs text-gray-700">
                Primary Contact Name: {organizationData.primaryContactName}
              </p>
              <p className="text-xs text-gray-700">
                Primary Contact Number: {organizationData.primaryContactNum}
              </p>
              <p className="text-xs text-gray-700">
                Phone Number: {organizationData.organizationPhNum}
              </p>
              <p className="text-xs text-gray-700">
                Industry: {organizationData.organizationIndustry}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-700">Loading...</p>
          )}
          <div className="flex justify-end">
            <Button
              className="pl-10 pr-10 h-[34px] text-sm"
              onClick={confirmLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </Drawer>

      {isLogoutModalOpen && (
        <Modal
          open
          onClose={closeModal}
          className="rounded-lg p-8 w-[546px] h-[160px] text-[#303F58] space-y-8"
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
    </>
  );
};

export default Organization;

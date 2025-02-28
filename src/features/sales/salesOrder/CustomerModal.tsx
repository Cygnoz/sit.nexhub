import { useEffect, useState } from "react";
import Drawer from "../../../Components/drawer/drawer";
import UserRound from "../../../assets/icons/user-round";
import defaultCustomerImage from "../../../assets/Images/Rectangle 5558.png";
import FactoryIcon from "../../../assets/icons/FactoryIcon";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";

type Props = {
  selectedCustomer: any;
};

function CustomerModal({ selectedCustomer }: Props) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [oneCustomer, setoneCustomer] = useState<any>({});

  const { request: getOneCustomer } = useApi("get", 5002);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };
  const fetchOneCustomer = async () => {
    try {
      const url = `${endponits.GET_ONE_CUSTOMER_DASHBOARD}/${selectedCustomer?._id}`;
      const { response, error } = await getOneCustomer(url);
      if (!error && response) {
        setoneCustomer(response.data);
      }
    } catch (error) {
      console.log("Error in fetching Country", error);
    }
  };
  useEffect(() => {
    fetchOneCustomer()
  }, [selectedCustomer])
  return (
    <div>
      <div>
        <p
          onClick={toggleDrawer}
          className="mt-3 text-bold text-[#820000] flex font-bold items-center cursor-pointer w-48"
        >
          <UserRound color="#820000" />
          <span style={{ marginLeft: "5px" }} className="font-semibold text-sm">
            See customer details
          </span>
        </p>
      </div>
      <Drawer onClose={toggleDrawer} open={isDrawerOpen} position="right"
        style={{ width: "25%", padding: "24px 32px 24px 32px", overflowY: "scroll" }}
        className="hide-scrollbar">
        <div className="flex justify-between items-center">
          <p className="font-bold text-textColor text-lg">Customer details</p>
          <p onClick={toggleDrawer} className="text-textColor cursor-pointer text-3xl font-light">&times;</p>
        </div>
        <div
          className="mt-4 rounded-lg p-6 bg-[#FDF8F0]"

        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-[#303F58] ">Name</p>
              <p className="text-sm font-semibold text-[#4B5C79] mt-1">{selectedCustomer?.customerDisplayName}</p>
            </div>
            <img
              src={defaultCustomerImage}
              alt="Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <hr className="border-t-[#BEC0C2]" />
          <div className="mb-4 mt-2">
            <p className="text-sm text-[#303F58]">Email</p>
            <p className="text-sm font-semibold text-[#4B5C79] mt-1 w-56">
              <span className="block">{selectedCustomer?.customerEmail}</span>
            </p>
          </div>

          <hr className="border-t-[#BEC0C2]" />
          <div className="mb-4 mt-2">
            <p className="text-sm text-[#303F58]">Phone Number</p>
            <p className="text-sm font-semibold text-[#4B5C79] mt-1 w-56">{selectedCustomer?.mobile}</p>
          </div>
          <hr className="border-t-[#BEC0C2]" />
          <div className="mb-4 mt-2">
            <p className="text-sm text-[#303F58]">Opening Balance</p>
            <p className="text-sm font-semibold text-[#4B5C79] mt-1 w-56">₹ {selectedCustomer?.debitOpeningBalance ? selectedCustomer?.debitOpeningBalance : "0.00"}</p>
          </div>
          <hr className="border-t-[#BEC0C2]" />
          <div className="mt-7 flex justify-between items-center">
            {selectedCustomer?.companyName &&
              <div className="flex gap-2">
                <FactoryIcon />
                <p className="text-[#303F58] text-sm font-bold">{selectedCustomer?.companyName}</p>
              </div>}
            <p className="bg-[#78AA86] rounded py-1 px-3 text-xs text-white font-semibold">Active</p>
          </div>



        </div>
        <div className="rounded-lg p-6 mt-4"
          style={{
            background: "linear-gradient(91.71deg, #F2E6DC -19.39%, #FDF8F0 97.82%)",
          }}
        >
          <div className="mb-2 mt-3">
            <p className="text-base font-semibold text-textColor">Total Payment</p>
            <p className="text-lg  font-bold text-[#4B5C79] mt-2.5">{oneCustomer?.totalPayment}</p>
          </div>
          <hr className="border-t-[#BEC0C2]" />
          <div className="mb-2 mt-3">
            <p className="text-base font-semibold text-textColor">Total Sales</p>
            <p className="text-lg font-bold text-[#4B5C79] mt-2.5">{oneCustomer?.totalSales}</p>
          </div>
          <hr className="border-t-[#BEC0C2]" />
          <div className="mb-2 mt-3">
            <p className="text-base font-semibold text-textColor">Outstanding Balance</p>
            <p className="text-lg  font-bold text-[#4B5C79] mt-2.5">₹ {oneCustomer?.outstandingBalance}</p>
          </div>

        </div>
      </Drawer>
    </div>
  );
}

export default CustomerModal;

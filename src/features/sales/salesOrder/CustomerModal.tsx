import { useState } from "react";
import Drawer from "../../../Components/drawer/drawer";
import UserRound from "../../../assets/icons/user-round";
import Button from "../../../Components/Button";
import Pen from "../../../assets/icons/Pen";

type Props = {
  selectedCustomer: any;
};

function CustomerModal({ selectedCustomer }: Props) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };
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
        style={{ width: "30%", padding: "24px 32px 24px 32px", overflowY: "scroll" }}
        className="hide-scrollbar">
        <div className="flex justify-between items-center">
          <p className="font-bold text-textColor text-lg">Customer details</p>
          <p onClick={toggleDrawer} className="text-textColor cursor-pointer text-3xl font-light">&times;</p>
        </div>
        <div
          className="mt-4 rounded-lg p-6"
          style={{
            background: "linear-gradient(91.71deg, #FFE3B8 -19.39%, #FFF3D4 97.82%)",
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-dropdownText ">Name</p>
              <p className="text-sm font-semibold text-textColor mt-1">{selectedCustomer?.customerDisplayName}</p>
            </div>
            <img
              src="https://s3-alpha-sig.figma.com/img/7a20/a2fd/0cefd3324c1f55eaa6dba230a6a337b7?Expires=1730678400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kUK9FrYe73M~H4bqgaCJVsO4tQmSd~hXbk4cGtUoYUbThkIfktL8awA~GRqmfOqw-ei7YJXC~YCIT5a8aqPCM~~Du4Wq7i96ZxpMUlpnPn1j7~ozyEtVRRbe~GjeUV4iesApgyBoeq2ZzUIi5zrfUkHK9558cuDuUmt6RPZUOF8A-OCDEHFuJtkSY4HX1hvXva~IkhJwGzJjIqNIwHzAMAExEUgwXWyessMCJg~SxRNdJFKuNvkbXNyYSGjHUMhPjwaPKAk~U4~B0x-K5D5kfE6dkftE-NILhxK9LrYBqF6TKwHbJNhYO3unc6G5UgLhkijdl5oEnsiyciQ7O7AUfw__"
              alt="Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <hr className="border-t-[#A3A9B3]" />
          <div className="mb-4 mt-2">
            <p className="text-sm text-dropdownText">Address</p>
            <p className="text-sm font-semibold text-textColor mt-1 w-56">
              <span className="block">{selectedCustomer?.billingAddressLine1}</span>
              <span className="block">{selectedCustomer?.billingAddressLine2}</span>
              <span className="block">{selectedCustomer?.billingCountry}</span>
              <span className="block">{selectedCustomer?.billingPinCode}</span>
              <span className="block">{selectedCustomer?.billingState}</span>
            </p>
          </div>

          <hr className="border-t-[#A3A9B3]" />
          <div className="mb-4 mt-2">
            <p className="text-sm text-dropdownText">Card no</p>
            <p className="text-sm font-semibold text-textColor mt-1 w-56">645767878999</p>
          </div>
          <hr className="border-t-[#A3A9B3]" />
          <div className="flex justify-between items-start mb-4 mt-2">
            <div>
              <p className="text-sm text-dropdownText">Total sale bill</p>
              <p className="text-lg font-bold mt-1">07</p>
            </div>
            <div>
              <p className="text-sm cursor-pointer underline text-textColor mt-1 ">
                View history
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="flex">
              <div
                className="px-4 py-2 bg-[#820000] text-white text-sm  rounded-lg rounded-e-none"
              >
                <span className="text-sm">Balance : </span> <span className="font-bold text-base"> 3400</span>
              </div>
              <div
                className="px-4 py-2 bg-[#DED0B9] text-[#0B1320] text-sm  rounded-lg rounded-s-none"
              >
                <span className="text-sm "> Wallet:</span> <span className="text-base font-bold text-textColor">Rs 1000</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#FDF8F0] rounded-lg p-6 mt-4">
          <div className="mb-3">
            <p className="text-base font-bold text-textColor">Revenue</p>
          </div>

          <div className="mb-3">
            <p className="text-sm text-textColor">Sales</p>
            <p className="text-sm font-bold text-textColor mt-1">Rs. 2354.00</p>
          </div>
          <hr className="border-t-[#A3A9B3]" />
          <div className="mb-4 mt-3">
            <p className="text-sm text-textColor">Order</p>
            <p className="text-sm font-bold text-textColor">Rs. 2354.00</p>
          </div>
          <div className="flex justify-center items-center">
            <Button className=" text-sm pl-24 pr-24" size="sm" variant="secondary">
              <Pen color="#565148" /> Edit Customer
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default CustomerModal;

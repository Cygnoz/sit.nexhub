import { Link, useParams } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { CustomerEditResponseContext } from "../../../context/ContextShare";
import toast from "react-hot-toast";
import Overview from "./viewCustomerDetails/Overview";
import SalesHistory from "./viewCustomerDetails/SalesHistory";
import cardBg from "../../../assets/Images/Card 3 Mask.png";
// import walletImage from "../../../assets/Images/Frame 629221.png";
// import walletCashImage from "../../../assets/Images/Frame 629221 (1).png";
import revenueImage from "../../../assets/Images/Frame 629221 (2).png";
import salesImage from "../../../assets/Images/Frame 629221 (3).png";
// import cardBackground from "../../../assets/Images/Frame 629314.png";

interface Status {
  status: string;
}

function SeeCustomerDetails() {
  const param = useParams();
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [customerData, setCustomerData] = useState<any | []>([]);
  const { request: getOneCustomer } = useApi("get", 5002);
  const { request: updateCustomerStatus } = useApi("put", 5002);

  const { customerEditResponse } = useContext(CustomerEditResponseContext)!;
  const [statusData, setStatusData] = useState<Status>({
    status: "",
  });

  const { id } = param;
  const customerId = id ?? ""; // Ensure customerId is always a string
  

  const getCustomer = async () => {
    const url = `${endponits.GET_ONE_CUSTOMER}/${id}`;
    try {
      const apiResponse = await getOneCustomer(url);
      const { response, error } = apiResponse;
      if (!error && response) {
        setCustomerData(response.data);
        setStatusData((prevData) => ({
          ...prevData,
          status: response.data.status,
        }));
      }
    } catch (error) {}
  };

  useEffect(() => {
    getCustomer();
  }, [customerEditResponse]);

  const handleStatusSubmit = async (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStatusData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const url = `${endponits.UPDATE_CUSTOMER_STATUS}/${id}`;
    try {
      const { response, error } = await updateCustomerStatus(url, {
        ...statusData,
        status: value,
      });
      if (!error && response) {
        toast.success(response.data.message);
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {}
  };

  const sideBarHead = [
    { title: "Overview", onclick: () => setSelectedTab("Overview") },
    { title: "Sales History", onclick: () => setSelectedTab("Sales History") },
    // { title: "Wallet Transaction", onclick: () => setSelectedTab("Wallet Transaction") },
    // { title: "Referral Bonus", onclick: () => setSelectedTab("Referral Bonus") },
    // { title: "View Payment", onclick: () => setSelectedTab("View Payment") },
  ];

  return (
    <div className="px-6">
      <div className="bg-white rounded-md p-5">
        <div className="flex items-center gap-5">
          <Link to={"/customer/home"}>
            <div
              style={{ borderRadius: "50%" }}
              className="w-[40px] h-[40px] flex items-center justify-center bg-backButton"
            >
              <CheveronLeftIcon />
            </div>
          </Link>
          <p className="text-textColor text-xl font-bold">Back</p>
        </div>
        <div className="mt-2 flex justify-between">
          {/* 1st card */}
          <div
            className="relative w-[27.9%] h-[146px] rounded-2xl p-4 bg-cover bg-center"
            style={{ backgroundImage: `url(${cardBg})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6B0F1A] to-[#200122] opacity-75 rounded-2xl"></div>
            <div className="relative z-10">
              {/* <p className="text-membershipText text-sm mt-1">
                Privilege Membership Card
              </p> */}
              <div className="flex items-center mt-3">
                {/* <img
                src="https://i.postimg.cc/05XQMpkS/Ellipse-2.png"
                  alt="Profile"
                  className="w-8 h-8 object-cover rounded-full mr-3"
                /> */}
                <div>
                  <p className="text-white text-sm font-semibold mt-1">
                    Jancy Philip
                  </p>
                  <p className="text-membershipText text-xs mt-1">8756347856</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2nd card */}
          {/* <div className="w-[7.7%] h-[148px] p-6 bg-cuscolumnbg rounded-lg text-center">
            <img src={walletImage} alt="" className="object-cover" />
            <p className="mt-2 text-sm font-semibold text-textColor">Wallet</p>
            <p className="mt-1 text-lg font-bold text-textColor">0.00</p>
          </div> */}

          {/* 3rd card */}
          {/* <div className="w-[13.4%] h-[148px] p-6 bg-cuscolumnbg rounded-lg text-center">
            <div className="items-center flex justify-center">
              <img src={walletCashImage} alt="" className="object-cover" />
            </div>
            <p className="mt-2 text-sm font-semibold text-textColor">
              Redeemed Wallet
            </p>
            <p className="mt-1 text-lg font-bold text-textColor">0.00</p>
          </div> */}

          {/* 4th card */}
          <div className="w-[30%] h-[148px] p-6 bg-cuscolumnbg rounded-lg text-center">
            <div className="items-center flex justify-center">
              <img src={revenueImage} alt="" className="object-cover" />
            </div>
            <p className="mt-2 text-sm font-semibold text-textColor">
              Total Revenue
            </p>
            <p className="mt-1 text-lg font-bold text-textColor">5000.00</p>
          </div>

          {/* 5th card */}
          <div className="w-[33%] h-[148px] p-6 bg-cuscolumnbg rounded-lg text-center">
            <div className="items-center flex justify-center">
              <img src={salesImage} alt="" className="object-cover" />
            </div>
            <p className="mt-2 text-sm font-semibold text-textColor">
              Total no of sales
            </p>
            <p className="mt-1 text-lg font-bold text-textColor">5</p>
          </div>

          {/* 6th card */}
          {/* <div
            className="w-[20.65%] h-[148px] p-6 bg-cuscolumnbg rounded-lg text-center"
            style={{ backgroundImage: `url(${cardBackground})` }}
          ></div> */}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 bg-white p-5 my-5 rounded-lg">
        <div className="col-span-3 p-2">
          {sideBarHead.map((item, index) => (
            <div
              key={index}
              className={`rounded-lg my-2 px-3 text-sm py-1.5 cursor-pointer ${
                selectedTab === item.title ? "bg-lightBeige" : "bg-white"
              }`}
              onClick={item.onclick}
            >
              <p>{item.title}</p>
            </div>
          ))}
        </div>

        <div className="col-span-9">
          {/* Pass the required props to the Overview component */}
          {selectedTab === "Overview" && (
            <Overview
              customerData={customerData}
              statusData={statusData}
              customerId={customerId}
              handleStatusSubmit={handleStatusSubmit}
            />
          )}
          {selectedTab === "Sales History" && (
            <SalesHistory
              customerId={customerId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SeeCustomerDetails;

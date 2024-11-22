import { Link, useParams } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { CustomerDeatilsContext, CustomerEditResponseContext } from "../../../context/ContextShare";
import toast from "react-hot-toast";
import Overview from "./viewCustomerDetails/Overview";
import SalesHistory from "./viewCustomerDetails/SalesHistory";
import cardBg from "../../../assets/Images/Card 3 Mask.png";
import walletImage from "../../../assets/Images/shopping_13583280 11.png";
import walletCashImage from "../../../assets/Images/wallet_1027927 1.png";
import salesImage from "../../../assets/Images/shopping-cart_3706316 1.png";
import CardSkeleton from "../../../Components/skeleton/CardSkeleton";
import EditCustomerModal from "./EditCustomerModal";
import Preview from "../../../assets/icons/Preview";
import Payment from "../../../assets/icons/Payment";
import HistoryIcon from "../../../assets/icons/HistoryIcon";
import Button from "../../../Components/Button";
import Trash2 from "../../../assets/icons/Trash2";

interface Status {
  status: string;
}
interface CardData {
  icon: string;
  title: string;
  count: string;
}

function SeeCustomerDetails() {
  const { setCustomerDatials } = useContext(CustomerDeatilsContext)!;

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
        setCustomerDatials(response.data)       
        setStatusData((prevData) => ({
          ...prevData,
          status: response.data.status,
        }));
      }
    } catch (error) { }
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
    } catch (error) { }
  };

  const sideBarHead = [
    { icon: <Preview />, title: "Overview", onclick: () => setSelectedTab("Overview") },
    { icon: <HistoryIcon/>, title: "Sales History", onclick: () => setSelectedTab("Sales History") },
    { icon: <Payment />, title: "View Payment", onclick: () => setSelectedTab("View Payment") },
  ];

  const cards: CardData[] = [
    {
      icon: walletCashImage,
      title: "Total Payment",
      count: "$3,500",
    },
    {
      icon: salesImage,
      title: "Total Sales",
      count: "21",
    },
    {
      icon: walletImage,
      title: "Outstanding Balance",
      count: "$1,500",
    },

  ]


  console.log(customerData);

  return (
    <div className="px-6">
      <div className="bg-white rounded-md p-5">
        <div className=" items-center gap-5 flex justify-between">
          <div className="flex">
            <Link to={"/customer/home"}>
              <div
                style={{ borderRadius: "50%" }}
                className="w-[40px] h-[40px] flex items-center justify-center bg-backButton"
              >
                <CheveronLeftIcon />

              </div>
            </Link>
            <p className="text-textColor mx-2 mt-1.5 text-xl font-bold">Customer Overview</p>

          </div>
          <div className="flex mx-4 gap-2">
            <EditCustomerModal customerDataPorps={customerData} />
            <Button
                  variant="secondary"
                  size="sm"
                  className="text-[10px] h-6 px-4 hidden"
                >
                  <Trash2 color="#585953" /> Delete
                </Button>

          </div>
        </div>
        <div className="mt-2 flex mx-3">
          {/* 1st card */}
          <div
            className="relative w-[27.9%] h-[146px] rounded-2xl p-4 bg-cover bg-center"
            style={{ backgroundImage: `url(${cardBg})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#820000] to-[#2C353B] opacity-75 rounded-2xl"></div>
            <div className="relative z-10">
              {/* <p className="text-membershipText text-sm mt-1">
                Privilege Membership Card
              </p> */}
              <div className=" items-center mt-3">
                <img
                  src={customerData.customerProfile ? customerData.customerProfile : "https://i.postimg.cc/MHh2tQ41/avatar-3814049-1280.webp"}
                  alt="Profile"
                  className="w-8 h-8 object-cover rounded-full mr-3"
                />

                <div>
                  <p className="text-white text-sm font-semibold mt-1">
                    {customerData?.customerDisplayName}
                  </p>
                  <p className="text-membershipText text-xs mt-1">{customerData.mobile}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2nd card */}
          <div className="flex  w-full  ">
            {
              cards.length > 0
                ? cards.map((card) => (
                  <div className=" p-5 w-[27.9%] h-[148px] ms-14 bg-cuscolumnbg rounded-lg ">
                    <img className="w-6 h-6" src={card.icon} alt="" />
                    <h1 className="text-[#4B5C79] text-sm font-semibold my-2">{card.title}</h1>
                    <h1>{card.count}</h1>
                  </div>

                ))
                :
                Array.from({ length: 3 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}

          </div>

        </div>
      </div>

      <div className="gap-6 bg-white p-5 my-5 rounded-lg">
        <div className="flex max-w-full">
          {sideBarHead.map((item, index) => (
            <div
              key={index}
              className={`rounded-lg w-full text-center my-2 px-3 text-sm py-1.5 cursor-pointer ${selectedTab === item.title ? "bg-lightBeige" : "bg-white"
                }`}
              onClick={item.onclick}
            >
              <div className="flex items-center justify-center space-x-2 py-.05"> {/* Flexbox to align horizontally */}
                {/* Render the icon */}
                <span className="text-xl">{item.icon}</span> {/* Adjust icon size if needed */}
                <p className="text-sm">{item.title}</p>
              </div>
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

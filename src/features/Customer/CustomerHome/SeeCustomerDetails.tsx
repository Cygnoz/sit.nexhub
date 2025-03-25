import { Link, useNavigate, useParams } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import {
  CustomerDeatilsContext,
  CustomerEditResponseContext,
} from "../../../context/ContextShare";
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
// import Payment from "../../../assets/icons/Payment";
// import HistoryIcon from "../../../assets/icons/HistoryIcon";
import Button from "../../../Components/Button";
import Trash2 from "../../../assets/icons/Trash2";
import ArrowRightLeft from "../../../assets/icons/ArrowRightLeft";
import NewspaperIcon from "../../../assets/icons/NewspaperIcon";
import PaymenttHistory from "./viewCustomerDetails/PaymentHistory";
import ConfirmModal from "../../../Components/ConfirmModal";

interface Status {
  status: string;
}

function SeeCustomerDetails() {
  const { setCustomerDatials } = useContext(CustomerDeatilsContext)!;

  const param = useParams();
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [customerData, setCustomerData] = useState<any | []>([]);
  const [customerDashboardData, setCustomerDashboardData] = useState<any | []>(
    []
  );
  const [Currency, setCurrency] = useState<any>([]);
  const navigate = useNavigate();

  const { request: getOneCustomer } = useApi("get", 5002);
  const { request: updateCustomerStatus } = useApi("put", 5002);
  const { request: getCurrencies } = useApi("get", 5004);
  const { request: deleteData } = useApi("delete", 5002);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const confirmDelete = () => {
    setConfirmModalOpen(true);
  };

  const { customerEditResponse } = useContext(CustomerEditResponseContext)!;
  const [statusData, setStatusData] = useState<Status>({
    status: "",
  });

  const { id } = param;
  const customerId = id ?? "";
  const getCurrency = async () => {
    try {
      const url = `${endponits.GET_CURRENCIES}`;
      const { response, error } = await getCurrencies(url);

      if (!error && response) {
        const currencies = response.data;
        const baseCurrency =
          currencies.find((currency: any) => currency.baseCurrency) ||
          currencies[0];
        setCurrency(baseCurrency);
      }
    } catch (error) {
      console.log("Error in fetching currencies", error);
    }
  };
  const getCustomer = async () => {
    const urls = [
      `${endponits.GET_ONE_CUSTOMER}/${id}`,
      `${endponits.GET_ONE_CUSTOMER_DASHBOARD}/${id}`,
    ];

    try {
      const [customerResponse, dashboardResponse] = await Promise.all(
        urls.map((url) => getOneCustomer(url))
      );

      const customerData = customerResponse?.response?.data || {};
      const dashboardData = dashboardResponse?.response?.data || {};

      setCustomerData(customerData);
      setCustomerDatials(customerData);
      setCustomerDashboardData(dashboardData);

      setCustomerDashboardData([
        {
          icon: walletCashImage,
          title: "Total Payment",
          count: dashboardData.totalPayment || 0,
        },
        {
          icon: salesImage,
          title: "Total Sales",
          count: dashboardData.totalSales || 0,
        },
        {
          icon: walletImage,
          title: "Outstanding Balance",
          count: dashboardData.outstandingBalance || 0,
        },
      ]);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  useEffect(() => {
    getCustomer();
    getCurrency();
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
    {
      icon: <Preview />,
      title: "Overview",
      onclick: () => setSelectedTab("Overview"),
    },
    {
      icon: <ArrowRightLeft size={18} color={"currentColor"} />,
      title: "Invoice History",
      onclick: () => setSelectedTab("Invoice History"),
    },

    {
      icon: <NewspaperIcon  color={"currentColor"} />,
      title: "View Payment",
      onclick: () => setSelectedTab("View Payment"),
    },
  ];

  useEffect(() => {
    if (customerData) {
      setStatusData({ status: customerData.status });
    }
  }, [customerData]);

  const handleDelete = async () => {
    try {
      let url = `${endponits.DELETE_CUSTOMER}/${id}`
      if (!url) return;
      const { response, error } = await deleteData(url);
      if (!error && response) {
        toast.success(response.data.message)
        setConfirmModalOpen(false)
          setTimeout(() => {
            navigate("/customer/home");
          }, 1000);   
      
      } else{
        toast.error(error.response.data.message)
      }
    } catch (error) {
      console.error("Error in deleting item:", error);
    }
  };

  return (
    <div className="px-6">
      <div className="bg-white rounded-md p-5">
        <div className=" items-center gap-5 flex-row sm:flex justify-between">
          <div className="flex">
            <Link to={"/customer/home"}>
              <div
                style={{ borderRadius: "50%" }}
                className="w-[40px] h-[40px] flex items-center justify-center bg-backButton"
              >
                <CheveronLeftIcon />
              </div>
            </Link>
            <p className="text-textColor mx-2 mt-1.5 text-xl font-bold">
              Customer Overview
            </p>
          </div>
          <div className="flex mx-4 gap-2 mt-1">
            <EditCustomerModal customerDataPorps={customerData} />
            <Button onClick={confirmDelete}
              variant="secondary"
              size="sm"
              className="text-[10px] h-6 px-4 "
            >
              <Trash2 color="#585953" /> Delete
            </Button>
          </div>
        </div>
        <div className="mt-2 flex-row sm:flex mx-3 overflow-x-auto">
          <div
            className="relative w-full sm:w-[27.9%] h-[146px] rounded-2xl p-4 bg-cover bg-center"
            style={{ backgroundImage: `url(${cardBg})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#820000] to-[#2C353B] opacity-90 rounded-2xl"></div>
            <div className="relative z-10">
              {/* <p className="text-membershipText text-sm mt-1">
                Privilege Membership Card
              </p> */}
              <div className=" items-center mt-3 overflow-x-auto">
                <img
                  src={
                    customerData.customerProfile
                      ? customerData.customerProfile
                      : "https://i.postimg.cc/MHh2tQ41/avatar-3814049-1280.webp"
                  }
                  alt="Profile"
                  className="w-8 h-8 object-cover rounded-full mr-3"
                />

                <div>
                  <p className="text-white text-sm font-semibold mt-1">
                    {customerData?.customerDisplayName}
                  </p>
                  <p className="text-membershipText text-xs mt-1">
                    {customerData.mobile}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-row sm:flex  w-full  ">
            {customerDashboardData.length > 0
              ? customerDashboardData.map((card: any) => (
                  <div className=" p-5 w-full sm:w-[27.9%] h-[148px] my-2 sm:my-0 ms-0 sm:ms-14 bg-cuscolumnbg rounded-lg overflow-x-auto hide-scrollbar">
                    <img className="w-6 h-6" src={card.icon} alt="" />
                    <h1 className="text-[#4B5C79] text-sm font-semibold my-2">
                      {card.title}
                    </h1>
                    <h1>
                      {card.title !== "Total Sales"
                        ? Currency.currencySymbol
                        : ""}{" "}
                      {card.count}
                    </h1>
                  </div>
                ))
              : Array.from({ length: 3 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
          </div>
        </div>
      </div>

      <div className="gap-6 bg-white p-5 my-5 rounded-lg">
        <div className="flex max-w-full overflow-x-auto">
          {sideBarHead.map((item, index) => (
            <div
              key={index}
              className={`rounded-lg w-full text-center my-2 px-3 text-sm py-1.5 cursor-pointer text-textColor font-semibold ${
                selectedTab === item.title ? "bg-lightBeige" : "bg-white"
              }`}
              onClick={item.onclick}
            >
              <div className="flex items-center justify-center space-x-2 py-.05">
                {" "}
               
                <span className="text-xl">{item.icon}</span>{" "}
                <p className="text-sm">{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className=" col-span-9">
          {selectedTab === "Overview" && (
            <Overview
              customerData={customerData}
              statusData={statusData}
              customerId={customerId}
              handleStatusSubmit={handleStatusSubmit}
            />
          )}
          {selectedTab === "Invoice History" && (
        <SalesHistory customerId={customerId} />
          )}
           {selectedTab === "View Payment" && (
        <PaymenttHistory customerId={customerId} />
          )}
        </div>
      </div>
      <ConfirmModal
        open={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete?"
      />
    </div>
  );
}

export default SeeCustomerDetails;

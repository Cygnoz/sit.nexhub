import ArrowIconNoUnderline from "../../assets/icons/ArrowIconNoUnderline";
import ArrowrightUp from "../../assets/icons/ArrowrightUp";
import CehvronDown from "../../assets/icons/CehvronDown";
import TimerIcon from "../../assets/icons/TimerIcon";
import accVector1 from "../../assets/Images/AccVector1.png";
import accVector2 from "../../assets/Images/AccVector2.png";
import chatVector1 from "../../assets/Images/chatAIVector1.png";
import chatVector2 from "../../assets/Images/chatAIVector2.png";
import customerVector from "../../assets/Images/customerVector.png";
import expenseVector from "../../assets/Images/expenseVector.png";
import inventoryImg from "../../assets/Images/InventoryImg.png";
import inventoryVector from "../../assets/Images/inventoryVector.png";
import manageSalesImg from "../../assets/Images/manageSalesImg.png";
import purchaseVector from "../../assets/Images/purchaseVector.png";
import salesVector from "../../assets/Images/salesVector.png";
import supplierVector from "../../assets/Images/supplierVector.png";
import droidBilly from "../../assets/Images/billieImage.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Frame from "../Cygnoboat/Frame";

type Props = {
  setMode?: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: boolean;
};

const LandingContant = ({ mode, setMode }: Props) => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const handleModalToggle = () => {
    setIsPopupOpen((prev) => !prev)
  }
  const handleNavigation = (route: string, index: number) => {
    localStorage.setItem("savedIndex", index.toString());
    localStorage.setItem("savedSelectedIndex", "0");
    navigate(route);
  };

  useEffect(() => {
    // Retrieve mode from localStorage, if it exists
    const storedMode = localStorage.getItem("mode");
    if (storedMode !== null) {
      setMode?.(storedMode === "true");
    }
  }, [setMode]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 lg:grid-cols-12 relative">

      <div className=" sm:col-span-1 md:col-span-8 lg:col-span-9 ">
        <div className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-12 gap-3">

          <div className="col-span-7 sm:col-span-5">
            <div
              onClick={() => handleNavigation("/sales/salesorder", 3)}
              className={`w-[100%]  h-[260px] rounded-2xl ${mode ? "bg-[#DED0B9]" : "bg-[#565148]"
                } cursor-pointer  relative overflow-hidden p-6 flex flex-col`}
            >
              <img
                className="absolute right-0 bottom-0"
                src={salesVector}
                alt=""
              />
              {/* Header Buttons */}
              <div className="flex  justify-between items-center">
                <div className="flex space-x-3 items-center">
                  <button
                    className={` ${mode ? "bg-[#948B7C]" : "bg-[#C4B8A3]"
                      } text-white text-sm w-[62px] h-[35px] rounded-lg`}
                  >
                    Sales
                  </button>
                  <div className="hidden">

                    <button
                      className={`${mode ? "bg-[#948B7C]" : "bg-[#726e66]"
                        } text-white space-x-2  text-sm w-[160px] h-[28px] rounded-md flex items-center justify-center `}
                    >
                      <TimerIcon />
                      <p className="">Recently Opened</p>
                    </button>
                  </div>
                </div>
                {/* Arrow Button */}

                <div className="flex justify-end cursor-pointer">
                  <div
                    className={`${mode ? "bg-[#948B7C]" : "bg-[#90887A]"
                      } text-white h-[52px] w-[52px] flex items-center justify-center rounded-full `}
                  >
                    <ArrowrightUp size={30} stroke={1} />
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div
                className={`mt-2 ${mode ? "text-[#303F58]" : "text-white"} `}
              >
                <p className="text-[32px] ">
                  Manage <span className="font-bold">Sales</span>
                </p>
                <p className="w-52 text-[32px] ">Workflow Solution</p>
              </div>

              <img
                src={manageSalesImg}
                alt=""
                className="absolute -right-16 sm:-right-12 -bottom-7 w-[250px] sm:w-[326px] h-[140px] sm:h-[177px]"
              />
            </div>
          </div>
          <div className="relative col-span-7">
            <div
              onClick={() => handleNavigation("/inventory", 1)}
              className="w-[100%] sm:w-[97%] h-[260px]  cursor-pointer relative overflow-hidden  rounded-2xl"
            >
              <img
                src={inventoryVector}
                className="absolute overflow-hidden right-20 top-[2px] z-100"
                alt=""
              />
              {/* Image section */}
              <img
                src={inventoryImg}
                alt="Manage Sales"
                className="absolute z-90 bottom-[-40px] right-[-90px]  sm:right-[-130px]  w-[520px] h-auto object-cover"
                style={{ clipPath: "inset(0 0 0 0)" }}
              />
              {/* Arrow icon in the top right corner inside a circle   */}
              <div
                className={`${mode ? "bg-white" : "bg-[#1A2023]"
                  } cursor-pointer z-100 w-[98px] h-[63px] absolute top-[2px] right-[7px] flex items-center justify-center rounded-bl-2xl`}
              >
                <div
                  onClick={() => handleNavigation("/inventory", 1)}
                  className={`flex items-center justify-center  w-[52px] h-[52px]  ${mode ? "bg-[#97998E]" : "bg-[#2C353B]"
                    } rounded-full`}
                >
                  <ArrowrightUp size={30} stroke={1} />
                </div>
              </div>
              <div
                className={`absolute ${mode ? "bg-[#CACCBE]" : "bg-[#2C353B]"
                  }  rounded-2xl overflow-hidden bg-[#2C353B] rounded-bl-none w-[505px] h-[70px] -top-2 -left-2 transform translate-x-[10px] translate-y-[10px] pt-8 ps-4`}
              >
                <button className="bg-[#0F1315] text-white text-sm px-[10px] py-[8px] h-[35px] rounded-lg">
                  Inventory
                </button>
              </div>
              <div
                className={`absolute  rounded-r-2xl ${mode ? "bg-[#CACCBE]" : "bg-[#2C353B]"
                  }  w-[600px] h-[195px] top-[60px] -left-[8px]  transform translate-x-[10px] translate-y-[10px] px-4`}
              >
                <div className="flex flex-col  justify-center h-[85%] z-30">
                  <p
                    className={`w-[260px] text-[32px] ${mode ? "text-[#303F58]" : "text-white"
                      }`}
                  >
                    Track and manage <span className="font-bold"> stock </span>{" "}
                    efficiently{" "}
                  </p>
                </div>
              </div>
              <div
                className={`absolute ${mode ? "bg-[#CACCBE]" : "bg-[#2C353B]"
                  }  rounded-r-2xl bg-[#2C353B] w-[105px] h-[198px] z-50  top-[63px] right-0`}
              ></div>
            </div>
          </div>
          <div className="col-span-7 sm:col-span-3">
            <div
              className={`w-[100%] sm:w-[98%] rounded-2xl ${mode ? "bg-[#C9CCBA]" : "bg-[#3A3E40]"
                }  h-[250px] sm:h-[304px] px-4 py-2 sm:py-6 relative z-50`}
            >
              <img
                src={customerVector}
                className="absolute bottom-[2px] h-[245px] sm:h-[0px] -z-10 right-3"
                alt=""
              />
              <div className="flex justify-between items-center mb-5 sm:mb-0">
                <button
                  className={` ${mode ? "bg-[#71736B]" : "bg-[#495053]"
                    } text-white text-sm px-[10px] py-[8px] h-[35px] rounded-lg`}
                >
                  Customer
                </button>
                <button
                  onClick={() => handleNavigation("/customer/home", 2)}
                  className={` ${mode ? "bg-[#585953]" : "bg-[#595F62]"
                    } text-white h-[42px] w-[42px] flex items-center justify-center rounded-full`}
                >
                  <ArrowrightUp size={30} stroke={1} />
                </button>
              </div>
              <div className="flex flex-col  justify-center  h-[60%] sm:h-[85%] z-30">
                <p
                  className={`w-[200px] text-[28px] sm:text-[24px] ${mode ? "text-[#303F58]" : "text-white"
                    }`}
                >
                  Efficient <span className="font-bold">Customer</span>{" "}
                  Management System
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-7 sm:col-span-3">
            <div
              className={`w-[100%] sm:w-[98%]  rounded-2xl ${mode ? "bg-[#DFE1E2]" : "bg-[#585953]"
                } h-[250px] sm:h-[304px] z-50  relative px-4  py-2 sm:py-6`}
            >
              <img
                src={purchaseVector}
                className={`absolute top-0 right-0 -z-10 ${mode && "opacity-35"
                  }`}
                alt=""
              />
              <div className="flex justify-between items-center mb-5 sm:mb-0">
                <button
                  className={`${mode ? "bg-white" : "bg-[#71736B]"} ${mode ? "text-[#303F58]" : "text-white"
                    } text-sm px-[10px] py-[8px] font-medium h-[35px] rounded-lg`}
                >
                  Purchase
                </button>
                <button
                  onClick={() =>
                    handleNavigation("/purchase/purchase-order", 8)
                  }
                  className="bg-[#FEFBF8] text-white h-[42px] w-[42px] flex items-center justify-center rounded-full"
                >
                  <ArrowrightUp color="black" size={30} stroke={1} />
                </button>
              </div>
              <div className="flex flex-col  justify-center h-[60%] sm:h-[85%] z-30">
                <p
                  className={`w-[182px] text-[28px] sm:text-[24px] ${mode ? "text-[#303F58]" : "text-white"
                    }`}
                >
                  Streamlined <span className="font-bold">Purchase</span>{" "}
                  Workflow Hub
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-7 sm:col-span-3">
            <div
              className={`w-[100%] sm:w-[98%] rounded-2xl relative  ${mode ? "bg-[#DFE1E2]" : "bg-[#283035]"
                } h-[220px] sm:h-[304px] px-4 py-6 z-50`}
            >
              <img
                src={expenseVector}
                className={`absolute right-0 top-0 -z-10 ${mode && "opacity-35"
                  }`}
                alt=""
              />
              <div className="flex justify-between items-center mb-2 sm:mb-0">
                <button
                  className={`${mode ? "bg-white" : "bg-[#14181B]"
                    } font-medium ${mode ? "text-[#303F58]" : "text-white"
                    } text-sm px-[10px] py-[8px] h-[35px] rounded-lg`}
                >
                  Expense
                </button>
                <button
                  onClick={() => handleNavigation("/expense/home", 6)}
                  className={`${mode ? "bg-[#FEFBF8]" : "bg-[#283035]"
                    } text-white h-[42px] w-[42px] flex items-center justify-center rounded-full`}
                >
                  <ArrowrightUp
                    color={mode ? "black" : "currentColor"}
                    size={30}
                    stroke={1}
                  />
                </button>
              </div>
              <div className="flex flex-col  justify-center h-[60%] sm:h-[85%] z-40">
                <p
                  className={`w-[185px] ${mode ? "text-[#303F58]" : "text-white"
                    } text-[28px] sm:text-[24px]`}
                >
                  Advanced <span className="font-bold">Expense</span> Control
                  Hub
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-7 sm:col-span-3">
            <div
              className={`w-[100%] sm:w-[95%] rounded-2xl mb-3 sm:mb-0  ${mode ? "bg-[#F7E7CE]" : "bg-[#626552]"
                } relative h-[250px] sm:h-[304px] px-4 py-6 z-50`}
            >
              <img
                src={supplierVector}
                className="absolute top-0 h-[250px] sm:h-[0px] right-10"
                alt=""
              />
              <div className="flex justify-between items-center mb-6 sm:mb-0">
                <button
                  className={`${mode ? "bg-[#DED0B9]" : "bg-[#97998E]"
                    } font-medium ${mode ? "text-[#303F58]" : "text-white"
                    } text-sm px-[10px] py-[8px] h-[35px] rounded-lg`}
                >
                  Supplier
                </button>
                <button
                  onClick={() => handleNavigation("/supplier/home", 5)}
                  className={`${mode ? "bg-[#DED0B9]" : "bg-[#97998E]"
                    }  text-white h-[42px] w-[42px] flex items-center justify-center rounded-full`}
                >
                  <ArrowrightUp
                    color={mode ? "#303F58" : "currentColor"}
                    size={30}
                    stroke={1}
                  />
                </button>
              </div>
              <div className="flex flex-col  justify-center h-[60%] sm:h-[85%] z-40">
                <p
                  className={`w-[177px] text-[28px] sm:text-[24px]  ${mode ? "text-[#303F58]" : "text-white"
                    }`}
                >
                  Efficient <span className="font-bold">Supplier</span>{" "}
                  Management System{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sm:col-span-1 md:col-span-4 lg:col-span-3  space-y-4">
        <div
          className={`w-[100%] h-[250px] sm:h-[437px] rounded-2xl relative ${mode ? "bg-[#CFAE7D]" : "bg-[#948B7C]"
            } px-4 py-6 z-50`}
        >
          <img
            src={accVector1}
            className="absolute -right-8 sm:-right-10 h-[190px] sm:h-[0px] top-20 -z-10"
            alt=""
          />
          <img
            src={accVector2}
            className="absolute -bottom-[85px]  left-0 -z-10"
            alt=""
          />
          <div className="flex justify-between items-center">
            <button
              className={`${mode ? "bg-[#948B7C]" : "bg-[#C4B8A3]"
                } text-white text-sm px-[10px] py-[8px] h-[35px] rounded-lg`}
            >
              Accountant
            </button>
            <button
              onClick={() =>
                handleNavigation("/accountant/chart-OF-accountant", 4)
              }
              className={`${mode ? "bg-[#B9AD9B]" : "bg-[#565148]"
                } text-white h-[42px] w-[42px] flex items-center justify-center rounded-full`}
            >
              <ArrowrightUp size={30} stroke={1} />
            </button>
          </div>
          <div className="flex flex-col  justify-center h-[85%] z-40">
            <p
              className={`w-[272px] text-[32px] ${mode ? "text-[#303F58]" : "text-white"
                }`}
            >
              Manage <span className="font-bold">Finance</span> and Generate
              Reports
            </p>
          </div>
        </div>
        <div
          className="h-[120px] w-[100%] rounded-2xl relative p-4 flex justify-between items-center z-50 overflow-hidden"
          style={{
            background: mode
              ? "linear-gradient(to right, #F7E7CE, #FEFFF9, #CACCBE)"
              : "linear-gradient(to right, #2C2F34, #4C4F55, #8A8C91, #B4B6BA)",
          }}
        >
          <img
            src={droidBilly}
            className="w-[125px] absolute "
            alt=""
          />
          <img
            src={chatVector1}
            className="-z-10 absolute right-20 top-0"
            alt=""
          />
          <img
            src={chatVector2}
            className="-z-10 absolute right-0 bottom-0"
            alt=""
          />
          <p
            className={`w-[140px] text-[24px]  absolute right-5 sm:right-7 bottom-5 ${mode ? "text-[#303F58]" : "text-white"
              }`}
          >
            Let's  <br />
            <span className="font-bold text-[24px]">Connect!</span>
          </p>
          <button
            onClick={handleModalToggle}
            className="bg-[#F6F6F6] absolute right-3 top-4 text-white h-[49px] w-[49px] flex items-center justify-center rounded-full"
          >
            <ArrowIconNoUnderline
              className="transform rotate-90"
              color="#585953"
              stroke={1}
              size={30}
            />
          </button>
        </div>
      </div>
      <div>
        <button
          className={`absolute z-60 right-[50%] translate-x-[50%] ${mode ? "bg-white" : "bg-[#1A282F]"
            } rounded-full -bottom-6 h-[55px] w-[150px] flex items-center rotate-border shadow-xl`}
        ></button>
        <button
          className={`absolute z-70 right-[50%] translate-x-[50%] ${mode ? "bg-white" : "bg-[#1A282F]"
            } rounded-full -bottom-5 px-4 py-3 ${mode && "text-[#C2A270]"
            } flex items-center`}
          onClick={() => {
            document
              .getElementById("appsSection")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          More Apps <CehvronDown color={mode ? "#C2A270" : "white"} />
        </button>
      </div>
      {isPopupOpen &&
        <Frame
          isOpen={isPopupOpen}
          onClose={handleModalToggle}
          url={`https://dev.solytics.online/main?projectName=BillBizz`}
        />
      }
    </div>
  );
};

export default LandingContant;

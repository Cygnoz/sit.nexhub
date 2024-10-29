import { useParams } from "react-router-dom";
// import ArrowRight from "../../../../assets/icons/ArrowRight";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import MailIcon from "../../../../assets/icons/MailIcon";
import Pen from "../../../../assets/icons/Pen";
import PhoneIcon from "../../../../assets/icons/PhoneIcon";
import Button from "../../../../Components/Button";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import EditSupplier from "../EditSupplier";
// import ExpensesGraph from "./ExpensesGraph";

// import ShoppingCart from "../../../../assets/icons/ShoppingCart"
// import NewspaperIcon from "../../../../assets/icons/NewspaperIcon"
// import UserRound from "../../../../assets/icons/user-round"

interface Status {
  status: any;
}

interface OverviewProps {
  supplier: any;
  statusData: Status;
  setStatusData: React.Dispatch<React.SetStateAction<Status>>;
}

const Overview: React.FC<OverviewProps> = ({
  supplier,
  statusData,
  setStatusData,
}) => {
  const { id } = useParams<{ id: string }>();
  const { request: updateSupplierStatus } = useApi("put", 5009);
  const { request: getSupplierHistory } = useApi("get", 5009);
  const [addressEdit, setAddressEdit] = useState<string>();
  const [supplierHis, setSupplierHis] = useState<any>();
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = (billing?: string, shipping?: string) => {
    setModalOpen((prev) => !prev);
    if (billing === "billing") {
      setAddressEdit("billingAddressEdit");
    } else if (shipping === "shipping") {
      setAddressEdit("shippingAddressEdit");
    } else {
      setAddressEdit("");
    }
  };

  const closeModal = () => {
    setModalOpen((prev) => !prev);
  };

  useEffect(() => {
    supplierHistory();
  }, []);

  console.log(id);

  const supplierHistory = async () => {
    try {
      const url = `${endponits.GET_ONE_SUPPLIER_HISTORY}/${id}`;
      const apiResponse = await getSupplierHistory(url);
      const { response, error } = apiResponse;
      if (!error && response) {
        setSupplierHis(response.data);
        console.log(response);
      } else {
        console.error(
          "API Error:",
          error?.response?.data?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const getCircleStyle = (title: string) => {
    switch (title) {
      case "Purchase Order":
        return { bgColor: "bg-[#820000]", text: "hi" };
      case "Contact Added":
        return { bgColor: "bg-[#97998E]", text: "tg" };
      case "Invoice Created":
        return { bgColor: "bg-[#B9AD9B]", text: "rss" };
      default:
        return { bgColor: "bg-[#820000]", text: "" }; // Default style
    }
  };

  const handleStatusSubmit = async (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setStatusData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const url = `${endponits.UPDATE_SUPPLIER_STATUS}/${id}`;
    try {
      const { response, error } = await updateSupplierStatus(url, {
        ...statusData,
        status: value, // Pass the updated status value here
      });
      if (!error && response) {
        toast.success(response.data.message);
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {}
  };
  useEffect(() => {
    setStatusData({ ...statusData, status: supplier?.status });
  }, [supplier]);

  console.log(supplier?.status);
  const formatDateTime = (dateString: string) => {
    const [datePart, timePart] = dateString.split(" ");
    const [hoursString, minutes] = timePart.split(":");

    let period = "AM";

    let hours = parseInt(hoursString);

    if (hours >= 12) {
      period = "PM";
      hours = hours > 12 ? hours - 12 : hours;
    } else if (hours === 0) {
      hours = 12;
    }

    const formattedTime = `${hours}:${minutes} ${period}`;

    return { date: datePart, time: formattedTime };
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-8 space-y-3  h-auto">
          <div className="bg-[#F3F3F3] rounded-lg h-[108px] w-full p-4 space-y-5">
            <div className="flex items-center  gap-2">
              {/* <p className="w-8 bg-[url('https://s3-alpha-sig.figma.com/img/b0b0/fef6/46944393f2dbab75baf0521d6db03606?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=JKaYgp-3a-l3Mf9djW8iztMnXKkdU5qi-Vzu1r6EF~4m9a4sKcenmPbkWEgYfuvH83yiC1c0-8cOgq3p228EXebKTMMi8T4gFgA64-5HSFVl8tSi0oe~74-p09C~xEfm8RAKoLvqiyOoLjutLIvjkzFbMY7tIaVI5ktUcNxMS3dUTAQy2SFmp96jLZhGyifx8DpEvxFy58Z~orck26rD8tVRYl5z4sg6XSgJ~c-C5mQqLRV6TybKP79Ir8PrD~PNZQjt75zlVN9PN2TfMAY96syGUde0ChnsL~6R5hWhaFIQwIrXogU2HcpUiF-J5YVJnLXRRRGbSCRSJTtl4dGJXA__')] bg-cover h-8 rounded-full"></p> */}
              <div className="flex items-center gap-1">
                <p>Supplier Name:</p>
                <p className="pr-3 border-r-[1px] font-bold text-[16px] border-borderRight">
                  {supplier?.supplierDisplayName}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <p>Company Name:</p>
                <p className="font-bold text-[16px] ps-2">
                  {supplier?.companyName}
                </p>
              </div>
              <p
                className={`${
                  statusData.status == "Active" ? "bg-[#78AA86]" : "bg-zinc-400"
                } text-[8px] rounded items-center ms-auto text-white px-2 h-[18px] flex justify-center`}
              >
                {statusData.status}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="text-[14px] flex items-center gap-1 pr-3 border-r-[1px] border-borderRight">
                  <MailIcon size={16} color="#565148" />
                  <p>{supplier?.supplierEmail}</p>
                </div>
                <p className="text-[14px] ps-3  flex items-center gap-1">
                  <PhoneIcon color="#565148" size={16} /> {supplier?.mobile}
                </p>
              </div>
              <div className="flex gap-1 items-center">
                <Button
                  onClick={() => openModal()}
                  variant="secondary"
                  className="h-[26px] w-[68px] text-[12px]  items-center justify-center"
                >
                  <Pen size={14} color="#565148" />{" "}
                  <p className="text-sm font-medium">Edit</p>
                </Button>
                <EditSupplier
                  isModalOpen={isModalOpen}
                  openModal={openModal}
                  closeModal={closeModal}
                  supplier={supplier}
                  addressEdit={addressEdit}
                />
                <select
                  id=""
                  className=" p-1 text-[13px] font-medium text-[#565148]  bg-[#FEFDFA] border-[#565148] rounded-md border "
                  value={statusData.status}
                  name="status"
                  onChange={handleStatusSubmit}
                >
                  <option value="Active">Active </option>
                  <option value="Inactive">
                    <div>Inactive</div>
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 justify-between">
            <div className="w-[98%] h-[200px]  space-y-3 p-[10px] rounded-lg bg-[#FDF8F0]">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[14px]">Billing Addresss</h3>
                <div
                  className="cursor-pointer"
                  onClick={() => openModal("billing")}
                >
                  <Pen color="#303F58" />
                </div>
              </div>
              <div className="flex flex-col space-y-2 text-[12px]">
                <p>{supplier?.billingCity}</p>
                <p>{supplier?.billingAddressStreet1}</p>
                <p>{supplier?.billingAddressStreet2}</p>
                <p>pin {supplier?.billingPinCode}</p>
                <p>Phone:{supplier?.billingPhone}</p>
                <p>
                  {supplier?.billingState} {supplier?.billingCountry}
                </p>
              </div>
            </div>
            <div className="w-[98%] h-[200px]  space-y-3 p-[10px] rounded-lg bg-[#FCFFED]">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[14px]">Shipping Addresss</h3>
                <p
                  className="cursor-pointer"
                  onClick={() => openModal("", "shipping")}
                >
                  <Pen color="#303F58" />
                </p>
              </div>
              <div className="flex flex-col space-y-2 text-[12px]">
                <p>{supplier?.shippingCity}</p>
                <p>{supplier?.shippingAddressStreet1}</p>
                <p>{supplier?.shippingAddressStreet2}</p>
                <p>pin {supplier?.shippingPinCode}</p>
                <p>Phone:{supplier?.shippingPhone}</p>
                <p>
                  {supplier?.shippingState} {supplier?.shippingCountry}
                </p>
              </div>
            </div>
            <div className="w-[100%] h-[200px]  space-y-3 p-[10px] rounded-lg bg-[#F6F6F6]">
              <h3 className="font-bold text-[14px]">Other Details</h3>

              <div className="grid grid-cols-2  text-[12px]">
                <div className="space-y-2">
                  <p>Default Currency</p>
                  <p>Payment Terms</p>
                  <p>Portal Languages</p>
                </div>
                <div className="text-end font-bold space-y-2">
                  <p>{supplier?.currency}</p>
                  <p>{supplier?.paymentTerms}</p>
                  <p>English</p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex  items-center justify-end space-x-1">
            <p className="text-end text-[#820000] text-[14px] font-bold cursor-pointer">
              See Payable{" "}
            </p>
            <ArrowRight size={15} color="#820000" />
          </div> */}
          <div>{/* <ExpensesGraph /> */}</div>
        </div>
        <div
          className="col-span-4 py-5 px-3 bg-[#F6F6F6] rounded-[8px]  max-h-[400px] overflow-y-auto"
          style={{
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* IE and Edge */,
          }}
        >
          <h3 className="font-bold text-[14px] mb-4">
            Supplier Status History
          </h3>
          <div className="flex flex-col relative pb-8">
            <div
              className="w-[2px] absolute left-4 top-0 bg-WhiteIce"
              style={{ height: "calc(100% - 70px)" }}
            ></div>
            {supplierHis?.map((item: any, index: number) => {
              const circleStyle = getCircleStyle(item.title);
              const { date, time } = formatDateTime(item.date);
              console.log(circleStyle.bgColor);

              return (
                <div key={index} className="space-y-4 pb-8">
                  {/* First item */}
                  <div className="space-x-4 flex pb-8">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 z-10 ${circleStyle.bgColor} flex items-center justify-center rounded-full text-white`}
                      >
                        <p>{item.initials}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex space-x-3 text-[14px]">
                        <p>{date}</p>
                        <p>{time}</p>
                      </div>
                      <p className="font-bold">{item.title}</p>
                      <p>{item.description}</p>
                      <div className="flex space-x-4 font-bold text-[14px]">
                        <p>{item.author}</p>
                        {/* <p><u>View Details</u></p> */}
                      </div>
                    </div>
                  </div>

                  {/* Second item */}
                  {/* <div className="space-x-4 flex pb-8">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 z-10 ${circleStyle.bgColor} flex items-center justify-center rounded-full text-white`}>
                  <p>{item.initials}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex space-x-3 text-[14px]">
                  <p>{item.date}</p>
                  <p>{item.time}</p>
                </div>
                <p className="font-bold">{item.title}</p>
                <p>{item.description}</p>
                <div className="flex space-x-4 font-bold text-[14px]">
                  <p>{item.author}</p>
                  <p><u>View Details</u></p>
                </div>
              </div>
            </div> */}

                  {/*Third item*/}

                  {/* <div className="space-x-4 flex pb-8">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 z-10 ${circleStyle.bgColor} flex items-center justify-center rounded-full text-white`}>
                  <p>{item.initials}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex space-x-3 text-[14px]">
                  <p>{item.date}</p>
                  <p>{item.time}</p>
                </div>
                <p className="font-bold">{item.title}</p>
                <p>{item.description}</p>
                <div className="flex space-x-4 font-bold text-[14px]">
                  <p>{item.author}</p>
                  <p><u>View Details</u></p>
                </div>
              </div>
            </div> */}
                  {/*Fourth Item */}

                  {/* <div className="space-x-4 flex pb-8">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 z-10 ${circleStyle.bgColor} flex items-center justify-center rounded-full text-white`}>
                  <p>{item.initials}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex space-x-3 text-[14px]">
                  <p>{item.date}</p>
                  <p>{item.time}</p>
                </div>
                <p className="font-bold">{item.title}</p>
                <p>{item.description}</p>
                <div className="flex space-x-4 font-bold text-[14px]">
                  <p>{item.author}</p>
                  <p><u>View Details</u></p>
                </div>
              </div>
            </div> */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* <div className="flexz justify-end">
        <Button size="sm" className="w-[120px] flex justify-center float-end">
          <p>Save</p>
        </Button>
      </div> */}
    </>
  );
};

export default Overview;

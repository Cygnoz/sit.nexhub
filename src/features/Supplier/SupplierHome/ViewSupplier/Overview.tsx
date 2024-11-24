import { useParams } from "react-router-dom";
// import ArrowRight from "../../../../assets/icons/ArrowRight";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import MailIcon from "../../../../assets/icons/MailIcon";
import Pen from "../../../../assets/icons/Pen";
import PhoneIcon from "../../../../assets/icons/PhoneIcon";
// import Button from "../../../../Components/Button";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import EditSupplier from "../EditSupplier";
import avatar from '../../../../assets/Images/Rectangle 5558.png'
import line25 from '../../../../assets/Images/Line 25.png'
import LocateFixed from "../../../../assets/icons/LocateFixed";

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
    } catch (error) { }
  };
  useEffect(() => {
    setStatusData({ ...statusData, status: supplier?.status });
  }, [supplier]);

  console.log(supplier?.status);
  const formatDateTime = (dateString: any) => {
    if (!dateString) {
      return { date: "", time: "" };
    }

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

  const defaultImage = avatar

  return (
    <>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-8 space-y-3  h-auto">

          <div className="bg-[#F3F3F3] rounded-lg w-full p-6 flex items-center justify-between">
            {/* Column 1: Avatar */}
            <div className="justify-center h-20 w-30 rounded-lg bg-gray-200 flex items-center overflow-hidden">
              <img
                src={supplier?.supplierProfile || defaultImage}
                alt="Avatar"
                className="w-full h-full max-w-[120px] max-h-[120px] object-cover"
              />
              <img className="ml-5 h-30" src={line25} alt="" />
            </div>




            {/* Column 2: Info Section */}
            <div className="flex flex-col gap-3 flex-1 ml-6">
              {/* Supplier Name */}
              <h2 className="text-lg font-bold text-[#303F58]">
                {supplier?.supplierDisplayName || "John Doe"}
              </h2>

              {/* Email */}
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <MailIcon size={16} color="#565148" />
                {supplier?.supplierEmail || "email@example.com"}
              </p>

              {/* Phone */}
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <PhoneIcon size={16} color="#565148" />
                {supplier?.mobile || "+91 9876543210"}
              </p>

              {/* Company */}
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <LocateFixed size={16} color="#4B5C79" />
                {supplier?.companyName || "Electro Tech Solution"}
              </p>
            </div>

            {/* Column 3: Actions, Balance, and Status */}
            <div className="flex flex-col items-end gap-4">
              {/* Row 1: Edit Button */}
              {/* <Button
      onClick={() => openModal()}
      variant="secondary"
      className="h-[26px] w-[68px] text-[12px] flex items-center justify-center"
    >
      <Pen size={14} color="#565148" />{" "}
      <p className="text-sm font-medium">Edit</p>
    </Button> */}
              <EditSupplier
                isModalOpen={isModalOpen}
                openModal={openModal}
                closeModal={closeModal}
                supplier={supplier}
                addressEdit={addressEdit}
              />

              {/* Row 2: Status Dropdown */}
              <select
                className="p-2 text-sm font-medium text-gray-600 bg-white border rounded-md border-gray-300"
                value={statusData.status}
                name="status"
                onChange={handleStatusSubmit}
              >
                <option value="">Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* Row 3: Opening Balance */}
              <p className="text-xl font-semibold text-[#2C353B] mx-8">
                Opening Balance:{" "}
                <span>
                  ₹{supplier?.openingBalance || "10,000"}
                </span>
              </p>

              {/* Row 4: Status Display */}
              <div
                className={`px-3 py-1 text-xs rounded-full text-white ${statusData.status === "Active" ? "bg-green-500" : "bg-red-400"
                  }`}
              >
                {statusData.status || "Inactive"}
              </div>
            </div>
          </div>



          {/* billing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Billing Address */}
            <div className="w-full h-auto p-4 rounded-lg bg-[#FDF8F0] shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[14px]">Billing Address</h3>
                <div className="cursor-pointer" onClick={() => openModal("billing")}>
                  <Pen color="#303F58" />
                </div>
              </div>
              <div className="mt-3 space-y-2 text-[12px]">
                {supplier?.billingCity ||
                  supplier?.billingAddressStreet1 ||
                  supplier?.billingAddressStreet2 ||
                  supplier?.billingPinCode ||
                  supplier?.billingPhone ||
                  supplier?.billingState ||
                  supplier?.billingCountry ? (
                  <>
                    {supplier?.billingCity && <p>{supplier.billingCity}</p>}
                    {supplier?.billingAddressStreet1 && <p>{supplier.billingAddressStreet1}</p>}
                    {supplier?.billingAddressStreet2 && <p>{supplier.billingAddressStreet2}</p>}
                    {supplier?.billingPinCode && <p>Pin: {supplier.billingPinCode}</p>}
                    {supplier?.billingPhone && <p>Phone: {supplier.billingPhone}</p>}
                    {supplier?.billingState && supplier?.billingCountry && (
                      <p>{supplier.billingState} {supplier.billingCountry}</p>
                    )}
                  </>
                ) : (
                  <p>No billing information available.</p>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="w-full h-auto p-4 rounded-lg bg-[#FCFFED] shadow-md">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[14px]">Shipping Address</h3>
                <div className="cursor-pointer" onClick={() => openModal("shipping")}>
                  <Pen color="#303F58" />
                </div>
              </div>
              <div className="mt-3 space-y-2 text-[12px]">
                {supplier?.shippingCity ||
                  supplier?.shippingAddressStreet1 ||
                  supplier?.shippingAddressStreet2 ||
                  supplier?.shippingPinCode ||
                  supplier?.shippingPhone ||
                  supplier?.shippingState ||
                  supplier?.shippingCountry ? (
                  <>
                    {supplier?.shippingCity && <p>{supplier.shippingCity}</p>}
                    {supplier?.shippingAddressStreet1 && <p>{supplier.shippingAddressStreet1}</p>}
                    {supplier?.shippingAddressStreet2 && <p>{supplier.shippingAddressStreet2}</p>}
                    {supplier?.shippingPinCode && <p>Pin: {supplier.shippingPinCode}</p>}
                    {supplier?.shippingPhone && <p>Phone: {supplier.shippingPhone}</p>}
                    {supplier?.shippingState && supplier?.shippingCountry && (
                      <p>{supplier.shippingState} {supplier.shippingCountry}</p>
                    )}
                  </>
                ) : (
                  <p>No shipping information available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Other Details Section */}
          <div className="mt-4 w-full p-4 rounded-lg bg-[#F6F6F6] shadow-md">
            {/* Heading */}
            <h3 className="font-bold text-[14px] mb-4">Other Details</h3>

            {/* First Row: 5 Columns */}
            <div className="grid grid-cols-5 items-center gap-4 text-[12px] mb-4">
              {/* Customer Type */}
              <div className="col-span-2 flex items-center justify-start space-x-4">
                <p>Customer Type:</p>
                <p className="font-bold">{supplier?.customerType || "Business"}</p>
              </div>


              {/* Payment Terms */}
              <div className="col-span-2 flex items-center justify-start space-x-4">
                <p>Payment Terms:</p>
                <p className="font-bold">{supplier?.paymentTerms || "Due on Receipt"}</p>
              </div>

              {/* View Customer Button */}
              <div className="flex justify-center">
                <button
                  className="text-sm font-medium text-[#303F58] underline"
                  onClick={() => console.log("View Customer Details")}
                >
                  View More
                </button>
              </div>
            </div>

            {/* Second Row: 4 Columns */}
            <div className="grid grid-cols-5 items-center gap-4 text-[12px]">
              {/* Default Currency */}
              <div className="col-span-2 flex items-center justify-start space-x-4">
                <p>Default Currency:</p>
                <p className="font-bold">{supplier?.currency || "INR"}</p>
              </div>

              {/* Portal Language */}
              <div className="col-span-2 flex items-center justify-start space-x-4">
                <p>Portal Language:</p>
                <p className="font-bold">English</p>
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

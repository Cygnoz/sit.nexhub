import { Link } from "react-router-dom";
import CheveronLeftIcon from "../../../../../assets/icons/CheveronLeftIcon";
import OCRNewInvoice from "./OCRNewInvoice";
import pdf from "../../../../../assets/Images/image.png";
import DotIcon from "../../../../../assets/icons/DotIcon";
import Button from "../../../../../Components/Button";
import { useRef, useState } from "react";

const OCRInvoiceView = () => {
  const supplierDetails = [
    { label: "Invoice no", value: "INV-00123" },
    { label: "Supplier Name", value: "Red Software" },
    {
      label: "Supplier Address",
      value: "3517 W. Gray St. Utica, Pennsylvania 57867",
    },
    { label: "Supplier Phone", value: "+919633876857" },
    { label: "Invoice Date", value: "Dec 06 2024" },
    { label: "Due Date", value: "Dec 08 2024" },
  ];

  const lineItems = ["Item 1", "Item 2", "Item 3", "Item 4", "item 5"];

  const transactionDetails = [
    { label: "CGST", value: "₹10.00" },
    { label: "SGST", value: "₹10.00" },
    { label: "IGST", value: "₹20.00" },
    { label: "Total tax amount", value: "₹4500.00" },
    {
      label: "Total amount (Grand total)",
      value: "₹10,500.00",
    },
    { label: "Bank Name", value: "State Bank of India" },
    { label: "Acc no.", value: "3450234523098564" },
    { label: "Branch Name", value: "Kochi" },
    { label: "IFSC Code", value: "FDRL56TYUI8898" },
  ];

  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  
  const toggleDropdown = (key: string | null) => {
    setOpenDropdownIndex(key === openDropdownIndex ? null : key);
  };

  return (
    <>
      <div className="mx-5 my-4 flex items-center relative gap-x-4">
        <Link to={"/purchase/bills/invoice"}>
          <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div>
          <h3 className="font-bold text-2xl text-textColor">All Invoice</h3>
        </div>
        <div className="ml-auto gap-3 flex items-center">
          <OCRNewInvoice />
        </div>
      </div>

      <div className="bg-white rounded-lg grid grid-cols-12 gap-4 mx-5 p-5">
        {/* Invoice Image Section */}
        <div className="col-span-7 rounded-lg">
          <div className="h-10 bg-[#E5E5E5] rounded-t-lg text-xs font-bold text-[#4B5C79] flex items-center px-4">
            <p>INV-001.png</p>
          </div>
          <div className="flex items-center justify-center py-2 bg-[#F3F3F3]">
            <img src={pdf} alt="Invoice" className="max-w-2xl" />
          </div>
        </div>

        {/* Details Section */}
        <div className="col-span-5">
          <div className="h-10 bg-[#E5E5E5] rounded-t-lg text-xs font-bold text-[#4B5C79] flex items-center px-4">
            <p>Fields</p>
          </div>
          <div className="bg-[#F3F3F3] p-5 text-xs">
            {/* Supplier Details */}
            <div className="border-b-[1px] border-[#c5c6c7] text-sm pb-2  mb-4 text-textColor font-semibold">
              Supplier Details
            </div>
            <div className="space-y-1 mt-2">
              {supplierDetails.map((detail, index) => (
                <div
                  key={index}
                  className={`flex gap-5 p-2 items-center font-semibold ${
                    detail.label === "Supplier Name" ? "hover:bg-[#F6DDDD]" : ""
                  }`}
                  onClick={() => detail.label === "Supplier Name" && toggleDropdown("supplierName")}
                >
                  <DotIcon
                    color={
                      detail.label === "Supplier Name" ? "#DD2020" : "#32A370"
                    }
                    size={10}
                  />
                  <p className="text-textColor">{detail.label}</p>
                  <p
                    className={`${
                      detail.label === "Supplier Name"
                        ? "text-[#DD2020]"
                        : "text-green-600"
                    }`}
                  >
                    <span className="m">{detail.value}</span>
                  </p>
                </div>
              ))}
            </div>

            {openDropdownIndex === "supplierName" && (
              <div
                ref={dropdownRef}
                className="absolute z-10 bg-white shadow rounded-md -mt-80 p-2  space-y-1 w-[25%] max-h-72 overflow-y-auto hide-scrollbar"
              >
                <div
                  className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                  onClick={() => {
                    toggleDropdown("supplierName");
                    setOpenDropdownIndex(null);
                  }}
                >
                  <div className="col-span-10 flex cursor-pointer">
                    <div>
                      <p className="font-bold text-sm">
                        kdjhugdufgvhh
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Line Items */}
            <div className="border-b-[0.5px] border-[#c5c6c7] text-sm pb-2  mb-4 text-textColor font-semibold mt-5">
              Line Items
            </div>
            <div className="space-y-1 mt-2">
              {lineItems.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-center font-semibold p-2"
                >
                  <DotIcon color={"#32A370"} size={10} />
                  <p className="text-textColor">Line Item </p>
                  <p className="">{item}</p>
                </div>
              ))}
            </div>

            {/* Transaction Details */}
            <div className="border-b-[1px] border-[#c5c6c7] text-sm pb-2 mb-4 text-textColor font-semibold mt-5">
              Transaction Details
            </div>
            <div className="space-y-1 mt-2">
              {transactionDetails.map((detail, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-center font-semibold p-2"
                >
                  <DotIcon color={"#32A370"} size={10} />
                  <p className="text-textColor">{detail.label}</p>
                  <p className="text-green-600 font-semibold">
                    <span>{detail.value}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="py-2 bg-[#E5E5E5] rounded-b-lg text-xs text-[#4B5C79] flex items-center justify-end px-4 gap-2">
            <Button className="px-4 py-2 " variant="secondary" size="sm">
              Cancel
            </Button>
            <Button className="px-4 py-2" variant="primary" size="sm">
              Confirm Document
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OCRInvoiceView;

import { Link } from "react-router-dom";
import CheveronLeftIcon from "../../../../../assets/icons/CheveronLeftIcon";
import OCRNewInvoice from "./OCRNewInvoice";
import pdf from "../../../../../assets/Images/image.png";
import DotIcon from "../../../../../assets/icons/DotIcon";
import Button from "../../../../../Components/Button";
import { useEffect, useRef, useState } from "react";
import AddSupplierModal from "../../../../Supplier/SupplierHome/AddSupplierModal";
import CehvronDown from "../../../../../assets/icons/CehvronDown";
import Check from "../../../../../assets/icons/Check";

const OCRInvoiceView = () => {
  const lineItems = ["Item 1", "Item 2", "Item 3", "Item 4", "item 5"];

  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const [expandDropDown, setExpandDropDown] = useState<string | null>(null);

  const handleExpand = (key: string) => {
    setExpandDropDown((prevKey) => (prevKey === key ? null : key));
  };
  const toggleDropdown = (key: string) => {
    setOpenDropdownIndex((prevIndex) => (prevIndex === key ? null : key));
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenDropdownIndex(null);
    }
  };

  useEffect(() => {
    if (openDropdownIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownIndex]);

  return (
    <>
      <div className="mx-5 my-4 flex items-center  gap-x-4">
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
          <div className="flex items-center justify-center h-[760px] py-2 bg-[#F3F3F3]">
            <img src={pdf} alt="Invoice" className="max-w-2xl h-[650px]" />
          </div>
        </div>

        {/* Details Section */}
        <div className="col-span-5">
          <div className="h-10 bg-[#E5E5E5] rounded-t-lg text-xs font-bold text-[#4B5C79] flex items-center px-4 relative">
            <p>Fields</p>
          </div>
          <div className="bg-[#F3F3F3] p-5 text-xs h-[710px] overflow-x-scroll hide-scrollbar">
            {/* Supplier Details */}
            <div className="border-b-[1px] border-[#c5c6c7] text-sm pb-2 mb-4 text-textColor font-semibold ">
              Supplier Details
            </div>
            <div className="mt-2 relative">
              <div className="flex gap-5 p-2 items-center font-semibold relative">
                <DotIcon color={"#32A370"} size={10} />
                <p className="text-textColor w-[20%]">Invoice Number</p>
                <input
                  type="text"
                  className="invoice-input"
                  value={"INV-0001"}
                  placeholder="Invoice"
                />
              </div>
              <div
                className="flex gap-5 p-2 items-center font-semibold hover:bg-[#f5dddd]"
                onClick={() => toggleDropdown("supplierName")}
              >
                <DotIcon color={"#DD2020"} size={10} />
                <p className="text-textColor w-[20%]">Supplier Name</p>
                <p className="text-[#DD2020] font-semibold">
                  <span>Red Software</span>
                </p>
              </div>
              {openDropdownIndex === "supplierName" && (
                <div
                  ref={dropdownRef}
                  className="absolute z-10 w-[70%] bg-white shadow rounded-md mt-1 p-2  space-y-1 max-h-72 overflow-y-auto hide-scrollbar"
                >
                  <div className="flex gap-3 mb-4 items-center">
                    <DotIcon color={"#DD2020"} size={15} />
                    <p className="text-textColor font-bold text-sm">
                      {" "}
                      Supplier Name
                    </p>
                  </div>
                  <div
                    className="h-9 rounded-md border border-neutral-200 my-5 flex"
                    onClick={() => handleExpand("dropdown1")}
                  >
                    <div className="flex items-center px-3 text-loremcolor text-sm">
                      Red Software
                    </div>
                    <div className="items-center justify-end ml-auto flex pe-2">
                      <CehvronDown color={"gray"} />
                    </div>
                  </div>
                  {expandDropDown === "dropdown1" && (
                    <div className="flex items-center px-3 text-loremcolor text-sm h-9 bg-[#f2f2f2]">
                      Red Software
                    </div>
                  )}

                  <div className="flex justify-end py-3 gap-2">
                    <Button variant="secondary" size="sm">
                      Cancel
                    </Button>
                    <button className="bg-[#32A370] px-2 rounded-md text-white font-semibold flex items-center justify-center gap-1">
                      <Check />
                      Confirm
                    </button>
                  </div>

                  <div className="flex items-center justify-center">
                    {" "}
                    <p className="font-bold">OR</p>
                  </div>

                  <div className="w-full flex items-center justify-center ">
                    <AddSupplierModal page="ocr" />
                  </div>
                </div>
              )}
              <div className="flex gap-5 p-2 items-center font-semibold">
                <DotIcon color={"#32A370"} size={10} />
                <p className="text-textColor w-[20%]">Supplier Address</p>
                <input
                  type="text"
                  className="invoice-input w-[50%]"
                  value={"3517 W. Gray St. Utica, Pennsylvania 57867"}
                  placeholder="Invoice"
                />
              </div>
              <div className="flex gap-5 p-2 items-center font-semibold">
                <DotIcon color={"#32A370"} size={10} />
                <p className="text-textColor w-[20%]">Supplier Phone</p>
                <input
                  type="text"
                  className="invoice-input"
                  value={"+919687456765"}
                  placeholder="Invoice"
                />
              </div>
              <div className="flex gap-5 p-2 items-center font-semibold">
                <DotIcon color={"#32A370"} size={10} />
                <p className="text-textColor w-[20%]">Invoice Date</p>
                <input
                  type="text"
                  className="invoice-input"
                  value={"12/12/2024"}
                  placeholder="Invoice"
                />
              </div>
              <div className="flex gap-5 p-2 items-center font-semibold">
                <DotIcon color={"#32A370"} size={10} />
                <p className="text-textColor w-[20%]">Due Date</p>
                <input
                  type="text"
                  className="invoice-input"
                  value={"12/12/2024"}
                  placeholder="Invoice"
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="border-b-[0.5px] border-[#c5c6c7] text-sm pb-2 mb-4 text-textColor font-semibold mt-5">
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
            <div className="space-y- mt-2">
              <div className="flex gap-5 p-2 items-center font-semibold">
                <DotIcon color={"#32A370"} size={10} />
                <p className="text-textColor w-[20%]">CGST</p>
                <input
                  type="text"
                  className="invoice-input"
                  value={"$25"}
                  placeholder="Invoice"
                />
              </div>
              <div className="flex gap-5 p-2 items-center font-semibold">
                <DotIcon color={"#32A370"} size={10} />
                <p className="text-textColor w-[20%]">SGST</p>
                <input
                  type="text"
                  className="invoice-input"
                  value={"$25"}
                  placeholder="Invoice"
                />
              </div>
              <div className="flex gap-5 p-2 items-center font-semibold">
                <DotIcon color={"#32A370"} size={10} />
                <p className="text-textColor w-[20%]"> Total Amount</p>
                <input
                  type="text"
                  className="invoice-input"
                  value={"$5000"}
                  placeholder="Invoice"
                />
              </div>
              <div
                className="flex gap-5 p-2 items-center font-semibold hover:bg-[#f0e0c9]"
                onClick={() => toggleDropdown("supplierName")}
              >
                <DotIcon color={"#CE841C"} size={10} />
                <p className="text-textColor w-[20%]">Bank Name</p>
                <p className="text-[#CE841C] font-semibold">
                  <span>State Bank of India</span>
                </p>
              </div>
              <div className="flex gap-5 p-2 items-center font-semibold">
                <DotIcon color={"#32A370"} size={10} />
                <p className="text-textColor w-[20%]">Account No.</p>
                <input
                  type="text"
                  className="invoice-input"
                  value={"$5000"}
                  placeholder="Invoice"
                />
              </div>{" "}
              <div className="flex gap-5 p-2 items-center font-semibold">
                <DotIcon color={"#32A370"} size={10} />
                <p className="text-textColor w-[20%]">Branch Name</p>
                <input
                  type="text"
                  className="invoice-input"
                  value={"$5000"}
                  placeholder="Invoice"
                />
              </div>{" "}
              <div className="flex gap-5 p-2 items-center font-semibold">
                <DotIcon color={"#32A370"} size={10} />
                <p className="text-textColor w-[20%]">IFSC Code</p>
                <input
                  type="text"
                  className="invoice-input"
                  value={"$5000"}
                  placeholder="Invoice"
                />
              </div>
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

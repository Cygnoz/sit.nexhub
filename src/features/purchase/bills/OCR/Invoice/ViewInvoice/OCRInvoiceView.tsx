import { Link } from "react-router-dom";
import CheveronLeftIcon from "../../../../../../assets/icons/CheveronLeftIcon";
import OCRNewInvoice from "../UploadInvoice/OCRNewInvoice";
import pdf from "../../../../../../assets/Images/image.png";
import DotIcon from "../../../../../../assets/icons/DotIcon";
import { useEffect, useRef, useState } from "react";
import AddSupplierModal from "../../../../../Supplier/SupplierHome/AddSupplierModal";
import CehvronDown from "../../../../../../assets/icons/CehvronDown";
import Check from "../../../../../../assets/icons/Check";
import ItemsTable from "./ItemsTable";
import Button from "../../../../../../Components/Button";
import Expand from "../../../../../../assets/icons/Expand";

const OCRInvoiceView = () => {
  const lineItems = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
    "Item 7",
    "Item 8",
    "Item 9",
    "Item 10",
    "Item 11",
    "Item 12",
    "Item 13",
    "Item 14",
    "Item 15",
    "Item 16",
    "Item 17",
    "Item 18",
    "Item 19",
    "Item 20",
    "Item 21",
    "Item 22",
    "Item 23",
    "Item 24",
    "Item 25",
    "Item 26",
    "Item 27",
    "Item 28",
    "Item 29",
    "Item 30",
    "Item 31",
    "Item 32",
    "Item 33",
    "Item 34",
    "Item 35",
    "Item 36",
    "Item 37",
    "Item 38",
    "Item 39",
    "Item 40",
    "Item 41",
    "Item 42",
    "Item 43",
    "Item 44",
    "Item 45",
    "Item 46",
    "Item 47",
    "Item 48",
    "Item 49",
    "Item 50",
    "Item 51",
    "Item 52",
    "Item 53",
    "Item 54",
    "Item 55",
  ];
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const [expandDropDown, setExpandDropDown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isImageExpanded,setImageExpanded]=useState(false)
  const itemsPerPage = 10;
  const totalPages = Math.ceil(lineItems.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = lineItems.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, "...");
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(
          "...",
          currentPage - 1,
          currentPage + 1,
          currentPage,
          currentPage + 2,
          "..."
        );
      }
    }

    return pageNumbers;
  };

  const items = [
    {
      id: 1,
      product: "iPhone 15 - 128GB",
      hsnSac: "8517",
      qty: 2,
      rate: 79999,
      gross: 159998,
      discount: 5000,
      netAmount: 154998,
      taxPercent: 18,
      taxAmount: 27900,
      total: 182898,
      batchNo: "B1234",
    },
    {
      id: 2,
      product: "iPhone 15 - 256GB",
      hsnSac: "8517",
      qty: 3,
      rate: 89999,
      gross: 269997,
      discount: 7500,
      netAmount: 262497,
      taxPercent: 18,
      taxAmount: 47249,
      total: 309746,
      batchNo: "B2345",
    },
    {
      id: 3,
      product: "iPhone 15 - 512GB",
      hsnSac: "8517",
      qty: 1,
      rate: 99999,
      gross: 99999,
      discount: 3000,
      netAmount: 96999,
      taxPercent: 18,
      taxAmount: 17460,
      total: 114459,
      batchNo: "B3456",
    },
    {
      id: 4,
      product: "iPhone 15 Pro - 128GB",
      hsnSac: "8517",
      qty: 2,
      rate: 109999,
      gross: 219998,
      discount: 6000,
      netAmount: 213998,
      taxPercent: 18,
      taxAmount: 38479,
      total: 252477,
      batchNo: "B4567",
    },
    {
      id: 5,
      product: "iPhone 15 Pro - 256GB",
      hsnSac: "8517",
      qty: 3,
      rate: 119999,
      gross: 359997,
      discount: 8000,
      netAmount: 351997,
      taxPercent: 18,
      taxAmount: 63359,
      total: 415356,
      batchNo: "B5678",
    },
    {
      id: 6,
      product: "iPhone 15 Pro - 512GB",
      hsnSac: "8517",
      qty: 1,
      rate: 139999,
      gross: 139999,
      discount: 4000,
      netAmount: 135999,
      taxPercent: 18,
      taxAmount: 24479,
      total: 160478,
      batchNo: "B6789",
    },
    {
      id: 7,
      product: "iPhone 15 Plus - 128GB",
      hsnSac: "8517",
      qty: 2,
      rate: 89999,
      gross: 179998,
      discount: 5000,
      netAmount: 174998,
      taxPercent: 18,
      taxAmount: 31499,
      total: 206497,
      batchNo: "B7890",
    },
    {
      id: 8,
      product: "iPhone 15 Plus - 256GB",
      hsnSac: "8517",
      qty: 1,
      rate: 99999,
      gross: 99999,
      discount: 3000,
      netAmount: 96999,
      taxPercent: 18,
      taxAmount: 17460,
      total: 114459,
      batchNo: "B8901",
    },
    {
      id: 9,
      product: "iPhone 15 Mini - 128GB",
      hsnSac: "8517",
      qty: 4,
      rate: 69999,
      gross: 279996,
      discount: 4000,
      netAmount: 275996,
      taxPercent: 18,
      taxAmount: 49679,
      total: 325675,
      batchNo: "B9012",
    },
    {
      id: 10,
      product: "iPhone 15 Mini - 256GB",
      hsnSac: "8517",
      qty: 3,
      rate: 79999,
      gross: 239997,
      discount: 5000,
      netAmount: 234997,
      taxPercent: 18,
      taxAmount: 42299,
      total: 277296,
      batchNo: "B0123",
    },
  ];


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

  const handleImageExpand = () => {
    setImageExpanded(!isImageExpanded);
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
      <div className={`rounded-lg relative ${isImageExpanded ? "col-span-12" : "col-span-7"}`}>
          {/* Header Section */}
          <div className="h-10 bg-[#E5E5E5] rounded-t-lg text-xs font-bold text-[#4B5C79] flex items-center px-4">
            <p>INV-001.png</p>

            
            <button className="flex justify-end ml-auto" onClick={handleImageExpand}>
              <Expand/>
            </button>
          </div>

          <div className="flex items-center justify-center h-[760px] py-2 bg-[#F3F3F3] relative">
            <img src={pdf} alt="Invoice" className="max-w-2xl h-[650px]" />

            {openDropdownIndex === "items" && (
              <div
                ref={dropdownRef}
                className="absolute z-10 w-[100%] bg-white shadow rounded-md items-baseline p-2 space-y-1 max-h-96 overflow-y-auto hide-scrollbar"
                style={{
                  bottom: "10px",
                  left: "0",
                }}
              >
                <div className="flex gap-3 p-2 items-center font-semibold relative">
                  <DotIcon color={"#DD2020"} size={10} />
                  <p className="text-textColor w-[20%] text-sm">Line Items</p>
                </div>
                <ItemsTable items={items} />
              </div>
            )}
          </div>
        </div>

    { ! isImageExpanded &&   <div className="col-span-5">
          <div className="h-10 bg-[#E5E5E5] rounded-t-lg text-xs font-bold text-[#4B5C79] flex items-center px-4 relative">
            <p>Fields</p>
          </div>
          <div className="bg-[#F3F3F3] p-5 text-xs h-[710px] overflow-x-scroll hide-scrollbar">
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

            <div>
              {/* Line Items Header */}
              <div className="border-b-[0.5px] border-[#c5c6c7] text-sm pb-2 mb-4 text-textColor font-semibold mt-5">
                Line Items
              </div>

              {/* Grid Layout for Line Items */}
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  {currentItems.slice(0, 5).map((item, index) => (
                    <div
                    onClick={() => toggleDropdown("items")}
                    key={index}
                      className="flex gap-4 items-center font-semibold p-2"
                    >
                      <DotIcon color={"#32A370"} size={10} />
                      <p className="text-textColor">Line Item</p>
                      <p className="text-[#32A370]">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {currentItems.slice(5, 10).map((item, index) => (
                    <div
                      onClick={() => console.log("Clicked on item:", item)}
                      key={index}
                      className="flex gap-4 items-center font-semibold p-2"
                    >
                      <DotIcon color={"#32A370"} size={10} />
                      <p className="text-textColor">Line Item</p>
                      <p className="text-[#32A370]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-1 mt-4 justify-end">
                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => (
                  <p
                    key={index}
                    onClick={() =>
                      typeof page === "number" && setCurrentPage(page)
                    }
                    className={`p-1 font-bold rounded-md ${
                      currentPage === page
                        ? "bg-darkRed text-white"
                        : "bg-gray-200 text-darkRed cursor-pointer hover:bg-darkRed hover:text-white"
                    }`}
                  >
                    [{page}]
                  </p>
                ))}
                <p
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                  className="p-1 font-bold text-darkRed cursor-pointer hover:bg-darkRed hover:text-white rounded-md"
                >
                  [Previous]
                </p>
                <p
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  className="p-1 font-bold text-darkRed cursor-pointer hover:bg-darkRed hover:text-white rounded-md"
                >
                  [Next]
                </p>
              </div>
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
        </div>}
      </div>
    </>
  );
};

export default OCRInvoiceView;

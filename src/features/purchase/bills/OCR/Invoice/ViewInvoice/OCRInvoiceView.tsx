import { Link, useNavigate, useParams } from "react-router-dom";
import CheveronLeftIcon from "../../../../../../assets/icons/CheveronLeftIcon";
// import pdf from "../../../../../../assets/Images/image.png";
import DotIcon from "../../../../../../assets/icons/DotIcon";
import { useContext, useEffect, useRef, useState } from "react";
import AddSupplierModal from "../../../../../Supplier/SupplierHome/AddSupplierModal";
import CehvronDown from "../../../../../../assets/icons/CehvronDown";
import Check from "../../../../../../assets/icons/Check";
import ItemsTable from "./ItemsTable";
import Button from "../../../../../../Components/Button";
import Expand from "../../../../../../assets/icons/Expand";
import useApi from "../../../../../../Hooks/useApi";
import { endponits } from "../../../../../../Services/apiEndpoints";
import toast from "react-hot-toast";
import {
  octAddItemContext,
  SupplierResponseContext,
} from "../../../../../../context/ContextShare";
import ZoomOut from "../../../../../../assets/icons/ZoomOut";
import ZoomIn from "../../../../../../assets/icons/ZoomIn";

interface BankDetails {
  accountNo: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
}

interface Header {
  billNumber: string | number | readonly string[] | undefined;
  dueDate: string;
  billDate: string;
  supplierAddress: string;
  supplierDisplayName: string;
  supplierPhone: string;
  supplierId: string;
}

interface Footer {
  termsAndConditions: string;
  grandTotal: string;
  sgst: string;
  cgst: string;
  payment_terms: string;
  igst: string;
}

const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
const OCRInvoiceView = () => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const [expandDropDown, setExpandDropDown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isImageExpanded, setImageExpanded] = useState(false);
  const [invoice, setInvoice] = useState<any>([]);
  const [lineItems, setLineItems] = useState<any>([]);
  const [supplier, setsupplier] = useState<[] | any>([]);
  const [similarSuppliers, setSimilarSuppliers] = useState<[] | any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSupplier, setselectedSupplier] = useState<any>(null);
  const [sameSupplier, setSameSupplier] = useState<any>([]);
  const [allItems, setAllItems] = useState<[] | any>([]);
  const [currentItemsMatch, setCurrentItemsMatch] = useState<any>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { supplierResponse } = useContext(SupplierResponseContext)!;
  const navigate = useNavigate();
  const { ocrAddItem } = useContext(octAddItemContext)!;

  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountNo: "",
    bankName: "",
    branchName: "",
    ifscCode: "",
  });

  const [header, setHeader] = useState<Header>({
    dueDate: "",
    billNumber: "",
    billDate: "",
    supplierAddress: "",
    supplierDisplayName: "",
    supplierPhone: "",
    supplierId: "",
  });

  const [footer, setFooter] = useState<Footer>({
    termsAndConditions: "",
    grandTotal: "",
    sgst: "",
    cgst: "",
    igst: "",
    payment_terms: "",
  });

  const { request: getInvoice } = useApi("get", 5000);
  const { request: getSupplier } = useApi("get", 7009);
  const { request: getItems } = useApi("get", 7003);
  const { request: updateOcr } = useApi("put", 5000);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(lineItems.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = lineItems.slice(startIndex, endIndex);
  const { id } = useParams();
  const prevAllItems = usePrevious(allItems);
  const prevCurrentItems = usePrevious(currentItems);

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.5));
  };

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
  const getAInvoice = async () => {
    setLoading(true);
    try {
      const url = `${endponits.GET_OCR_FULL_INVOICE}/${id}`;
      const { response, error } = await getInvoice(url);

      if (!error && response) {
        delete response.data[0]?.status;
        setInvoice(response.data[0]);
        setLineItems(response.data[0]?.invoice?.items);
        setBankDetails(response.data[0].invoice.bank_details);
        setHeader(response.data[0].invoice.header);
        setFooter(response.data[0].invoice.footer);
      }
    } catch (error) {
      console.error("Error in fetching invoice data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (
    url: string,
    setData: React.Dispatch<React.SetStateAction<any>>,
    fetchFunction: (url: string) => Promise<any>
  ) => {
    try {
      const { response, error } = await fetchFunction(url);
      if (!error && response) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSupplierMatch = () => {
    if (!invoice || Object.keys(invoice).length === 0) {
      console.error("No invoice data available.");
      return;
    }
    if (!supplier || supplier.length === 0) {
      console.error("No suppliers data available.");
      return;
    }
  
    const invoiceSupplierName = invoice?.invoice?.header?.supplierDisplayName;
    if (!invoiceSupplierName) {
      console.error("No supplier name found in the invoice.");
      return;
    }
  
    const normalizedInvoiceSupplier = invoiceSupplierName
      .replace(/\s+/g, "")
      .toLowerCase();
  
    const exactMatches = supplier.filter(
      (s: any) => s.supplierDisplayName === invoiceSupplierName
    );
  
    const similarMatches = supplier.filter((s: any) => {
      const normalizedSupplierName = s.supplierDisplayName
        .replace(/\s+/g, "")
        .toLowerCase();
  
      return (
        normalizedSupplierName.includes(normalizedInvoiceSupplier) ||
        normalizedInvoiceSupplier.includes(normalizedSupplierName)
      );
    });
  
    const combinedMatches = Array.from(
      new Map([...exactMatches, ...similarMatches].map((item) => [item._id, item]))
        .values()
    );

  
    setSameSupplier(exactMatches);
    setSimilarSuppliers(combinedMatches);
  
      setHeader((prevData) => ({
        ...prevData,
        supplierId: exactMatches[0]?._id,
      }));
    
  };

  console.log(sameSupplier,"same")

  


  const handleItemMatch = () => {
    const updatedItems = invoice?.invoice?.items?.map((invoiceItem: any) => {
      const matchingItem = allItems?.find(
        (innerItem: any) => innerItem?.itemName === invoiceItem?.itemName
      );
  
      return matchingItem
        ? {
            ...invoiceItem,
            ...matchingItem,
            itemId: matchingItem._id,
            itemSgst: matchingItem.sgst,
            itemCgst: matchingItem.cgst,
            itemIgst: matchingItem.igst,
            taxPreference: matchingItem.taxPreference,
          }
        : invoiceItem;
    });
  
    setInvoice((prevInvoice: any) => ({
      ...prevInvoice,
      invoice: {
        ...prevInvoice.invoice,
        items: updatedItems,
      },
    }));
  
    // Track which items matched
    const matches = currentItems.map((item: any) => ({
      itemId: item.itemId,
      isMatch: !!allItems.find((innerItem: any) => innerItem.itemName === item.itemName),
    }));
  
    setCurrentItemsMatch(matches);
  };
  



  const handleChange = (
    section: "bankDetails" | "header" | "footer",
    fieldName: string,
    value: string
  ) => {
    switch (section) {
      case "bankDetails":
        setBankDetails((prevState) => ({
          ...prevState,
          [fieldName]: value,
        }));
        break;
      case "header":
        setHeader((prevState) => ({
          ...prevState,
          [fieldName]: value,
        }));
        break;
      case "footer":
        setFooter((prevState) => ({
          ...prevState,
          [fieldName]: value,
        }));
        break;
      default:
        break;
    }
  };

  const handleUpdate = async () => {
    try {
      const url = `${endponits.UPDATE_OCR_DATA}/${id}`;
      const { response, error } = await updateOcr(url, invoice);
      if (!error && response) {
        toast.success(response.data.message);
        navigate(`/purchase/bills/new-ocr/${id}`);
      } else {
        toast.error(error.response.data.error);
      }
    } catch (error) {}
  };

  useEffect(() => {
    const { items } = invoice?.invoice || {};
    setLineItems(items || []);
  }, [invoice?.invoice]);

  useEffect(() => {
    setInvoice((prevData: any) => ({
      ...prevData,
      invoice: {
        ...prevData.invoice,
        bank_details: bankDetails,
        header: header,
        footer: footer,
      },
    }));
  }, [bankDetails, header, footer]);

  const handleConfirm = () => {
    if (!selectedSupplier) {
      console.error("No supplier selected.");
      return;
    }
    setSimilarSuppliers([]);
    toggleDropdown("supplierName");

    setHeader((prevData) => ({
      ...prevData,
      supplierDisplayName: selectedSupplier.supplierDisplayName,
      supplierId: selectedSupplier._id,
    }));
    handleSupplierMatch();
  };

  useEffect(() => {
    handleSupplierMatch();
  }, [supplier,  invoice?.invoice?.header?.supplierDisplayName]);

  useEffect(() => {
    if (
      JSON.stringify(prevAllItems) !== JSON.stringify(allItems) ||
      JSON.stringify(prevCurrentItems) !== JSON.stringify(currentItems)
    ) {
      handleItemMatch();
    }
  }, [allItems, currentItems]);

  useEffect(() => {
    const supplierUrl = `${endponits.GET_ALL_SUPPLIER}`;
    fetchData(supplierUrl, setsupplier, getSupplier);
  }, [supplierResponse]);

  useEffect(() => {
    getAInvoice();
  }, []);

  useEffect(() => {
    const allItemUrl = `${endponits.GET_ALL_ITEM}`;

    fetchData(allItemUrl, setAllItems, getItems);
  }, [ocrAddItem]);

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

  const isPDF = invoice?.image?.file?.startsWith("data:application/pdf");

  console.log(invoice, "INVOICE");

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
        {/* <div className="ml-auto gap-3 flex items-center">
          <OCRNewInvoice />
        </div> */}
      </div>

      <div className="bg-white rounded-lg grid grid-cols-1 sm:grid-cols-12 gap-4 mx-5 p-5 main-div ">
        <div
          className={`rounded-lg relative ${
            isImageExpanded ? "col-span-12" : "col-span-7"
          }`}
        >
          {/* Header Section */}
          <div className="h-10 header-div bg-[#E5E5E5] rounded-t-lg text-xs font-bold text-[#4B5C79] flex items-center px-4 z-10 relative">
            <p>INV-001.png</p>
            <div className="ml-auto flex items-center justify-center gap-4">
              <button onClick={handleZoomIn}>
                <ZoomIn />
              </button>

              <button onClick={handleZoomOut}>
                <ZoomOut />
              </button>
              <button
                className="flex justify-end ms-5"
                onClick={handleImageExpand}
              >
                <Expand />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center h-[760px] py-2 bg-[#F3F3F3] relative overflow-auto hide-scrollbar">
            {loading ? (
              <div className="loader"></div>
            ) : isPDF ? (
              <iframe
                src={invoice?.image?.file}
                width="100%"
                height="100%"
                style={{
                  border: "none",
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "top center",
                }}
                title="PDF Viewer"
              ></iframe>
            ) : (
              <img
                className="min-w-[65%]"
                src={invoice?.image?.file}
                alt="Uploaded Content"
                style={{
                  transform: `scale(${zoomLevel})`,
                }}
              />
            )}

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
                <ItemsTable
                  allItems={allItems}
                  items={currentItems}
                  invoice={invoice}
                  setInvoice={setInvoice}
                />
              </div>
            )}
          </div>
        </div>

        {!isImageExpanded && (
          <div className="col-span-5">
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
                    name="billNumber"
                    value={header?.billNumber}
                    placeholder="Invoice"
                    onChange={(e) =>
                      handleChange("header", e.target.name, e.target.value)
                    }
                  />
                </div>
                <div
                  className={`flex gap-5 p-2 items-center font-semibold ${
                    !sameSupplier ? "hover:bg-[#f5dddd]" : ""
                  }`}
                  onClick={() => toggleDropdown("supplierName")}
                >
                  <DotIcon
                    color={sameSupplier.length>0 ? "#32A370" : "#DD2020"}
                    size={10}
                  />

                  <p className="text-textColor w-[20%]">Supplier Name</p>
                  <p
                    className={` font-semibold ${
                      sameSupplier.length>0 ? "text-[#32A370]" : "text-[#DD2020]"
                    }`}
                  >
                    <span>{header.supplierDisplayName}</span>
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
                        {selectedSupplier
                          ? selectedSupplier.supplierDisplayName
                          : "Select Supplier"}
                      </div>
                      <div className="items-center justify-end ml-auto flex pe-2">
                        <CehvronDown color={"gray"} />
                      </div>
                    </div>
                    {expandDropDown === "dropdown1" && (
                      <>
                        {similarSuppliers.length > 0 ? (
                          similarSuppliers.map((supplier: any) => (
                            <div
                              key={supplier?.id}
                              className="flex items-center px-3 text-loremcolor text-sm h-9 bg-[#f2f2f2] cursor-pointer"
                              onClick={() => {
                                setselectedSupplier(supplier);
                                handleExpand("dropDown1");
                              }}
                            >
                              {supplier?.supplierDisplayName}
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center px-3 text-loremcolor text-sm h-9 bg-[#f2f2f2] cursor-pointer">
                            <p className="text-darkRed">
                              No Similar suppliers found..!
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex justify-end py-3 gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          toggleDropdown("supplierName");
                          setselectedSupplier(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <button
                        className="bg-[#32A370] px-2 rounded-md text-white font-semibold flex items-center justify-center gap-1"
                        onClick={handleConfirm}
                      >
                        <Check />
                        Confirm
                      </button>
                    </div>

                    <div className="flex items-center justify-center">
                      {" "}
                      <p className="font-bold">OR</p>
                    </div>

                    <div className="w-full flex items-center justify-center cursor-pointer ">
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
                    value={header.supplierAddress}
                    placeholder="Invoice"
                    onChange={(e) =>
                      handleChange("header", e.target.name, e.target.value)
                    }
                    name="supplierAddress"
                  />
                </div>
                <div className="flex gap-5 p-2 items-center font-semibold">
                  <DotIcon color={"#32A370"} size={10} />
                  <p className="text-textColor w-[20%]">Supplier Phone</p>
                  <input
                    name="supplierPhone"
                    type="text"
                    className="invoice-input"
                    value={header.supplierPhone}
                    placeholder="Supplier Phone"
                    onChange={(e) =>
                      handleChange("header", e.target.name, e.target.value)
                    }
                  />
                </div>
                <div className="flex gap-5 p-2 items-center font-semibold">
                  <DotIcon color={"#32A370"} size={10} />
                  <p className="text-textColor w-[20%]">Invoice Date</p>
                  <input
                    type="text"
                    name="billDate"
                    className="invoice-input"
                    value={header.billDate}
                    placeholder="Invoice Date"
                    onChange={(e) =>
                      handleChange("header", e.target.name, e.target.value)
                    }
                  />
                </div>
                <div className="flex gap-5 p-2 items-center font-semibold">
                  <DotIcon color={"#32A370"} size={10} />
                  <p className="text-textColor w-[20%]">Due Date</p>
                  <input
                    type="text"
                    name="dueDate"
                    className="invoice-input"
                    value={header.dueDate}
                    placeholder="Due Date"
                    onChange={(e) =>
                      handleChange("header", e.target.name, e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <div className="border-b-[0.5px] border-[#c5c6c7] text-sm pb-2 mb-4 text-textColor font-semibold mt-5">
                  Line Items
                </div>

                <div
                  className={`mt-2 grid ${
                    currentItems?.length > 5
                      ? "grid-cols-2 gap-4"
                      : "grid-cols-1 gap-2"
                  }`}
                >
                  <div className="space-y-2">
                    {currentItems?.slice(0, 5).map((item: any) => {
                      const matchedItem = currentItemsMatch.find(
                        (match: any) => match.itemId === item.itemId
                      );
                      const isMatched = matchedItem?.isMatch ?? false;
                      return (
                        <div
                          onClick={() => toggleDropdown("items")}
                          key={item.itemId}
                          className="flex items-center gap-4 font-semibold p-2 max-w-full cursor-pointer"
                        >
                          <DotIcon
                            color={isMatched ? "#32A370" : "#DD2020"}
                            size={10}
                          />
                          <p className="text-textColor whitespace-nowrap flex-shrink-0">
                            Line Item
                          </p>
                          <p
                            className={`truncate ${
                              isMatched ? "text-[#32A370]" : "text-[#DD2020]"
                            }`}
                            title={item.itemName}
                            style={{ maxWidth: "calc(100% - 150px)" }}
                          >
                            {item.itemName}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    {currentItems?.slice(5, 10).map((item: any) => {
                      const matchedItem = currentItemsMatch.find(
                        (match: any) => match.item_id === item.item_id
                      );

                      const isMatched = matchedItem?.isMatch ?? false;

                      return (
                        <div
                          onClick={() => toggleDropdown("items")}
                          key={item.item_id}
                          className="flex items-center gap-4 font-semibold p-2 max-w-full cursor-pointer"
                        >
                          <DotIcon
                            color={isMatched ? "#32A370" : "#DD2020"}
                            size={10}
                          />
                          <p className="text-textColor whitespace-nowrap flex-shrink-0">
                            Line Item
                          </p>
                          <p
                            className={`truncate ${
                              isMatched ? "text-[#32A370]" : "text-[#DD2020]"
                            }`}
                            title={item.itemName}
                            style={{ maxWidth: "calc(100% - 150px)" }}
                          >
                            {item.itemName}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {currentItems.length > 10 && (
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
                        currentPage < totalPages &&
                        setCurrentPage(currentPage + 1)
                      }
                      className="p-1 font-bold text-darkRed cursor-pointer hover:bg-darkRed hover:text-white rounded-md"
                    >
                      [Next]
                    </p>
                  </div>
                )}
              </div>

              {/* Transaction Details */}
              <div className="border-b-[1px] border-[#c5c6c7] text-sm pb-2 mb-4 text-textColor font-semibold mt-5">
                Transaction Details
              </div>
              <div className="space-y- mt-2 w-full">
                {Number(footer.sgst) > 0 && Number(footer.cgst) && (
                  <>
                    <div className="flex gap-5 p-2 items-center font-semibold">
                      <DotIcon color={"#32A370"} size={10} />
                      <p className="text-textColor w-[20%]">CGST</p>
                      <input
                        type="text"
                        name="cgst"
                        className="invoice-input"
                        value={footer?.cgst}
                        placeholder="Invoice"
                        onChange={(e) =>
                          handleChange("footer", e.target.name, e.target.value)
                        }
                      />
                    </div>
                    <div className="flex gap-5 p-2 items-center font-semibold w-full">
                      <DotIcon color={"#32A370"} size={10} />
                      <p className="text-textColor w-[20%]">SGST</p>
                      <input
                        type="text"
                        name="sgst"
                        className="invoice-input"
                        value={footer.sgst}
                        placeholder="Invoice"
                        onChange={(e) =>
                          handleChange("footer", e.target.name, e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
                {Number(footer.igst) > 0 && (
                  <div className="flex gap-5 p-2 items-center font-semibold w-full">
                    <DotIcon color={"#32A370"} size={10} />
                    <p className="text-textColor w-[20%]">IGST</p>
                    <input
                      type="text"
                      name="igst"
                      className="invoice-input"
                      value={footer.igst}
                      placeholder="Invoice"
                      onChange={(e) =>
                        handleChange("footer", e.target.name, e.target.value)
                      }
                    />
                  </div>
                )}
                <div className="flex gap-5 p-2 items-center font-semibold">
                  <DotIcon color={"#32A370"} size={10} />
                  <p className="text-textColor w-[20%]"> Total Amount</p>
                  <input
                    type="text"
                    className="invoice-input "
                    value={footer.grandTotal}
                    placeholder="Total Amount"
                    name="grandTotal"
                    onChange={(e) =>
                      handleChange("footer", e.target.name, e.target.value)
                    }
                  />
                </div>
                <div className="flex gap-5 p-2  justify-start font-semibold ">
                  <div className="mt-1">
                    {" "}
                    <DotIcon color={"#32A370"} size={10} />
                  </div>
                  <p className="text-textColor w-[20%]top-0 ">
                    Additional Notes
                  </p>
                  <textarea
                    name="termsAndConditions"
                    className="invoice-input "
                    value={footer.termsAndConditions}
                    placeholder="Additional Notes"
                    onChange={(e) =>
                      handleChange("footer", e.target.name, e.target.value)
                    }
                  />
                </div>
                <div
                  className="flex gap-5 p-2 items-center font-semibold "
                  // onClick={() => toggleDropdown("supplierName")}
                >
                  <DotIcon color={"#32A370"} size={10} />
                  <p className="text-textColor w-[20%]">Bank Name</p>
                  <input
                    name="bankName"
                    type="text"
                    className="invoice-input"
                    value={bankDetails?.bankName}
                    placeholder="Bank  Name"
                    onChange={(e) =>
                      handleChange("bankDetails", e.target.name, e.target.value)
                    }
                  />
                </div>
                <div className="flex gap-5 p-2 items-center font-semibold">
                  <DotIcon color={"#32A370"} size={10} />
                  <p className="text-textColor w-[20%]">Account No.</p>
                  <input
                    name="accountNo"
                    type="text"
                    className="invoice-input"
                    value={bankDetails?.accountNo}
                    placeholder="Bank Account No"
                    onChange={(e) =>
                      handleChange("bankDetails", e.target.name, e.target.value)
                    }
                  />
                </div>{" "}
                <div className="flex gap-5 p-2 items-center font-semibold">
                  <DotIcon color={"#32A370"} size={10} />
                  <p className="text-textColor w-[20%]">Branch Name</p>
                  <input
                    type="text"
                    name="branchName"
                    className="invoice-input"
                    value={bankDetails?.branchName}
                    placeholder="Branch Name"
                    onChange={(e) =>
                      handleChange("bankDetails", e.target.name, e.target.value)
                    }
                  />
                </div>{" "}
                <div className="flex gap-5 p-2 items-center font-semibold">
                  <DotIcon color={"#32A370"} size={10} />
                  <p className="text-textColor w-[20%]">IFSC Code</p>
                  <input
                    name="ifscCode"
                    type="text"
                    className="invoice-input"
                    value={bankDetails.ifscCode}
                    placeholder="IFSC Code"
                    onChange={(e) =>
                      handleChange("bankDetails", e.target.name, e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="py-2 bg-[#E5E5E5] rounded-b-lg text-xs text-[#4B5C79] flex items-center justify-end px-4 gap-2">
              <Button className="px-4 py-2 " variant="secondary" size="sm" onClick={()=>navigate("/purchase/bills/invoice")} >
                Cancel
              </Button>
              <Button
                className="px-4 py-2"
                variant="primary"
                size="sm"
                onClick={handleUpdate}
              >
                Confirm Document
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OCRInvoiceView;

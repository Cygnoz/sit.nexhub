import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import Button from "../../../Components/Button";
import Pen from "../../../assets/icons/Pen";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import SalesView from "../commonComponents/SalesView";
import toast from "react-hot-toast";
import ConfirmModal from "../../../Components/ConfirmModal";
import TrashCan from "../../../assets/icons/TrashCan";
import Print from "../salesOrder/Print";
import { useReactToPrint } from "react-to-print";
import { useOrganization } from "../../../context/OrganizationContext";

function ViewSales() {
  const [isPdfView, setIsPdfView] = useState(false);
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { page } = location.state || {};
  const { request: getOneSalesOrder } = useApi("get", 5007);
  const [data, setData] = useState<any>(null);
  const { request: deleteData } = useApi("delete", 5007);

  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const confirmDelete = () => {
    setConfirmModalOpen(true);
  };
  const fetchOneSalesOrder = async () => {
    try {
      const url =
        page === "invoice"
          ? `${endponits.GET_ONE_INVOICE}/${id}`
          : page === "salesOrder"
            ? `${endponits.GET_ONE_SALES_ORDER}/${id}`
            : page === "quote" ? `${endponits.GET_ONE_QUOTES}/${id}`
              : page === "reciept" ? `${endponits.GET_ONE_SALES_RECIEPT}/${id}`
                : page === "credit-Note" ? `${endponits.GET_ONE_CREDIT_NOTE}/${id}`
                  : ``;



      const { response, error } = await getOneSalesOrder(url);
      if (!error && response) {
        setData(response.data);
        console.log("Fetched Sales Order:", response.data);
      }
    } catch (error) {
      console.error("Error fetching sales order:", error);
    }
  };


  const handleDelete = async () => {
    try {
      let url = "";
      if (page === "invoice") {
        url = `${endponits.DELETE_SALES_INVOICE}/${id}`;
      } else if (page === "salesOrder") {
        url = `${endponits.DELETE_SALES_ORDER}/${id}`;
      } else if (page === "quote") {
        url = `${endponits.DELETE_SALES_QUOTE}/${id}`;
      } else if (page === "reciept") {
        url = `${endponits.DELETE_SALES_RECIEPT}/${id}`;
      } else if (page === "credit-Note") {
        url = `${endponits.DELETE_CREDIT_NOTE}/${id}`;
      }

      if (!url) return;

      const { response, error } = await deleteData(url);
      if (!error && response) {
        console.log("Deleted successfully:", response);
        toast.success(response.data.message)
        setConfirmModalOpen(false)
        const path =
          page === "salesOrder"
            ? "/sales/salesorder"
            : page === "invoice"
              ? "/sales/invoice"
              : page === "quote"
                ? "/sales/quote"
                : page === "reciept"
                  ? "/sales/receipt"
                  : page === "credit-Note"
                    ? "/sales/credit-note"
                    : "/"

        setTimeout(() => {
          navigate(path);
        }, 1000);


      }
      else {
        toast.error(error.response.data.message)
      }
    } catch (error) {
      console.error("Error in deleting item:", error);
    }
  };

  useEffect(() => {
    fetchOneSalesOrder();
  }, [id]);

  const handleToggle = () => {
    setIsPdfView(!isPdfView);
  };
  const navigate = useNavigate()
  const handleGoBack = () => {
    navigate(-1)
  }
  const haneleEdit = () => {
    if (page === "salesOrder") {
      navigate(`/sales/salesorder/edit/${id}`);
    } else if (page === "invoice") {
      navigate(`/sales/invoice/edit/${id}`);
    } else if (page === "quote") {
      navigate(`/sales/quote/edit/${id}`);
    } else if (page === "credit-Note") {
      navigate(`/sales/credit-note/edit/${id}`);
    }
  }

  const { request: getOneCustomer } = useApi("get", 5002);
  const [customerData, setCustomerData] = useState<any>(null);
  const { organization } = useOrganization();

  const fetchOneCustomer = async () => {
    try {
      if (data?.customerId) {
        const url = `${endponits.GET_ONE_CUSTOMER}/${data.customerId}`;
        const { response, error } = await getOneCustomer(url);
        if (!error && response) {
          setCustomerData(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  useEffect(() => {
    fetchOneCustomer();
  }, [data?.customerId]);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div className="px-6">
      <div className="bg-white rounded-md p-5 mb-32">
        <div className="flex items-center gap-5">
          <div
            onClick={handleGoBack}
            style={{ borderRadius: "50%" }}
            className="w-[40px] h-[40px] flex items-center justify-center bg-backButton cursor-pointer"

          >
            <CheveronLeftIcon />
          </div>
          <p className="text-textColor text-xl font-bold">{
            page === "salesOrder" ?
              "View Order"
              : page === "invoice" ?
                "View Invoice Order"
                : page === "quote" ? "View Sales Quote"
                  : page === "credit-Note" ? "View CreditNote"
                    : "Na"
          }</p>
        </div>
        <br />

        <div className="flex-row sm:flex justify-between">
          <div className="flex gap-3 items-center">
            <p className="text-lg text-textColor font-bold pr-4 border-r-[1px] border-borderRight">
              {
                page == "salesOrder" ?
                  "Sales Order"
                  : page == "invoice" ? " Invoice Order"
                    : page == "quote" ? "Quote"
                      : page == "credit-Note" ? "Credit Note" :
                        "Na"
              }
            </p>
            <p className="text-lg text-textColor font-bold pr-4 border-r-[1px] border-borderRight">
              {page === "salesOrder" ? `Sales Order #${data?.salesOrder || "N/A"}` :
                page === "invoice" ? `Invoice Order #${data?.salesInvoice || "N/A"}`
                  : page === "quote" ? `Quote #${data?.salesQuotes || "N/A"}`
                    : page === "credit-Note" ? `Invoice #${data?.invoiceNumber || "N/A"}`
                      : ""}
            </p>

            {page !== "credit-Note" && (
              <p className="text-sm font-semibold text-textColor bg-cuscolumnbg p-1 text-center rounded-sm">
                {data?.status || "Draft"}
              </p>
            )}

          </div>
          <div className="flex-row sm:flex gap-3 mt-1 items-center">
            <div className="flex gap-3 items-center">

              <Button variant="secondary" className="pl-6 pr-6" size="sm" onClick={haneleEdit}>
                <Pen color="#565148" />
                <p className="text-sm font-medium">Edit</p>
              </Button>
              <Button variant="secondary" className="pl-6 pr-6" size="sm" onClick={confirmDelete}>
                <TrashCan color="#565148" />
                <p className="text-sm font-medium">Delete</p>
              </Button>
            </div>
            <div>
              {
                isPdfView &&
                <div onClick={() => reactToPrintFn()}>
                  <Print />
                </div>
              }
            </div>


            {/* Toggle PDF view */}
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isPdfView}
                  onChange={handleToggle}
                />
                <div
                  className={`w-11 h-6 rounded-full shadow-inner transition-colors ${isPdfView ? "bg-checkBox" : "bg-dropdownBorder"
                    }`}
                ></div>
                <div
                  className={`dot absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${isPdfView ? "transform translate-x-full left-2" : "left-1"
                    }`}
                ></div>
              </div>
              <div className="ml-3 text-textColor font-semibold text-base">
                PDF View
              </div>
            </label>
          </div>
        </div>
        <hr className="border-t border-inputBorder mt-4" />
        {/* Conditional rendering based on isPdfView */}
        {isPdfView ? (
          <div className="pdf-view-component">
            <div className="mt-4 relative ">
              <div className="flex items-center justify-center mb-4 hide-print">
                <p className="text-textColor border-r-[1px] border-borderRight pr-4 text-sm font-medium">
                  {
                    page === "quote" ? "Quote Date :" :
                      page === "credit-Note" ? "Credit Date :" :
                        "Order Date :"
                  }
                  <span className="ms-3 text-dropdownText text-base font-bold">
                    {
                      page === "salesOrder" ? `${data?.salesOrderDate || "N/A"}` :
                        page === "invoice" ? `${data?.salesInvoiceDate || "N/A"}` :
                          page === "quote" ? `${data?.salesQuoteDate || "N/A"}` :
                            page === "credit-Note" ? `${data?.customerCreditDate || "N/A"}` :
                              "N/A"
                    }
                  </span>
                </p>
                {page !== "credit-Note" && (
                  <p className="text-textColor pl-4 text-sm font-medium">
                    Expected Shipment:{" "}
                    <span className="ms-3 text-dropdownText text-base font-bold">
                      {
                        page === "salesOrder" || page === "invoice" ?
                          `${data?.expectedShipmentDate || "N/A"}` :
                          `${data?.expiryDate || "N/A"}`
                      }
                    </span>
                  </p>
                )}

              </div>
              <div className="flex justify-center items-center" ref={contentRef}>
                <div className="bg-white drop-shadow-2xl w-[320px] print-container sm:w-[595px] p-8 pl-[24px] pr-[24px]">
                  <div className="flex justify-between items-center mb-8 mt-1">
                    <div>
                      <img
                        src={
                          organization?.organizationLogo ||
                          "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"
                        }
                        alt="Organization image"
                        className="w-28"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png";
                        }}
                      />
                    </div>
                    <div className="text-right">
                      <h2 className="text-xl font-bold text-textColor">{
                        page == "quote" ? "QUOTE"
                          : page == "invoice" ? "TAX INVOICE"
                            : page == "salesOrder" ? "SALES ORDER"
                              : ""
                      }</h2>
                      <p className="text-sm font-bold text-dropdownText mt-[5px]">
                        {page === "salesOrder" ? `Sales Order #${data?.salesOrder || "N/A"}` :
                          page === "invoice" ? `Invoice Order #${data?.salesInvoice || "N/A"}`
                            : page === "quote" ? `Quote #${data?.salesQuotes || "N/A"}`
                              : ""}
                      </p>
                      <h3 className="font-normal text-xs mt-[14px] text-pdftext">
                        {organization?.organizationName}
                      </h3>
                      <p className="font-normal text-xs text-pdftext">
                        {customerData?.customerEmail} | {customerData?.mobile}
                      </p>
                    </div>
                  </div>

                  <div className="m-4 w-3/4">
                    <h3 className="font-normal text-xs text-pdftext">Bill to</h3>
                    <p className="text-pdftext text-sm font-bold mt-2">
                      {customerData?.customerDisplayName || data?.customerName}
                    </p>
                    <p className="font-normal text-xs text-pdftext">
                      {customerData?.customerEmail} | {customerData?.mobile}
                    </p>
                    <p className="font-normal text-xs text-pdftext">
                      {customerData?.billingAddressLine1}, {customerData?.billingCity}
                      <br />
                      {customerData?.billingState} {customerData?.billingPinCode}
                    </p>

                    <h3 className="font-normal text-xs text-pdftext">Details</h3>
                    <p className="font-normal text-xs text-pdftext">
                      {page === "credit-Note" ? "Credit Date: " : "Order Date: "}
                      {
                        page === "salesOrder" ? `${data?.salesOrderDate || "N/A"}` :
                          page === "invoice" ? `${data?.salesInvoiceDate || "N/A"}` :
                            page === "quote" ? `${data?.salesQuoteDate || "N/A"}` :
                              page === "credit-Note" ? `${data?.customerCreditDate || "N/A"}` :
                                "N/A"
                      }
                    </p>
                    {page !== "credit-Note" && (
                      <p className="font-normal text-xs text-pdftext">
                        Expected Shipment Date: {
                          page === "salesOrder" || page === "invoice" ? `${data?.expectedShipmentDate || "N/A"}` :
                            `${data?.expiryDate || "N/A"}`
                        }
                      </p>
                    )}

                  </div>
                  <div className="overflow-x-auto">

                    <table className="w-full mb-7 border border-dropdownBorder">
                      <thead className="border-b border-dropdownBorder">
                        <tr className="font-bold text-[10px] text-pdftext text-center">
                          <th className="py-2 px-4 text-left w-[350px]">Description</th>
                          <th className="py-2 px-4 pl-16">Qty</th>
                          <th className="py-2 px-4">Price</th>
                          <th className="py-2 px-4">GST</th>
                          <th className="py-2 px-4">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.items.map((item: any) => (
                          <tr key={item.itemId} className="text-[10px] text-left">
                            <td className="py-2 px-4">{item.itemName}</td>
                            <td className="py-2 px-4 pl-16">{item.quantity}</td>
                            <td className="py-2 px-4">{item.sellingPrice.toFixed(2)}</td>
                            <td className="py-2 px-4">{item.cgstAmount + item.sgstAmount + item.igstAmount}</td>
                            <td className="py-2 px-4">{item.itemAmount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end mb-32">
                    <div className="w-[58.4%] border border-dropdownBorder rounded bg-pdfbg">
                      <div className="px-4 mt-4 bg-gray-100 rounded-lg flex justify-between">
                        <h4 className="text-pdftext text-xs font-normal">
                          Sub total (excl. GST)
                        </h4>
                        <p className="text-pdftext text-xs font-normal">
                          {organization?.baseCurrency} {(Number(data?.totalAmount) - Number(data?.totalTax)).toFixed(2)}
                        </p>
                      </div>
                      <div className="px-4 mt-3 mb-5 bg-gray-100 rounded-lg flex justify-between">
                        <h4 className="text-pdftext text-xs font-normal">Total</h4>
                        <p className="text-pdftext text-xs font-normal">
                          {organization?.baseCurrency} {data?.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-7 right-0 flex justify-center items-center w-[50%] gap-4 mb-[20px] print-signature">
                    <p className="text-pdftext text-xs font-normal">Signature</p>
                    <div className="border-t border-[0.5px] border-loremcolor w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="other-component">
            <SalesView data={data} page={page} />
          </div>
        )}
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

export default ViewSales;

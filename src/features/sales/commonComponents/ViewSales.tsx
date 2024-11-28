import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import Button from "../../../Components/Button";
import Pen from "../../../assets/icons/Pen";
import MailIcon from "../../../assets/icons/MailIcon";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import SalesPdfView from "../commonComponents/SalesPdfView";
import SalesView from "../commonComponents/SalesView";

interface SalesOrderData {
  salesInvoiceDate?: string;
  salesInvoice?: string;
  salesQuotes?: string; 
  salesOrderDate: string;
  salesOrder: string;
  expectedShipmentDate: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  customerId: number;
  subTotal: number;
  totalTax: number;
  totalDiscount: number;
  cgst: number; 
  sgst: number;
  createdDate: string;
  discountTransactionAmount: number;
  expiryDate: string;
  placeOfSupply: string;
  salesQuoteDate: string;
  totalItem: number;
}
interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  sellingPrice: number;
  amount: number;
  itemAmount: number;
  sgstAmount:number;
  cgstAmount:number;
}

function ViewSales() {
  const [isPdfView, setIsPdfView] = useState(false);
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { page } = location.state || {};
  const { request: getOneSalesOrder } = useApi("get", 5007);
  const [data, setData] = useState<SalesOrderData | null>(null);

  const fetchOneSalesOrder = async () => {
    try {
      const url =
        page === "invoice"
          ? `${endponits.GET_ONE_INVOICE}/${id}`
          : page === "salesOrder"
          ? `${endponits.GET_ONE_SALES_ORDER}/${id}`
          : page === "quote" ? `${endponits.GET_ONE_QUOTES}/${id}`
          :page === "reciept" ? `${endponits.GET_ONE_SALES_RECIEPT}/${id}`
          :
          ``;
      const { response, error } = await getOneSalesOrder(url);
      if (!error && response) {
        setData(response.data);
        console.log("Fetched Sales Order:", response.data);
      }
    } catch (error) {
      console.error("Error fetching sales order:", error);
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

  return (
    <div className="px-6">
      <div className="bg-white rounded-md p-5 mb-32">
        <div className="flex items-center gap-5">
          <div
            onClick={handleGoBack}
            style={{ borderRadius: "50%" }}
            className="w-[40px] h-[40px] flex items-center justify-center bg-backButton"
          >
            <CheveronLeftIcon />
          </div>
          <p className="text-textColor text-xl font-bold">{
            page === "salesOrder" ?
              "View Order"
              : page === "invoice" ?
                "View Invoice Order" 
                : page === "quote" ? "View Sales Quote"
                : "Na"
          }</p>
        </div>
        <br />

        <div className="flex justify-between">
          <div className="flex gap-3 items-center">
            <p className="text-lg text-textColor font-bold pr-4 border-r-[1px] border-borderRight">
              {
                page == "salesOrder" ?
                  "Sales Order"
                  : page == "invoice" ? " Invoice Order" 
                  : page == "quote" ? "Quote" :
                  "Na"
              }
            </p>
            <p className="text-lg text-textColor font-bold pr-4 border-r-[1px] border-borderRight">
              {page === "salesOrder" ? `Sales Order #${data?.salesOrder || "N/A"}` :
                page === "invoice" ? `Invoice Order #${data?.salesInvoice || "N/A"}` 
                : page === "quote" ? `Quote #${data?.salesQuotes || "N/A"}`
                : ""}
            </p>

            <p className="text-sm font-semibold text-textColor bg-cuscolumnbg p-1 text-center rounded-sm">
              {data?.status || "Draft"}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <Button variant="secondary" className="pl-6 pr-6" size="sm">
              <Pen color="#565148" />
              <p className="text-sm font-medium">Edit</p>
            </Button>
            <Button variant="secondary" className="pl-5 pr-5" size="sm">
              <MailIcon color="#565148" />
              <p className="text-sm font-medium">Email</p>
            </Button>
            <select
              name=""
              id=""
              className="border-outlineButton border rounded-md px-[0.625rem] py-2 text-sm font-medium text-outlineButton "
            >
              <option value="">More Action</option>
            </select>
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
            <SalesPdfView data={data} page={page} />
          </div>
        ) : (
          <div className="other-component">
            <SalesView data={data} page={page} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewSales;

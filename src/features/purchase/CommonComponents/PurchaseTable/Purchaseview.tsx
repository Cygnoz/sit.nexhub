import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import CheveronLeftIcon from "../../../../assets/icons/CheveronLeftIcon";
import Button from "../../../../Components/Button";
import Pen from "../../../../assets/icons/Pen";
import MailIcon from "../../../../assets/icons/MailIcon";
import OrderView from "./OderView";
import { endponits } from "../../../../Services/apiEndpoints";
import useApi from "../../../../Hooks/useApi";
import PDFView from "./PDFView";
import { useOrganization } from "../../../../context/OrganizationContext";




type Props = { page: string  };

function Purchaseview({ page }: Props) {

  const [data, setData] = useState<[] | any>([]);
  const { request: getPurchaseOrder } = useApi("get", 5005);
  const { request: getBills } = useApi("get", 5005);
  const { request: getDebitN } = useApi("get", 5005);
  const { organization } = useOrganization()
  const [searchParams] = useSearchParams();
  const param = useParams();

  const isPdfViewDefault = searchParams.get("pdfView") === "true";
  const [isPdfView, setIsPdfView] = useState(
    page === "Bills" ? isPdfViewDefault : false
  );
  const handleToggle = () => {
    setIsPdfView(!isPdfView);
  };
  console.log(page,"page")

  const POid = param.id;

  const fetchData = async (endpoint:any, apiCall:any, logLabel:any) => {
    try {
      const url = `${endpoint}/${POid}`;
      const { response, error } = await apiCall(url);
      if (!error && response) {
        setData(response.data);
        // console.log(response.data, `${logLabel} response`);
      } else {
        console.log(error?.response, `Error fetching ${logLabel}`);
      }
    } catch (error) {
      console.error(`Error in ${logLabel}`, error);
    }
  };
  
  useEffect(() => {
    if (!POid) return; 
    if (page === "PurchaseOrder") {
      fetchData(endponits.GET_ONE_PURCHASE_ORDER, getPurchaseOrder, "Purchase Order");
    } else if (page === "Bills") {
      fetchData(endponits.GET_A_BILL, getBills, "Bill");
    } else if (page === "DebitNote") {
      fetchData(endponits.GET_DEBIT_NOTE, getDebitN, "Debit Note");
    }
  }, [page, POid]);
  

  return (
    <div className="mt-4">
      <div className="px-6">
        <div className="bg-white rounded-md p-5 mb-32">
          <div className="flex items-center gap-5">
          <Link
  to={
    page === "PurchaseOrder"
      ? "/purchase/purchase-order"
      : page === "Bills"
      ? "/purchase/bills"
      : page === "DebitNote"
      ? "/purchase/debitnote"
      : "/"
  }
>
  <div
    style={{ borderRadius: "50%" }}
    className="w-[40px] h-[40px] flex items-center justify-center bg-backButton"
  >
    <CheveronLeftIcon />
  </div>
</Link>

            <p className="text-textColor text-xl font-bold">
  {page === "PurchaseOrder"
    ? "Purchase Order"
    : page === "Bills"
    ? "View Bill"
    : "Debit Note"}
</p>
          </div>
          <br />
          <div className="flex justify-between">
            <div className="flex gap-3 items-center">
             { page=="Bills" && <p className="text-lg text-textColor font-bold pr-4 border-r-[1px] border-borderRight">
               Bill
              </p>}
              <p className="text-lg text-textColor font-bold pr-4 border-r-[1px] border-borderRight">
                {page === "PurchaseOrder"
                  ? `Purchase Order ${data?.purchaseOrder}`
                  : page=="Bills"? `Bill ${data?.billNumber || ''}` : `Debit Note ${data?.debitNote}`}
              </p>
              <p className="text-sm font-semibold text-textColor bg-cuscolumnbg p-1 text-center rounded-sm">
                Draft
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <Button variant="secondary" className="pl-6 pr-6" size="sm">
                <Pen color="#565148" />
                <p className="text-sm font-medium">Edit</p>
              </Button>
             {page!=="PurchaseOrder" &&
              <>
               <Button variant="secondary" className="pl-5 pr-5" size="sm">
                  <MailIcon color="#565148" />
                  <p className="text-sm font-medium">Email</p>
                </Button>
                <select
                  name=""
                  id=""
                  className="border-outlineButton border rounded-md px-[0.625rem] py-2 text-sm font-medium text-outlineButton"
                >
                  <option value="">More Action</option>
                </select>
            </>
            }
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isPdfView}
                    onChange={handleToggle}
                  />
                  <div
                    className={`w-11 h-6 rounded-full shadow-inner transition-colors ${
                      isPdfView ? "bg-checkBox" : "bg-dropdownBorder"
                    }`}
                  ></div>
                  <div
                    className={`dot absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                      isPdfView
                        ? "transform translate-x-full left-2"
                        : "left-1"
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
          {isPdfView ? (
            <div className="pdf-view-component">
              <PDFView data={data} page={page} organization={organization}/>
            </div>
          ) : (
            <div className="other-component">
              <OrderView data={data} page={page} organization={organization} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Purchaseview;

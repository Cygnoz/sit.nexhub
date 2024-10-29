import { useEffect, useState } from "react";
import PrinterIcon from "../../../../assets/icons/PrinterIcon";
import Button from "../../../../Components/Button";
import { endponits } from "../../../../Services/apiEndpoints";
import useApi from "../../../../Hooks/useApi";

interface QuoteItem {
  itemId: string;
  itemName: string;
  quantity: number;
  sellingPrice: number;
  amount: number;
}

interface QuoteData {
  cgst: number;
  sgst: number;
  salesQuoteDate: string;
  expiryDate: string;
  customerName: string;
  items: QuoteItem[];
  totalAmount: number;
  status: string;
  customerId: number;
}

interface Customer {
  _id: string;
  billingAttention: string;
  companyName: string;
  mobile: string;
  customerEmail: string;
  skypeNameNumber?: string;
  billingPhone: string;
  billingCity: string;
  status: string;
  customerDisplayName: string;
  [key: string]: any;
}

interface SalesOrderViewProps {
  data: QuoteData | null;
}

function SalesQuoteView({ data }: SalesOrderViewProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const { request: getOneCustomer } = useApi("get", 5002);
  const [customerData, setCustomerData] = useState<Customer | null>(null);

  const toggleItemDetails = (itemId: string) => {
    setOpenItemId((prev) => (prev === itemId ? null : itemId));
  };

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

  return (
    <div className="mt-4">
      {/* Quote Date & Expected Shipment */}
      <div className="flex items-center justify-start mb-4">
        <p className="text-textColor border-r-[1px] border-borderRight pr-4 text-sm font-normal">
          Quote Date:
          <span className="ms-3 text-dropdownText text-sm font-semibold">
            {data?.salesQuoteDate || "N/A"}
          </span>
        </p>
        <p className="text-textColor pl-4 text-sm font-normal">
          Expected Shipment:
          <span className="ms-3 text-dropdownText text-sm font-semibold">
            {data?.expiryDate || "N/A"}
          </span>
        </p>
      </div>

      {/* Send Purchase Order */}
      <div className="mt-4 bg-cuscolumnbg p-4 rounded-lg flex justify-between items-center">
        <div>
          <p className="text-base font-bold text-textColor">Send Sales Quote</p>
          <p className="text-sm font-normal text-dropdownText mt-2">
            Sales quote has been created. You can email the Sales Quote to your
            customer or mark it as Confirmed.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" className="pl-4 pr-4" size="sm">
            <p className="text-sm font-medium">Mark as Confirmed</p>
          </Button>
          <Button className="pl-4 pr-4" size="sm">
            <p className="text-sm font-medium">Send Sales Quote</p>
          </Button>
        </div>
      </div>

      {/* Item Details */}
      <div className="grid grid-cols-2 gap-6 mt-4">
        {data?.items.map((item) => (
          <div
            key={item.itemId}
            className="p-4 rounded-lg relative"
            style={{
              background:
                "linear-gradient(89.66deg, #E3E6D5 -0.9%, #F7E7CE 132.22%)",
            }}
          >
            {/* Toggle Button */}
            <button
              onClick={() => toggleItemDetails(item.itemId)}
              className="absolute top-3 right-3 focus:outline-none"
              aria-label={
                openItemId === item.itemId ? "Hide details" : "Show details"
              }
            >
              {openItemId === item.itemId ? "▲" : "▼"}
            </button>

            {/* Main Content */}
            <div className="flex items-center">
              <div className="flex items-center border-borderRight pr-4">
                <img
                  src="https://s3-alpha-sig.figma.com/img/d280/d28b/ae738328489af5e587e95fe2105955cf?Expires=1722211200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=p~s4Pd6Qn~p7F2xhOj69kvQuS37jfaVfI~EPvWb3T0GRZszU5IMeNwTmqxKJYVaPzM49ClHtCjva1VuSGl5111Wlfbzit1xe4LSjDywVLhQIlVB2nuy5~7fZOYUdnuVXb2ZtDTL0D3JJCpHURXzepy1njjkZQZtCsMILKWthxm8qryLy-rW7uS870zgh8jX~a1rgig7zSqzVqfolspoo-dnLzhajoPQQuw3LOSOhvAmnpKGjxJsXe6pxQC6XCDHhZjYgyM2bd6MAt6Q1iOBBmy0PDSce0Fyz-wX9mIjfg-KO6wvrCeVpw11e-rG6MvmipkKu9HW10oR2-y~9mAkRcg__"
                  alt="Item"
                  className="w-20 h-16 object-cover rounded mr-4"
                />
                <div>
                  <p className="text-blk font-semibold">{item.itemName}</p>
                  <p className="text-dropdownText text-sm">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            {openItemId === item.itemId && (
              <div className="mt-4 bg-gray-100 rounded-lg w-full flex">
                {/* Rate */}
                <div className="border-r flex items-center border-borderRight pr-[28px] h-[62px] pl-6">
                  <div>
                    <p className="text-dropdownText text-sm">Rate</p>
                    <p className="font-bold text-sm text-textColor">
                      RS. {item.sellingPrice}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center h-[62px] pl-6">
                  <div>
                    <p className="text-dropdownText text-sm">Amount</p>
                    <p className="font-bold text-sm text-textColor">
                      RS. {item.amount}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <hr className="mt-6 border-t border-inputBorder" />

      {/* Billing Address */}
      <div className="flex items-center justify-between gap-6 mt-6">
        <div className="p-6 rounded-lg border border-billingBorder w-[50%]">
          <p className="text-base font-bold text-textColor">Billing Address</p>
          <div className="mt-4 text-base mb-[70px] text-dropdownText">
            {customerData ? (
              <>
                <p>{customerData.billingAttention}</p>
                <p>{customerData.companyName}</p>
                <p className="text-textColor">{customerData.billingCity}</p>
                <p>{customerData.billingPhone}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Loading customer data...</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-6 rounded-lg border border-billingBorder w-[50%]">
          <p className="text-base font-bold text-textColor">Order Summary</p>
          <div className="mt-[18.5px] text-textColor">
            <div className="flex justify-between items-center">
              <p className="text-sm">Untaxed Amount</p>
              <p className="font-bold text-lg">
                RS {data?.totalAmount.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p>SGST</p>
              <p>RS {data?.sgst.toFixed(2) || "0.00"}</p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p>CGST</p>
              <p>RS {data?.cgst.toFixed(2) || "0.00"}</p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-base font-bold text-blk">Total</p>
              <p className="text-textColor font-bold text-lg">
                RS {data?.totalAmount.toFixed(2) || "0.00"}
              </p>
            </div>
            <hr className="mt-4 border-t border-[#CCCCCC]" />
            <div className="flex justify-end gap-2 mt-6 mb-2">
              <Button variant="secondary" size="sm" className="pl-4 pr-4">
                <p className="text-sm font-medium">Cancel</p>
              </Button>
              <Button variant="secondary" className="pl-2 pr-2" size="sm">
                <PrinterIcon color="#565148" height={16} width={16} />
                <p className="text-sm font-medium">Print</p>
              </Button>
              <Button variant="primary" className="pl-3 pr-3" size="sm">
                <p className="text-sm font-medium">Save & Send</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesQuoteView;

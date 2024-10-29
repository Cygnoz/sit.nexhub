import { useEffect, useState } from "react";
import { endponits } from "../../../../Services/apiEndpoints";
import useApi from "../../../../Hooks/useApi";
import { useOrganization } from "../../../../context/OrganizationContext";

interface QuoteItem {
  itemId: string;
  itemName: string;
  quantity: number;
  sellingPrice: number;
  amount: number;
  itemAmount: number;
}

interface QuoteData {
  cgst: number;
  sgst: number;
  createdDate: string;
  customerName: string;
  discountTransactionAmount: number;
  expiryDate: string;
  items: QuoteItem[];
  placeOfSupply: string;
  salesQuoteDate: string;
  salesQuotes: string;
  status: string;
  subTotal: number;
  totalAmount: number;
  totalDiscount: number;
  totalItem: number;
  totalTax: number;
  customerId: number;
}

interface SalesOrderViewProps {
  data: QuoteData | null;
}

interface Customer {
  _id: string;
  billingAttention: string;
  companyName: string;
  mobile: string;
  customerEmail: string;
  skypeNameNumber?: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingPinCode: string;
  billingState: string;
  billingPhone: string;
  billingCity: string;
  status: string;
  customerDisplayName: string;
  [key: string]: any;
}

function SalesQuotePdfView({ data }: SalesOrderViewProps) {
  const { request: getOneCustomer } = useApi("get", 5002);
  const [customerData, setCustomerData] = useState<Customer | null>(null);
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

  return (
    <div className="mt-4">
      <div className="flex items-center justify-center mb-4">
        <p className="text-textColor border-r-[1px] border-borderRight pr-4 text-sm font-medium">
          Quote Date:{" "}
          <span className="ms-3 text-dropdownText text-base font-bold">
            {data?.salesQuoteDate}
          </span>
        </p>
        <p className="text-textColor pl-4 text-sm font-medium">
          Expected Shipment:{" "}
          <span className="ms-3 text-dropdownText text-base font-bold">
            {data?.expiryDate}
          </span>
        </p>
      </div>
      <div className="flex justify-center items-center">
        <div className="bg-white drop-shadow-2xl w-[595px] p-8 pl-[24px] pr-[24px]">
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
              <h2 className="text-xl font-bold text-textColor">QUOTE</h2>
              <p className="text-sm font-bold text-dropdownText mt-[5px]">
                Quote# {data?.salesQuotes}
              </p>
              <h3 className="font-normal text-xs mt-[14px] text-pdftext">
                {organization?.organizationName}
              </h3>
              <p className="font-normal text-xs text-pdftext">
                {organization?.organizationPhNum}
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
            <p className="font-normal text-xs text-pdftext ">
              Order Date: {data?.salesQuoteDate}
            </p>
            <p className="font-normal text-xs text-pdftext">
              Expected Shipment Date: {data?.expiryDate}
            </p>
          </div>

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
              {data?.items.map((item: QuoteItem) => (
                <tr key={item.itemId} className="text-[10px] text-left">
                  <td className="py-2 px-4">{item.itemName}</td>
                  <td className="py-2 px-4 pl-16">{item.quantity}</td>
                  <td className="py-2 px-4">{item.sellingPrice.toFixed(2)}</td>
                  <td className="py-2 px-4">{data.cgst + data.sgst}</td>
                  <td className="py-2 px-4">{item.itemAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-[58.4%] border border-dropdownBorder rounded bg-pdfbg">
              <div className="px-4 mt-4 bg-gray-100 rounded-lg flex justify-between">
                <h4 className="text-pdftext text-xs font-normal">
                  Sub total (excl. GST)
                </h4>
                <p className="text-pdftext text-xs font-normal">
                  {organization?.baseCurrency} {data?.subTotal.toFixed(2)}
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

          <div className="w-[50%] mt-[64px] gap-4 mb-[55.5px] flex justify-center items-center">
            <p className="text-pdftext text-xs font-normal">Signature</p>
            <div className="border-t border-[0.5px] border-loremcolor w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesQuotePdfView;

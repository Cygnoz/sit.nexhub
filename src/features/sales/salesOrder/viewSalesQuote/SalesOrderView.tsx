import { useEffect, useState } from "react";
import { useOrganization } from "../../../../context/OrganizationContext";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import Button from "../../../../Components/Button";
import CheveronDownIcon from "../../../../assets/icons/CheveronDownIcon";
import CheveronUp from "../../../../assets/icons/CheveronUp";

interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  sellingPrice: number;
  amount: number;
  itemAmount: number;
}

interface SalesOrderData {
  orderDate: string;
  expectedShipmentDate: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  customerId: number;
  subTotal: number;
  totalTax: number;
  totalDiscount: number;
}

interface Customer {
  _id: string;
  billingAttention: string;
  companyName: string;
  mobile: string;
  customerEmail: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingPinCode: string;
  billingState: string;
  billingPhone: string;
  billingCity: string;
  status: string;
  customerDisplayName: string;
}

interface SalesOrderViewProps {
  data: SalesOrderData | null;
}

function SalesOrderView({ data }: SalesOrderViewProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const { request: getOneCustomer } = useApi("get", 5002);
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  const { organization } = useOrganization();

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
      {/* Order Date & Expected Shipment */}
      <div className="flex items-center justify-start mb-4">
        <p className="text-textColor border-r-[1px] border-borderRight pr-4 text-sm font-normal">
          Order Date:
          <span className="ms-3 text-dropdownText text-sm font-semibold">
            {data?.orderDate || "N/A"}
          </span>
        </p>
        <p className="text-textColor pl-4 text-sm font-normal">
          Expected Shipment:
          <span className="ms-3 text-dropdownText text-sm font-semibold">
            {data?.expectedShipmentDate || "N/A"}
          </span>
        </p>
      </div>

      {/* Send Sales Order */}
      <div className="mt-4 bg-cuscolumnbg p-4 rounded-lg flex justify-between items-center">
        <div>
          <p className="text-base font-bold text-textColor">Send Sales Order</p>
          <p className="text-sm font-normal text-dropdownText mt-2">
            Sales order has been created. You can email the Sales Order to your
            customer or mark it as Confirmed.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" className="pl-4 pr-4" size="sm">
            <p className="text-sm font-medium">Mark as Confirmed</p>
          </Button>
          <Button className="pl-4 pr-4" size="sm">
            <p className="text-sm font-medium">Send Sales Order</p>
          </Button>
        </div>
      </div>

      {/* Item Details */}
      <div className="grid grid-cols-4 gap-6 mt-4">
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
              {openItemId === item.itemId ? (
                <CheveronUp color="black" />
              ) : (
                <CheveronDownIcon color="black" />
              )}
            </button>

            {/* Main Content */}
            <div className="flex items-center">
              <div className="flex items-center border-borderRight pr-4">
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
                      {organization?.baseCurrency}. {item.sellingPrice}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center h-[62px] pl-6">
                  <div>
                    <p className="text-dropdownText text-sm">Amount</p>
                    <p className="font-bold text-sm text-textColor">
                      {organization?.baseCurrency}. {item.itemAmount}
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
      <div className="flex justify-between gap-6 mt-6">
        <div className="p-6 rounded-lg border border-billingBorder w-[50%]">
          <p className="text-base font-bold text-textColor">Billing Address</p>
          <div className="mt-4 text-base mb-[70px] text-dropdownText">
            {customerData ? (
              <>
                <p>{customerData.billingAttention}</p>
                <p>{customerData.companyName}</p>
                <p>{customerData.billingAddressLine1}</p>
                <p>{customerData.billingAddressLine2}</p>
                <p>{customerData.billingPinCode}</p>
                <p>{customerData.billingCity}</p>
                <p>{customerData.billingState}</p>
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
              <p>Sub Total</p>
              <p className="font-bold text-lg">
                {organization?.baseCurrency} {data?.subTotal}
              </p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p>Total Item</p>
              <p>{data?.items.length}</p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p>Total Discount</p>
              <p>
                {organization?.baseCurrency} {data?.totalDiscount}
              </p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p>Total Taxed Amount</p>
              <p>
                {organization?.baseCurrency} {data?.totalTax}
              </p>
            </div>
            <hr className="mt-4 border-t border-[#CCCCCC]" />
            <div className="mt-4 flex justify-between items-center">
              <p className="text-base font-bold text-blk">Total</p>
              <p className="text-textColor font-bold text-lg">
                {organization?.baseCurrency} {data?.totalAmount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesOrderView;

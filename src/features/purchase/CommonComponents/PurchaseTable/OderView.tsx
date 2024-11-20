import { useEffect, useState } from "react";
import PrinterIcon from "../../../../assets/icons/PrinterIcon";
import Button from "../../../../Components/Button";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import SendPurchaseOrder from "../../purchaseOrder/viewPurchaseOrder/SendPurchaseOrder";
import CheveronDownIcon from "../../../../assets/icons/CheveronDownIcon";
import CheveronUp from "../../../../assets/icons/CheveronUp";

type Props = { 
  data?: any;
  page?: string; 
  organization?: any;
};

function OrderView({ data, page, organization }: Props) {
  const [supplier, setSupplier] = useState<any>({});
  const { request: getSupplier } = useApi("get", 5009);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setExpandedItemId((prev) => (prev === id ? null : id));
  };

  const getSupplierAddress = async () => {
    if (!data?.supplierId) return; 

    try {
      const url = `${endponits.GET_ONE_SUPPLIER}/${data.supplierId}`;
      const { response, error } = await getSupplier(url);
      if (response && !error) {
        setSupplier(response.data);
      } else {
        console.error("Error fetching supplier:", error);
      }
    } catch (error) {
      console.error("Error fetching supplier:", error);
    }
  };

  useEffect(() => {
    getSupplierAddress();
  }, [data]);

  const renderItemTable = () => {
    const items = data?.itemTable || data?.items;

    if (!items || !items.length) return <p>No items available</p>;

    return items.map((item: any) => (
      
    <div className="grid grid-cols-2 gap-4">
   <p hidden>   {item._id}</p>
        <div>
      {items && items.length > 0 ? (
        items.map((item: any) => (
          <div
            key={item.id}
            className="mt-6 p-4 rounded-lg flex items-center flex-col" 
            style={{
              background: "linear-gradient(89.66deg, #E3E6D5 -0.9%, #F7E7CE 132.22%)",
            }}
          >
            {/* Accordion Header */}
            <div
              className="w-full flex items-center justify-between cursor-pointer"
              onClick={() => toggleAccordion(item.id)}
            >
              <div className="flex items-center">
                <img src={item.itemImage || ""} alt="Item" className="h-16 w-20" />
               <div className="text-textColor">
                  <p className="ml-4  text-sm text-blk">Item</p>
  
                  <p className="ml-4 font-semibold text-base text-blk">{item.itemName}</p>
               </div>
              </div>
              <p className="text-sm font-medium text-dropdownText">
                {expandedItemId === item._id ? <CheveronUp color={"currentColor"}/> : <CheveronDownIcon color={"currentColor"} />}
              </p>
            </div>

            {/* Accordion Content */}
            <div
              className={`w-full grid grid-cols-5 mt-2 transition-all duration-300 ease-in-out text-center ${
                expandedItemId === item._id ? "h-auto" : "h-0 overflow-hidden"
              }`}
            >
              {/* Ordered */}
              <div className=" flex items-center border-r border-borderRight p-4">
                <div>
                  <p className="text-dropdownText text-sm">Ordered</p>
                  <p className="font-semibold text-sm text-textColor">
                    {item?.itemQuantity} PCS
                  </p>
                </div>
              </div>
              
              {/* Status */}
              <div className=" items-center border-r border-borderRight p-4">
                <div>
                  <p className="text-dropdownText text-sm">Status</p>
                  <p className="font-bold text-sm text-textColor">0 Invoiced</p>
                </div>
              </div>

              {/* Rate */}
              <div className=" items-center border-r border-borderRight p-4">
                <div>
                  <p className="text-dropdownText text-sm">Rate</p>
                  <p className="font-bold text-sm text-textColor">
                    {organization?.baseCurrency} {item.itemCostPrice}
                  </p>
                </div>
              </div>

              {/* Discount */}
              <div className=" items-center border-r border-borderRight p-4">
                <div>
                  <p className="text-dropdownText text-sm">Discount</p>
                  <p className="font-bold text-sm text-textColor">
                    {item.discountType === "percentage"
                      ? (item.itemCostPrice * item.itemDiscount) / 100
                      : item.itemDiscount}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className=" items-center p-4">
                <div>
                  <p className="text-dropdownText text-sm">Amount</p>
                  <p className="font-bold text-sm text-textColor">
                    {organization?.baseCurrency} {item.itemAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No items available</p>
      )}
    </div>
    </div >
    ));
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-start mb-4">
        <p className="text-textColor border-r-[1px] border-borderRight pr-4 text-sm font-normal">
          Order Date:{" "}
          <span className="ms-3 text-dropdownText text-sm font-semibold">
            {page === "PurchaseOrder" ? data?.purchaseOrderDate : data?.billDate}
          </span>
        </p>
        <p className="text-textColor border-r-[1px] border-borderRight px-4 text-sm font-normal">
          Expected Shipment:{" "}
          <span className="ms-3 text-dropdownText text-sm font-semibold">
            {page === "PurchaseOrder" ? data?.expectedShipmentDate : data?.dueDate}
          </span>
        </p>
        {page !== "PurchaseOrder" && (
          <p className="text-textColor pl-4 text-sm font-normal">
            Payment Terms:{" "}
            <span className="ms-3 text-dropdownText text-sm font-semibold">
              {data?.paymentTerms}
            </span>
          </p>
        )}
      </div>
      {page === "PurchaseOrder" && <SendPurchaseOrder data={data} />}
      {renderItemTable()}
      <hr className="mt-6 border-t border-inputBorder" />
      <div className="flex justify-between gap-6 mt-4">
        <div className="p-6 rounded-lg border border-billingBorder w-[50%]">
          <p className="text-base font-bold text-textColor">Billing Address</p>
          <div className="text-base text-dropdownText mt-2 space-y-2">
            {supplier?.supplierDisplayName && <p>{supplier.supplierDisplayName}</p>}
            {supplier?.companyName && <p>{supplier.companyName}</p>}
            {(supplier?.billingAddressStreet1 || supplier?.billingAddressStreet2) && (
              <p>
                {supplier.billingAddressStreet1 || ""}{" "}
                {supplier.billingAddressStreet2 && ", "}
                {supplier.billingAddressStreet2 || ""}
              </p>
            )}
            {supplier?.billingCity && <p>{supplier.billingCity}</p>}
            {(supplier?.billingCountry || supplier?.billingPinCode) && (
              <p>
                {supplier.billingCountry || ""}{" "}
                {supplier.billingPinCode ? `- ${supplier.billingPinCode}` : ""}
              </p>
            )}
            {supplier?.billingPhone && <p>{supplier.billingPhone}</p>}
          </div>
        </div>
        <div className="p-6 rounded-lg border border-billingBorder w-[50%]">
          <p className="text-base font-bold text-textColor">Order Summary</p>
          <div className="mt-4">
            <div className="flex justify-between">
              <p>Untaxed Amount</p>
              <p>
                {organization?.baseCurrency}{" "}
                {(data?.grandTotal || 0) - (data?.totalTaxAmount || 0)}
              </p>
            </div>
            {data?.cgst > 0 && data?.sgst > 0 ? (
              <>
                <div className="flex justify-between mt-4">
                  <p>SGST</p>
                  <p>{organization?.baseCurrency} {data?.sgst}</p>
                </div>
                <div className="flex justify-between mt-4">
                  <p>CGST</p>
                  <p>{organization?.baseCurrency} {data?.cgst}</p>
                </div>
              </>
            ) : (
              <div className="flex justify-between mt-4">
                <p>IGST</p>
                <p>{organization?.baseCurrency} {data?.igst}</p>
              </div>
            )}
            <div className="flex justify-between mt-4">
              <p>Total</p>
              <p>{organization?.baseCurrency} {data?.grandTotal}</p>
            </div>
            <hr className="mt-4 border-t border-[#CCCCCC]" />
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" size="sm" className="px-4">
                Cancel
              </Button>
              <Button variant="secondary" size="sm" className="px-2">
                <PrinterIcon color="#565148" height={16} width={16} />
                Print
              </Button>
              <Button variant="primary" size="sm" className="px-3">
                Save & Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderView;

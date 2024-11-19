import { useEffect, useState } from "react";
import PrinterIcon from "../../../../assets/icons/PrinterIcon";
import Button from "../../../../Components/Button";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import SendPurchaseOrder from "../../purchaseOrder/viewPurchaseOrder/SendPurchaseOrder";

type Props = { data?: any ,page?:string, organization?:any};

function OrderView({ data ,page , organization}: Props) {
  const [supplier, setSupplier] = useState<[] | any>([]);
  const { request: getSupplier } = useApi("get", 5009);

  const getSupplierAddress = async () => {
    try {
      const url = `${endponits.GET_ONE_SUPPLIER}/${data.supplierId}`;
      const { response, error } = await getSupplier(url);
      if (!error && response) {
        setSupplier(response.data);
      } else {
        console.log("Error in fetching Supplier ,", error);
      }
    } catch (error) {
      console.log("Error in fetching Supplier ,", error);
    }
  };
  useEffect(() => {
    getSupplierAddress();
  }, [data]);

  return (
    <div className="mt-4">
     {page=="PurchaseOrder"? <div className="flex items-center justify-start mb-4">
        <p className="text-textColor border-r-[1px] border-borderRight pr-4 text-sm font-normal">
          Order Date:{" "}
          <span className="ms-3 text-dropdownText text-sm font-semibold">
            {data?.purchaseOrderDate}
          </span>
        </p>
        <p className="text-textColor pl-4 text-sm font-normal">
          Expected Shipment:{" "}
          <span className="ms-3 text-dropdownText text-sm font-semibold">
            {data?.expectedShipmentDate}
          </span>
        </p>
      </div> : <div className="flex items-center justify-start mb-4">
        <p className="text-textColor border-r-[1px] border-borderRight pr-4 text-sm font-normal">
          Order Date:{" "}
          <span className="ms-3 text-dropdownText text-sm font-semibold">
            {data?.billDate}
          </span>
        </p>
        <p className="text-textColor border-r-[1px] border-borderRight px-4  text-sm font-normal">
          Expected Shipment:{" "}
          <span className="ms-3 text-dropdownText text-sm font-semibold">
            {data?.dueDate}
          </span>
        </p>
        <p className="text-textColor pl-4 text-sm font-normal">
          Expected Shipment:{" "}
          <span className="ms-3 text-dropdownText text-sm font-semibold">
            {data?.paymentTerms}
          </span>
        </p>
      </div>}
     {page =="PurchaseOrder" && <SendPurchaseOrder/>}

     {
  (data?.itemTable || data?.items) ? (
    (data?.itemTable || data?.items).map((item: any) => (
      <div
        className="mt-6 p-4 rounded-lg flex items-center"
        style={{
          background:
            "linear-gradient(89.66deg, #E3E6D5 -0.9%, #F7E7CE 132.22%)",
        }}
        key={item.id} 
      >
        <div className="flex items-center border-r border-borderRight pr-4">
          <img src={item.image || ""} alt="Item" /> 
          <div>
            <p className="text-dropdownText text-sm">Item</p>
            <p className="font-semibold text-sm text-blk">{item.name}</p> 
          </div>
        </div>

        <div className="border-r flex items-center border-borderRight pr-[28px] h-[62px] pl-6">
          <div>
            <p className="text-dropdownText text-sm">Ordered</p>
            <p className="font-semibold text-sm text-textColor">
              {item?.itemQuantity} PCS
            </p>
          </div>
        </div>

        <div className="border-r flex items-center border-borderRight pr-[28px] h-[62px] pl-6">
          <div>
            <p className="text-dropdownText text-sm">Status</p>
            <p className="font-bold text-sm text-textColor">0 Invoiced</p>
          </div>
        </div>

        <div className="border-r flex items-center border-borderRight pr-[28px] h-[62px] pl-6">
          <div>
            <p className="text-dropdownText text-sm">Rate</p>
            <p className="font-bold text-sm text-textColor">
              {organization.baseCurrency} {item.itemCostPrice}
            </p>
          </div>
        </div>

        <div className="border-r flex items-center border-borderRight pr-[28px] h-[62px] pl-6">
          <div>
            <p className="text-dropdownText text-sm">Discount</p>
            <p className="font-bold text-sm text-textColor">
              {item.discountType === "percentage"
                ? (item.itemCostPrice * item.itemDiscount) / 100
                : item.itemDiscount}
            </p>
          </div>
        </div>

        <div className="flex items-center h-[62px] pl-6">
          <div>
            <p className="text-dropdownText text-sm">Amount</p>
            <p className="font-bold text-sm text-textColor">
              {organization.baseCurrency} {item.itemAmount}
            </p>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p>No items available</p> 
  )
}

      <hr className="mt-6 border-t border-inputBorder" />

      {/* billing address */}
      <div className="flex   justify-between gap-6 mt-4">
        <div className="p-6 rounded-lg border border-billingBorder w-[50%]">
          <p className="text-base font-bold text-textColor">Billing Address</p>
          <div className="text-base mb-[70px] text-dropdownText space-y-2 mt-2">
  {supplier?.supplierDisplayName && <p>{supplier.supplierDisplayName}</p>}
  {supplier?.companyName && <p>{supplier.companyName}</p>}
  {(supplier?.billingAddressStreet1 || supplier?.billingAddressStreet2) && (
    <p className="text-textColor">
      {supplier.billingAddressStreet1 && supplier.billingAddressStreet1}
      {supplier.billingAddressStreet1 && supplier.billingAddressStreet2 && ", "}
      {supplier.billingAddressStreet2 && supplier.billingAddressStreet2}
    </p>
  )}
  {supplier?.billingCity && <p className="mt-4">{supplier.billingCity}</p>}
  {(supplier?.billingCountry || supplier?.billingPinCode) && (
    <p>
      {supplier.billingCountry && supplier.billingCountry}{" "}
      {supplier.billingCountry && supplier.billingPinCode && "- "}
      {supplier.billingPinCode && supplier.billingPinCode}
    </p>
  )}
  {supplier?.billingPhone && (
    <p className="text-textColor">{supplier.billingPhone}</p>
  )}
</div>

        </div>
        <div className="p-6 rounded-lg border border-billingBorder w-[50%]">
          <p className="text-base font-bold text-textColor">Order Summary</p>
          <div className="mt-[18.5px]">
            <div className="flex justify-between items-center">
              <p>Untaxed Amount</p>
              <p>
              {organization.baseCurrency} {" "}
                {(data?.grandTotal || 0) -
                  (data?.totalTaxAmount || 0)}
              </p>
            </div>
            {data?.cgst>0 && data?.sgst>0 ? (
              <>
                <div className="mt-4 flex justify-between items-center">
                  <p>SGST</p>
                  <p>   {organization.baseCurrency}  {data?.sgst}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p>CGST</p>
                  <p>   {organization.baseCurrency}  {data?.cgst}</p>
                </div>
              </>
            ):  <div className="mt-4 flex justify-between items-center">
            <p>IGST</p>
            <p>   {organization.baseCurrency}  {data?.igst}</p>
          </div>}
           
            <div className="mt-4 flex justify-between items-center">
              <p>Total</p>
              <p>   {organization.baseCurrency}  {data?.grandTotal}</p>
            </div>
            <hr className="mt-4 border-t border-[#CCCCCC]" />
            <div className="flex justify-end gap-2 mt-6 mb-2">
              <Button variant="secondary" size="sm" className="pl-4 pr-4">
                <p className="text-sm font-medium">Cancel</p>
              </Button>
              <Button variant="secondary" className="pl-2 pr-2" size="sm">
                {" "}
                <PrinterIcon color="#565148" height={16} width={16} />{" "}
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

export default OrderView;

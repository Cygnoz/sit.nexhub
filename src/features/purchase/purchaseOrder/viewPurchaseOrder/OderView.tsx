import { useEffect, useState } from "react";
import PrinterIcon from "../../../../assets/icons/PrinterIcon";
import Button from "../../../../Components/Button";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";

type Props = { purchaseOrder?: any };

function OrderView({ purchaseOrder }: Props) {
  const [supplier, setSupplier] = useState<[] | any>([]);
  const { request: getSupplier } = useApi("get", 5009);

  const getSupplierAddress = async () => {
    try {
      const url = `${endponits.GET_ONE_SUPPLIER}/${purchaseOrder.supplierId}`;
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
  }, [purchaseOrder]);
  console.log(supplier);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-start mb-4">
        <p className="text-textColor border-r-[1px] border-borderRight pr-4 text-sm font-normal">
          Order Date:{" "}
          <span className="ms-3 text-dropdownText text-sm font-semibold">
            {purchaseOrder?.purchaseOrderDate}
          </span>
        </p>
        <p className="text-textColor pl-4 text-sm font-normal">
          Expected Shipment:{" "}
          <span className="ms-3 text-dropdownText text-sm font-semibold">
            {purchaseOrder.expectedShipmentDate}
          </span>
        </p>
      </div>
      {/* send purchase order */}
      <div className="mt-4 bg-cuscolumnbg p-4 rounded-lg flex justify-between items-center">
        <div>
          <p className="text-base font-bold text-textColor">
            Send Purchase Order
          </p>
          <p className="text-sm font-normal text-dropdownText w-[90%] mt-2">
            Purchase order has been created. You can email the Purchase Order to
            your customer or mark it as Confirmed.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" className="pl-4 pr-4" size="sm">
            <p className="text-sm font-medium">Mark as Confirmed</p>
          </Button>
          <Button className="pl-4 pr-4" size="sm">
            <p className="text-sm font-medium">Send Purchase Order</p>
          </Button>
        </div>
      </div>

      {/* item details */}
      {purchaseOrder?.itemTable?.map((item: any) => (
        <div
          className="mt-6 p-4 rounded-lg flex items-center"
          style={{
            background:
              "linear-gradient(89.66deg, #E3E6D5 -0.9%, #F7E7CE 132.22%)",
          }}
        >
          <div className="flex items-center border-r border-borderRight pr-4">
            <img src="" />
            <div>
              <p className="text-dropdownText text-sm">Item</p>
              <p className="font-semibold text-sm text-blk"></p>
            </div>
          </div>

          <div className="border-r flex items-center border-borderRight pr-[28px] h-[62px] pl-6">
            <div>
              <p className="text-dropdownText text-sm">Ordered</p>
              <p className="font-semibold text-sm text-textColor">
                {item.itemQuantity}PCS
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
                RS. {item.itemCostPrice}
              </p>
            </div>
          </div>
          <div className="border-r flex items-center border-borderRight pr-[28px] h-[62px] pl-6">
            <div>
              <p className="text-dropdownText text-sm">Discount</p>
              <p className="font-bold text-sm text-textColor">
                {item.itemDiscountType == "percentage"
                  ? item.itemCostPrice || (0 * item.itemDiscount) / 100
                  : item.itemDiscount || 0}
              </p>
            </div>
          </div>
          <div className=" flex items-center  h-[62px] pl-6">
            <div>
              <p className="text-dropdownText text-sm">Amount</p>
              <p className="font-bold text-sm text-textColor">
                Rs. {item.itemAmount}
              </p>
            </div>
          </div>
        </div>
      ))}
      <hr className="mt-6 border-t border-inputBorder" />

      {/* billing address */}
      <div className="flex items-center justify-between gap-6 mt-6">
        <div className="p-6 rounded-lg border border-billingBorder w-[50%]">
          <p className="text-base font-bold text-textColor">Billing Address</p>
          <div className="mt-4 text-base mb-[70px] text-dropdownText">
            <p>{supplier?.supplierDisplayName}</p>
            <p>{supplier?.companyName}</p>
            <p className="text-textColor">
              {supplier?.billingAddressStreet1},{" "}
              {supplier?.billingAddressStreet2}{" "}
            </p>
            <p className="mt-4">{supplier?.billingCity}</p>
            <p>
              {supplier?.billingCountry} - {supplier?.billingPinCode}
            </p>
            <p className="text-textColor">{supplier?.billingPhone}</p>
          </div>
        </div>
        <div className="p-6 rounded-lg border border-billingBorder w-[50%]">
          <p className="text-base font-bold text-textColor">Order Summary</p>
          <div className="mt-[18.5px]">
            <div className="flex justify-between items-center">
              <p>Untaxed Amount</p>
              <p>
                RS{" "}
                {(purchaseOrder?.grandTotal || 0) -
                  (purchaseOrder?.totalTaxAmount || 0)}
              </p>
            </div>
            {purchaseOrder.igst && purchaseOrder.sgst && (
              <>
                <div className="mt-4 flex justify-between items-center">
                  <p>SGST</p>
                  <p>RS {purchaseOrder.sgst}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p>CGST</p>
                  <p>RS {purchaseOrder.cgst}</p>
                </div>
              </>
            )}
            {
              <div className="mt-4 flex justify-between items-center">
                <p>IGST</p>
                <p>RS {purchaseOrder.igst}</p>
              </div>
            }
            <div className="mt-4 flex justify-between items-center">
              <p>Total</p>
              <p>RS {purchaseOrder.grandTotal}</p>
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

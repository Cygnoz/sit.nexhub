import { forwardRef, useEffect, useState } from "react";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";

type Props = { data?: any; page?: string; organization?: any };

const PDFView = forwardRef<HTMLDivElement, Props>(({ data, page, organization }, ref) => {
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
    <div className="mt-4 " ref={ref} id="pdf-view-container">
      <div className="flex items-center justify-center mb-4 hide-print">
        <p className="text-textColor border-r-[1px] border-borderRight pr-4 text-sm font-medium">
          {page === "PurchaseOrder" ? (
            <>
              Order Date:{" "}
              <span className="ms-3 text-dropdownText text-base font-bold">
                {data?.purchaseOrderDate}
              </span>
            </>
          ) : page === "Bills" ? (
            <>
              Bill Date:{" "}
              <span className="ms-3 text-dropdownText text-base font-bold">
                {data?.billDate}
              </span>
            </>
          ) : (
            <>
              Supplier Debit Date:{" "}
              <span className="ms-3 text-dropdownText text-base font-bold">
                {data?.supplierDebitDate}
              </span>
            </>
          )}
        </p>

        {page !== "DebitNote" && (
          <p className="text-textColor pl-4 text-sm font-medium">
            Expected Shipment:{" "}
            <span className="ms-3 text-dropdownText text-base font-bold">
              {data.expectedShipmentDate}
            </span>
          </p>
        )}
      </div>
      <div className="flex justify-center items-center">
        <div className="bg-white drop-shadow-2xl w-[330px] sm:w-[595px]  p-8 pl-[24px] pr-[24px]">
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
              <h2 className="text-xl font-bold text-textColor">
                {page == "PurchaseOrder" ? "PURCHASE ORDER" : page === "Bills" ? "BILL" : "DEBIT NOTE"}
              </h2>
              <p className="text-sm font-bold text-dropdownText mt-[5px]">
                {page === "PurchaseOrder"
                  ? `Purchase Order# ${data.purchaseOrder}`
                  : page == "Bills" ? `Bill# ${data.billNumber}` : `Debit Note# ${data.debitNote}`}
              </p>
              <h3 className="font-normal text-xs mt-[14px] text-pdftext">
                {supplier?.supplierDisplayName}
              </h3>
              {(supplier?.supplierEmail || supplier?.mobile) && (
                <p className="font-normal text-xs text-pdftext">
                  {supplier.supplierEmail && supplier.supplierEmail}
                  {supplier.supplierEmail && supplier.mobile && " | "}
                  {supplier.mobile && `+${supplier.mobile}`}
                </p>
              )}
            </div>
          </div>

          <div className="mb-8 mt-8 space-y-2 gap-4 flex items-center justify-between">
            <div>
              <h3 className="font-normal text-xs text-pdftext">Bill to</h3>
              <p className="text-pdftext text-sm font-bold ">
                {supplier?.supplierDisplayName}
              </p>
              {supplier?.supplierEmail || supplier?.mobile && (
                <p className="font-normal text-xs text-pdftext ">
                  {supplier.supplierEmail && supplier.supplierEmail}
                  {supplier.supplierEmail && supplier.mobile && " | "}
                  {supplier.mobile && supplier.mobile}
                </p>
              )}

              <p className="font-normal text-xs text-pdftext ">
                {supplier?.billingAddressStreet1}{supplier?.billingAddressStreet1 && <p>|</p>}
                {supplier?.billingAddressStreet2}{supplier?.billingAddressStreet2 && <p>, </p>}<br />
                {supplier.billingState} , {supplier.billingCountry} {supplier.billingPinCode}
              </p>
            </div>
            {page == "PurchaseOrder" ? (
              <div className="mt-2">
                <h3 className="font-normal text-xs text-pdftext">Bill to</h3>
                <p className="text-pdftext text-sm font-bold mt-2">
                  {supplier?.supplierDisplayName}
                </p>
                <p className="font-normal text-xs text-pdftext mt-2">
                  Order Date: {data.purchaseOrderDate}
                </p>
                <p className="font-normal text-xs text-pdftext mt-2">
                  Expected shipment Date: {data.purchaseOrderDate}
                </p>
              </div>
            ) : (
              <div className="mt-2 text-xs">
                {page !== "DebitNote" && <>
                  <p className="text-pdftext mt-2 flex">
                    <b>Bill Date</b>{" "}
                    <span className="text-end ml-auto">{data.billDate}</span>
                  </p>
                  <p className="text-pdftext mt-2 flex">
                    <b>Due Date</b>{" "}
                    <span className="text-end ml-auto">{data.dueDate}</span>
                  </p>
                  <p className="text-pdftext mt-2 flex">
                    <b className="me-5">Terms</b>
                    <span className="text-end ml-auto"> {data.paymentTerms}</span>
                  </p>
                </>}
              </div>
            )}
          </div>
          <div className="overflow-x-auto">

            <table className="w-full mb-7 border border-dropdownBorder">
              <thead className="border-b border-dropdownBorder ">
                <tr className="font-bold text-[10px] text-pdftext text-center">
                  <th className="py-2 px-4 text-left w-[350px]">Description</th>
                  <th className="py-2 px-4 pl-16 ">Qty</th>
                  <th className="py-2 px-4">Price</th>
                  <th className="py-2 px-4">GST</th>
                  <th className="py-2 px-4">Amount</th>
                </tr>
              </thead>
              {
                (data?.itemTable?.length > 0 || data?.items?.length > 0) ? (
                  (data?.itemTable || data?.items).map((item: any) => (
                    <tbody className="h-[56px]" key={item.id}>
                      <tr className="text-[10px] text-left">
                        <td className="py-2 px-4">{item.itemName}</td>
                        <td className="py-2 px-4 pl-16">{item.itemQuantity}</td>
                        <td className="py-2 px-4">{item.itemCostPrice}</td>
                        <td className="py-2 px-4">
                          {item.itemCgstAmount > 0 && item.itemSgstAmount > 0
                            ? item.itemCgstAmount + item.itemSgstAmount
                            : item.itemIgstAmount}
                        </td>
                        <td className="py-2 px-4">{item.itemAmount}</td>
                      </tr>
                    </tbody>
                  ))
                ) : (
                  <p>No items available</p>
                )
              }

            </table>
          </div>

          <div className="flex justify-end ">
            <div className="w-[58.4%] border border-dropdownBorder rounded bg-pdfbg">
              <div className="px-4 mt-4  bg-gray-100 rounded-lg flex justify-between">
                <h4 className="text-pdftext text-xs font-normal">
                  Sub total (excl. GST)
                </h4>
                <p className="text-pdftext text-xs font-normal">
                  {(Number(data.grandTotal) - Number(data.totalTaxAmount)).toFixed(2) || 0.00}
                </p>
              </div>
              <div className="px-4 mt-3 mb-5 bg-gray-100 rounded-lg flex justify-between">
                <h4 className="text-pdftext text-xs font-normal">Total</h4>
                <p className="text-pdftext text-xs font-normal">
                  {(data.grandTotal).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {page === "DebitNote" &&
            <div className="w-[58.4%] border mt-4 ml-auto border-dropdownBorder rounded bg-pdfbg">
              <div className="px-4 my-4  bg-gray-100 rounded-lg flex justify-between">
                <h4 className="text-pdftext text-xs font-normal">
                  Credit Remaining
                </h4>
                <p className="text-pdftext text-xs font-normal">
                  {data?.balanceAmount || 0.00}
                </p>
              </div>

            </div>
          }

          <div className="w-[50%] mt-[64px] gap-4 mb-[55.5px] flex justify-center items-center">
            <p className="text-pdftext text-xs font-normal">Signature</p>
            <div className="border-t  border-[0.5px] border-loremcolor w-full "></div>
          </div>
        </div>
      </div>
    </div>
  );
});
PDFView.displayName = "PDFView"
export default PDFView;

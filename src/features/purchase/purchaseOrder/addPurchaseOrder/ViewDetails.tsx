import {  useState } from "react";
import ScanEye from "../../../../assets/icons/ScanEye";
import CehvronDown from "../../../../assets/icons/CehvronDown";

type Props = {
  purchaseOrderState: any;
  setPurchaseOrderState: (value: any) => void;
  page?:string
  allAccounts?:any
};

const ViewDetails = ({ purchaseOrderState, setPurchaseOrderState ,page,allAccounts  } : Props) => {
  const [viewDetails, setViewDetails] = useState<boolean>(false);
  const handleChange = (event: any) => {
    const { name, value } = event.target;

    const numericFields = ['otherExpense', 'roundOff', 'freight',];
    const stringFields = ['vehicleNo', 'otherExpenseReason'];

    const numericValue = numericFields.includes(name) ? Number(value) : value;

    const newValue = stringFields.includes(name) ? value : numericValue;

    setPurchaseOrderState((prevState: any) => ({
      ...prevState,
      [name]: newValue,
    }));
  };




  return (
    <>
      {viewDetails ? (
        <>
          <button
            onClick={() => setViewDetails(false)}
            className="flex items-center text-textColor font-semibold text-sm"
          >
            <ScanEye /> View Less Details
          </button>
          <div className={`${page == "bill" ? "grid grid-cols-3 gap-4 my-4 text-textColor text-sm" : "grid grid-cols-2 gap-4 my-4 text-textColor text-sm"}`}>
          {page === "bill" && (
              <div>
                <label className="block text-sm mb-1 text-labelColor">
                  Other Expense Account ID
                </label>
                <div className="relative w-full">
                  <select
                    onChange={handleChange}
                    value={purchaseOrderState.otherExpenseAccountId}
                    name="otherExpenseAccountId"
                    className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-9 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  >
                    <option value="" selected hidden disabled>Select Account</option>
                    {allAccounts
                      .filter((item: { accountHead: string }) => item.accountHead === "Expenses")
                      .map((item: { _id: string; accountName: string }) => (
                        <option key={item._id} value={item._id}>
                          {item.accountName}
                        </option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
              </div>
            )}
            <div className="text-sm">
              <label htmlFor="otherExpense" className="">
                Other Expense Amount
                <input
                  type="number"
                  step="0.01"
                  value={purchaseOrderState.otherExpense || ''}
                  name="otherExpense"
                  onChange={handleChange}
                  placeholder="Enter expense amount"
                  className="border-inputBorder w-full text-sm border rounded p-2 h-9 mt-1 text-[#495160]"
                />

              </label>
            </div>
            <div className="text-sm">
              <label htmlFor="otherExpenseReason" className="">
                Other Expense Reason
                <input
                  value={purchaseOrderState.otherExpenseReason}
                  name="otherExpenseReason"
                  onChange={handleChange}
                  placeholder="Enter reason"
                  className="border-inputBorder w-full text-sm border rounded p-2 h-9 mt-1"
                />
              </label>
            </div>
            {page === "bill" && (
              <div>
                <label className="block text-sm mb-1 text-labelColor">
                  Freight Account
                </label>
                <div className="relative w-full">
                  <select
                    onChange={handleChange}
                    value={purchaseOrderState.freightAccountId}
                    name="freightAccountId"
                    className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  >
                    <option value="" selected hidden disabled>Select Account</option>
                    {allAccounts
                      .filter((item: { accountSubhead: string }) => item.accountSubhead === "Expense")
                      .map((item: { _id: string; accountName: string }) => (
                        <option key={item._id} value={item._id}>
                          {item.accountName}
                        </option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
              </div>
            )}
            <div className="text-sm">
              <label htmlFor="freight" className="">
                Freight Amount
                <input
                  type="number"
                  step="0.01"
                  value={purchaseOrderState.freight || ""}
                  name="freight"
                  onChange={handleChange}
                  placeholder="Enter freight amount"
                  className="border-inputBorder w-full text-sm border rounded p-2 h-9 mt-1"
                />
              </label>
            </div>
            <div className="text-sm">
              <label htmlFor="roundOff" className="">
                Round Off Amount
                <input
                  type="number"
                  step="0.01"
                  value={purchaseOrderState.roundOff || ""}
                  name="roundOff"
                  onChange={handleChange}
                  placeholder="Enter round-off amount"
                  className="border-inputBorder w-full text-sm border rounded p-2 h-9 mt-1"
                />
              </label>
            </div>
            <div className="text-sm">
              <label htmlFor="vehicleNo" className="">
                Vehicle Number
                <input
                  value={purchaseOrderState.vehicleNo}
                  name="vehicleNo"
                  onChange={handleChange}
                  placeholder="Enter vehicle number"
                  className="border-inputBorder w-full text-sm border rounded p-2 h-9 mt-1"
                />
              </label>
            </div>
          </div>
        </>
      ) : (
        <button
          onClick={() => setViewDetails(true)}
          className="flex items-center text-textColor font-semibold text-sm"
        >
          <ScanEye /> View More
        </button>
      )}
    </>
  );
};

export default ViewDetails;

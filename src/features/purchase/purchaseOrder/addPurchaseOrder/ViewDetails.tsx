import { useState } from "react";
import ScanEye from "../../../../assets/icons/ScanEye";

type Props = {
  purchaseOrderState: any;
  setPurchaseOrderState: (value: any) => void;
};

const ViewDetails = ({ purchaseOrderState, setPurchaseOrderState }: Props) => {
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
          <div className="grid grid-cols-2 gap-4 my-4 text-textColor text-sm">
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
                  className="border-inputBorder w-full text-sm border rounded p-2 h-9 mt-2"
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
                  className="border-inputBorder w-full text-sm border rounded p-2 h-9 mt-2"
                />
              </label>
            </div>
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
                  className="border-inputBorder w-full text-sm border rounded p-2 h-9 mt-2"
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
                  className="border-inputBorder w-full text-sm border rounded p-2 h-9 mt-2"
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
                  className="border-inputBorder w-full text-sm border rounded p-2 h-9 mt-2"
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

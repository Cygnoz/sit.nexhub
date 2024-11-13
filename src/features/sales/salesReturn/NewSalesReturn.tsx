import { Link } from "react-router-dom";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import Button from "../../../Components/Button";

type Props = {};

const NewSalesReturn = ({}: Props) => {
  return (
    <div className="px-8 text-[#303F58]">
      <div className="flex gap-5">
        <Link to={"/sales/salesreturn"}>
          <div className="flex justify-center items-center h-11 w-11 bg-[#FFFFFF] rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor ">New Sale Return</h4>
        </div>
      </div>
      <div className="bg-white  rounded-lg my-4 py-6">
        <div className="mx-8">
          <h1>Enter Sales Return Details</h1>
        </div>
        <div className="grid grid-cols-2 space-x-6 px-8 pt-5">
          <div>
            <label className="block text-sm mb-1 text-labelColor">RMA</label>
            <input
              readOnly
              value=""
              type="text"
              className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
            />
          </div>
          <div className="">
            <label className="block text-sm mb-1 text-labelColor">
              Sales Order Date
            </label>
            <div className="relative w-full">
              <input
                name="salesQuoteDate"
                value=""
                type="date"
                className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 px-2"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 space-x-6 p-8">
          <div>
            <label className="block text-sm mb-1 text-labelColor">
              Warehouse Name
            </label>
            <input
              readOnly
              value=""
              type="text"
              className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-labelColor">Reason</label>
            <input
              readOnly
              value=""
              type="text"
              className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
            />
          </div>
        </div>
        <div className="mx-8">
          <h3 className="text-lg font-bold">Item To Be Returned</h3>
        </div>
        <div className="rounded-lg border-2 border-tableBorder mt-3 mx-8 ">
          <table className="text-xs min-w-full bg-white rounded-lg pb-4 border-dropdownText text-textColor">
            <thead className="text-[12px] text-center text-dropdownText">
              <tr className="bg-[#FDF8F0]">
                <th className="py-3 px-4 font-medium border-b border-tableBorder">
                  Product
                </th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder">
                  Return Quantity
                </th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder">
                  Returned
                </th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder">
                  Shipped/Fullfilled
                </th>
              </tr>
            </thead>
            <tbody className="text-dropdownText text-center text-[13px]">
              {/* Sample row for design preview */}
              <tr className="relative">
                <td className="py-2.5 px-4 border-y border-tableBorder">hh</td>
                <td className="py-2.5 px-4 border-y border-tableBorder">hh</td>
                <td className="py-2.5 px-4 border-y border-tableBorder">hh</td>
                <td className="py-2.5 px-4 border-y border-tableBorder">ll</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-2 mb-3 me-8 mt-5">
          <Button
            variant="secondary"
            size="sm"
            className="py-2 text-sm h-10  w-24 flex justify-center"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            className=" w-24 text-sm h-10 flex justify-center "
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewSalesReturn;

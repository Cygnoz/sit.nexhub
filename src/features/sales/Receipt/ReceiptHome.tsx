import { useState } from "react";
import Button from "../../../Components/Button";
import PlusCircle from "../../../assets/icons/PlusCircle";
import Ellipsis from "../../../assets/icons/Ellipsis";
import BookIcon from "../../../assets/icons/BookIcon";
import SearchBar from "../../../Components/SearchBar";
import ListFilter from "../../../assets/icons/ListFilter";
import PrinterIcon from "../../../assets/icons/PrinterIcon";
import { Link } from "react-router-dom";

type Props = {};

const ReceiptHome = ({}: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");

  const head = [
    "Date",
    "Payment#",
    "Customer Name",
    "Invoice#",
    "Mode",
    "Amount",
    "Unsend Amount",
  ];

  const data = [
    {
      date: "16/07/2024",
      payment: "CR-0001",
      customer: "John Doe",
      invoice: "INV-0001",
      mode: "Cash",
      amount: "100.00",
      unsent: "0.00",
    },
    {
      date: "16/07/2024",
      payment: "CR-0002",
      customer: "John Doe",
      invoice: "INV-0002",
      mode: "Cash",
      amount: "100.00",
      unsent: "0.00",
    },
    {
      date: "16/07/2024",
      payment: "CR-0003",
      customer: "John Doe",
      invoice: "INV-0003",
      mode: "Cash",
      amount: "100.00",
      unsent: "0.00",
    },
  ];

  return (
    <div className="mx-5 my-4">
      <div className="flex">
        <div>
          <h1>Receipt</h1>
          <p className="text-textColor text-sm">
            Showing the payment details. Verifies transaction details for record
            keeping puposes.
          </p>
        </div>
        <div className="ml-auto flex items-center justify-center gap-4">
  <Link to="/sales/receipt/new">
    <Button variant="primary" size="sm">
      <PlusCircle color={"white"} />
      New Receipt
    </Button>
  </Link>
  <Ellipsis />
</div>

      </div>

      <div className="bg-white rounded-lg p-4 space-y-4 mt-6">
        <div className="flex gap-4">
          <div className="flex items-center justify-center bg-[#E3E6D5] text-sm  rounded-[4px] h-9 w-48 ">
            <BookIcon color={"#585953"} />
            All
          </div>
          <div className="flex-shrink-0 py-1 gap-3 text-darkRed text-sm font-semibold border border-slate-300 rounded-[4px] w-48 flex items-center justify-center">
            <PlusCircle color="darkRed" />
            New Custom View
          </div>
        </div>

        <div className="flex w-full gap-4">
          <div className="w-full">
            <SearchBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              placeholder="Search Payments"
            />
          </div>

          <Button variant="secondary" size="sm" className="min-w-fit">
            <ListFilter color={"currentColor"} />
            Sort By
          </Button>
          <Button variant="secondary" size="sm" className="min-w-fit">
            <PrinterIcon color="currentColor" height={20} width={20} />
            Print
          </Button>
        </div>

        {/* table */}

        <table className="min-w-full mb-5">
          <thead className="text-base text-center text-textColor font-normal">
            <tr className="bg-[#FDF8F0]">
              <th className="py-3 px-4 border-b border-tableBorder">
                <input type="checkbox" className="form-checkbox w-4 h-4" />
              </th>
              {head.map((item, index) => (
                <th
                  className="border-b border-tableBorder text-sm font-medium"
                  key={index}
                >
                  {item}
                </th>
              ))}
              <th className="py-3 px-4 font-medium border-b border-tableBorder">
                <ListFilter color={"currentColor"} />
              </th>
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {data.map((item, index) => (
              <tr key={index} className="relative cursor-pointer">
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input type="checkbox" className="form-checkbox w-4 h-4" />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.date}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <Link to={"/sales/receipt/view"}> {item.payment}</Link>
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.customer}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.invoice}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.mode}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.amount}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.unsent}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiptHome;

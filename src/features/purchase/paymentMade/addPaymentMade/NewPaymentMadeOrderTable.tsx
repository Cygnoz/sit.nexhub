import { useEffect, useRef, useState } from "react";
import { PaymentMadeUnpaidBillTable } from "../../../../assets/constants";
import PlusCircle from "../../../../assets/icons/PlusCircle";

type Props = {};

const NewPaymentMadeOrderTable = ({}: Props) => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [rows, setRows] = useState<number[]>([0]); 
  // Remove unused state
  // const [openDropdownType, setOpenDropdownType] = useState<string | null>(null);
  // const [searchValue, setSearchValue] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // const toggleDropdown = (id: number | null, type: string | null) => {
  //   if (openDropdownId === id && openDropdownType === type) {
  //     setOpenDropdownId(null);
  //     setOpenDropdownType(null);
  //   } else {
  //     setOpenDropdownId(id);
  //     setOpenDropdownType(type);
  //   }
  // };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenDropdownId(null);
      // setOpenDropdownType(null); // No longer needed
    }
  };
  const addNewItemRow = () => {
    setRows([...rows, rows.length]);
  };

  useEffect(() => {
    if (openDropdownId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  const data = [
    {
      id: 1,
      date: "28/06/2024",
      dueDate: "28/06/2024",
      billId: "BL-0003",
      billAmount: "0.00",
      amountDue: "0.00",
      payment: 30.0,
    },
  ];

  return (
    <div>
      <div className="rounded-lg border-2 border-tableBorder mt-3">
        <table className="min-w-full bg-white rounded-lg relative pb-4 border-dropdownText">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr className="bg-[#FDF8F0]">
              {PaymentMadeUnpaidBillTable.map((item, index) => (
                <th
                  className="py-3 px-4 font-medium border-b border-tableBorder relative"
                  key={index}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {data.map((item) => (
              <tr key={item.date} className="relative">
                <td className="flex items-center justify-center mt-0 gap-2">
                  <br />
                  {item.date} <br />
                </td>
                <td className="justify-start items-start">
                  <div className="items-center justify-center flex">
                    <div className="text-start">
                      <br />
                      {item.dueDate} <br />
                      <span className="" style={{ fontSize: "10px" }}>
                        <br />
                      </span>
                    </div>
                  </div>
                </td>
                <td>{item.billId}</td>
                <td className="py-2.5 px-4 border-y border-tableBorder relative">
                  <div className="flex items-center justify-center gap-2">
                    {item.billAmount}
                  </div>
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder relative">
                  <div className="flex items-center justify-center gap-2">
                    {item.amountDue}
                  </div>
                </td>
                <td className="font-semibold">{item.payment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-right text-textColor text-sm mt-4">Total <span className="ms-20 font-semibold">0.00</span></p>
      <button onClick={addNewItemRow} className="mt-1">
              <p className="text-darkRed my-3 text-sm flex gap-2 items-center">
                <PlusCircle color="darkRed" />
                <b> Add Item</b>
              </p>
        </button>
    </div>
    
  );
};

export default NewPaymentMadeOrderTable;

import { useState } from "react";
import BookopenCheck from "../../../../assets/icons/BookopenCheck";
import Booktext from "../../../../assets/icons/Booktext";
import BookX from "../../../../assets/icons/BookX";
import newspapper from "../../../../assets/icons/newspaper";
import PlusCircle from "../../../../assets/icons/PlusCircle";
import SearchBar from "../../../../Components/SearchBar";
import Button from "../../../../Components/Button";
import ListFilter from "../../../../assets/icons/ListFilter";
type Props = {};

function Transaction({}: Props) {
  const [selectedTab, setSelectedTab] = useState<string>("Purchase Order");
  const [searchValue, setSearchValue] = useState<string>("");

  const filterList = [
    { title: "Purchase Order", icon: Booktext },
    { title: "Expense", icon: BookopenCheck },
    { title: "Purchase Received", icon: BookX },
    { title: "Bills", icon: newspapper },
    { title: "Bill Payment", icon: newspapper },
    { title: "Vendor Credits", icon: newspapper },
  ];

  const tableHead = [
    "Order Number",
    "Order Date",
    "Purchase Order#",
    "Vendor Name",
    "Status",
    "Amount",
  ];

  const data = [
    {
      orderNo: "P00001",
      orderDate: "2022-01-01",
      purchaseOrder: "PO-0001",
      vendorName: "Vendor 1",
      status: "Purchase Order",
      amount: "0.00",
    },
    {
      orderNo: "P00002",
      orderDate: "2022-01-02",
      purchaseOrder: "PO-0002",
      vendorName: "Vendor 2",
      status: "Purchase Order",
      amount: "0.00",
      },

  ];
  return (
    <div className="">
      <h1 className="text-md text-xl">Transaction</h1>
      <div className=" gap-3 mt-4 text-xs  grid-flow-col grid">
        {filterList.map((item) => (
          <button
            key={item.title}
            onClick={() => setSelectedTab(item.title)}
            className={` flex border-2 rounded-md justify-center h-9 w-48 items-center gap-2
                  ${
                    selectedTab === item.title
                      ? "bg-[#E3E6D5] text-[#585953] border-[#E3E6D5]"
                      : "border-zinc-300 bg-transparent text-textColor"
                  }`}
          >
            {item.icon && (
              <item.icon
                color={selectedTab === item.title ? "#585953" : "#4B5C79"}
                height={15}
                width={15}
              />
            )}
            <span
              className={`font-semibold ${
                selectedTab === item.title ? "#4B5C79" : "text-[#4B5C79]"
              }`}
            >
              {item.title}
            </span>
          </button>
        ))}
       
      </div>

      <div className="flex w-full gap-4 py-4">
        <div className="w-full">
          <SearchBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            placeholder="Search Payments"
          />
        </div>

        <Button variant="secondary" size="sm" className="min-w-fit text-sm">
          <ListFilter classname="h-5" color={"currentColor"} />
          All
        </Button>
        <Button variant="secondary" size="sm" className="min-w-fit text-sm">
          <PlusCircle color={"currentColor"} />
          Add new
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              <th className="py-3 px-4 border-b border-tableBorder">
                <input type="checkbox" className="form-checkbox w-4 h-4" />
              </th>
              {tableHead.map((item) => (
                <th className="py-2 px-4 font-medium border-b border-tableBorder">
                  {item}
                </th>
              ))}
              <th className="py-3 px-4 font-medium border-b border-tableBorder">
                <ListFilter classname="h-5" color={"CurrentColor"} />
              </th>
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {data.map((item) => (
              <tr className="relative cursor-pointer">
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input type="checkbox" className="form-checkbox w-4 h-4" />
                </td>
              <td  className="py-2.5 px-4 border-y border-tableBorder">
                {item.orderNo}

              </td>
              <td  className="py-2.5 px-4 border-y border-tableBorder">
                {item.orderDate}
                
              </td>
              <td  className="py-2.5 px-4 border-y border-tableBorder">
                {item.purchaseOrder}
                
              </td>
              <td  className="py-2.5 px-4 border-y border-tableBorder">
                {item.vendorName}
                
              </td>
              <td  className="py-2.5 px-4 border-y border-tableBorder flex  justify-center">
               <div className="bg-[#E3E6D5] flex items-center justify-center gap-2 rounded-xl py-1 px-2 w-fit text-xs font-semibold"> <div className="h-1.5 w-1.5 bg-slate-800 rounded-full"></div> {item.status}</div>
                
              </td>
              <td  className="py-2.5 px-4 border-y border-tableBorder">
                {item.amount}
                
              </td>
              <td  className="py-2.5 px-4 border-y border-tableBorder">
                
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transaction;

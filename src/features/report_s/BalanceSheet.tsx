import { Link } from "react-router-dom";
import CheveronLeftIcon from "../../assets/icons/CheveronLeftIcon";
import SearchBar from "../../Components/SearchBar";
import { useState } from "react";

type Props = {};

const BalanceSheet = ({}: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <div className="p-5">
      <div className="flex gap-5">
        <Link to={"/purchase/debitNote"}>
          <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor ">Balance sheet </h4>
        </div>
      </div>
      <div
        className="bg-white rounded-lg my-4 p-3
      "
      >
        <div className="flex gap-3 ">
          {" "}
          <SearchBar
            onSearchChange={setSearchValue}
            searchValue={searchValue}
            placeholder="Search"
          />
          <div className="text-end">
            <p className="text-textColor font-bold whitespace-nowrap  ">
              Company Name
            </p>
            <p className="text-sm text-textColor whitespace-nowrap">
              01/01/2025 To 31/01/2025
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 my-2 text-sm text-[#585953]">
          <div>
            <div className="flex items-center justify-center rounded-md text-sm py-2 text-[#585953] bg-gradient-to-r from-[#E3E6D5] via-[#E3E6D5] to-[#F7E7CE]">
              Liabilities
            </div>
            <div className="space-y-3 my-2 text-xs">
              <div className="border-b pb-3 border-slate-300">
                <p className="text-[#585953] font-bold">Current Liabilities</p>
              </div>{" "}
              <div className="flex border-b pb-3 border-slate-300">
                <p className="text-[#585953] font-bold">Account Pyables</p>
                <div className="ml-auto">140000000 </div>
              </div>
              <div className="flex border-b pb-3 border-slate-300"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-center rounded-md text-sm py-2 text-[#585953] bg-gradient-to-r from-[#E3E6D5] via-[#E3E6D5] to-[#F7E7CE]">
              Assets
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;

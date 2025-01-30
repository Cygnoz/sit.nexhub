import Table from "./Table";
import { useState, useRef, useEffect } from "react";
import PrinterIcon from "@heroicons/react/20/solid/PrinterIcon";
import CehvronDown from "../../../assets/icons/CehvronDown";
import Calender from "../../../assets/icons/Calender";
import SearchBar from "../../../Components/SearchBar";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import { Link } from "react-router-dom";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";

type Props = {};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB").split("/").join("-");
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function DayBook({}: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());

  const fromDateRef = useRef<HTMLInputElement>(null);
  const toDateRef = useRef<HTMLInputElement>(null);

  const handleFromDateClick = () => {
    fromDateRef.current?.showPicker();
  };

  const handleToDateClick = () => {
    toDateRef.current?.showPicker();
  };

  const { request: getDayBookUrl } = useApi("get", 5006);

  const getDayBook = async () => {
    try {
      const formattedFromDate = formatDate(fromDate);
      const formattedToDate = formatDate(toDate);
      const url = `${endponits.GET_DAYBOOK}/${formattedFromDate}/${formattedToDate}`;

      const apiResponse = await getDayBookUrl(url);
      const { response, error } = apiResponse;

      if (!error && response) {
        console.log(response.data, "response");
      } else {
        console.log(error);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    getDayBook();
  }, [fromDate, toDate]);

  return (
    <>
      <div className="flex items-center mx-5 my-4">
        <div className="flex justify-center items-center">
          <Link to={"/reports"}>
            <div className="flex justify-center items-center h-11 w-11 bg-[#F3F3F3] rounded-full">
              <CheveronLeftIcon />
            </div>
          </Link>
          <h3 className="font-bold text-2xl ms-4 text-textColor">Day Book</h3>
        </div>
        <div className="ml-auto gap-3 flex items-center">
          <div className="flex text-dropdownText gap-4">
            <div
              className="relative border-2 border-slate-200 flex rounded-md px-2 py-1 text-sm items-center cursor-pointer"
              onClick={handleFromDateClick}
            >
              <div className="pointer-events-none inset-y-0 flex items-center px-2 text-gray-700">
                <Calender color="currentColor" height={18} width={18} />
              </div>
              {formatDate(fromDate)}
              <div className="pointer-events-none inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
              <input
                type="date"
                ref={fromDateRef}
                className="absolute inset-0 opacity-0 cursor-pointer"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div
              className="relative border-2 border-slate-200 flex rounded-md px-2 py-1 text-sm items-center cursor-pointer"
              onClick={handleToDateClick}
            >
              <div className="pointer-events-none inset-y-0 flex items-center px-2 text-gray-700">
                <Calender color="currentColor" height={18} width={18} />
              </div>
              {formatDate(toDate)}
              <div className="pointer-events-none inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <CehvronDown color="gray" />
              </div>
              <input
                type="date"
                ref={toDateRef}
                className="absolute inset-1 opacity-0 cursor-pointer"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="ml-auto flex items-center">
              <button className="flex border px-2 py-1 border-gray-300 rounded-lg bg-secondary_active">
                <PrinterIcon color="gray" height={18} width={20} />
                <span className="text-sm text-neutral-500">Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-5 my-4 bg-slate-50 h-[100vh]">
        <div className="mt-5 bg-white p-5 rounded-xl">
          <SearchBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            placeholder="Search Currency"
          />
          <Table />
        </div>
      </div>
    </>
  );
}

export default DayBook;

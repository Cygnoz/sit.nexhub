import { useState, useRef, useEffect } from "react";
import CehvronDown from "../../../assets/icons/CehvronDown";
import Calender from "../../../assets/icons/Calender";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import { Link } from "react-router-dom";
import { endponits } from "../../../Services/apiEndpoints";
import useApi from "../../../Hooks/useApi";
import Button from "../../../Components/Button";
import CheveronDownIcon from "../../../assets/icons/CheveronDownIcon";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DayBookTable from "./DayBookTable";

type Props = {};


function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB").split("/").join("-");
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function DayBook({ }: Props) {
  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());
  const [dayBookData, setDayBookData] = useState<any>([]);
  const [total, setTotal] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fromDateRef = useRef<HTMLInputElement>(null);
  const toDateRef = useRef<HTMLInputElement>(null);

  const handleFromDateClick = () => fromDateRef.current?.showPicker();
  const handleToDateClick = () => toDateRef.current?.showPicker();

  const { request: getDayBookUrl } = useApi("get", 5006);

  const getDayBook = async () => {
    try {
      setLoading(true);
      const formattedFromDate = formatDate(fromDate);
      const formattedToDate = formatDate(toDate);
      const url = `${endponits.GET_DAYBOOK}/${formattedFromDate}/${formattedToDate}`;

      const apiResponse = await getDayBookUrl(url);
      const { response, error } = apiResponse;

      if (!error && response) {
        setDayBookData(response.data.data);
        setTotal(response.data.totals);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRun = () => {
    getDayBook()
  }

  useEffect(() => {
    getDayBook();
  }, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const exportToExcel = () => {
    if (!dayBookData.length) {
      toast.error("No data to export");
      setIsDropdownOpen(false);
      return;
    }

    const dataForExport: any[] = [];
    const merges: any[] = [];
    let rowIndex = 1;

    // ✅ Process the table data
    dayBookData.forEach((entry: any) => {
      entry.entries.forEach((r: any, index: number) => {
        dataForExport.push([
          index === 0 ? entry.date : "",
          index === 0 ? entry.transactionId : "",
          r.accountName,
          r.action,
          r.debitAmount,
          r.creditAmount,
        ]);

        // ✅ Merge Date & Transaction ID for rowspan effect
        if (index === 0 && entry.entries.length > 1) {
          merges.push(
            { s: { r: rowIndex, c: 0 }, e: { r: rowIndex + entry.entries.length - 1, c: 0 } },
            { s: { r: rowIndex, c: 1 }, e: { r: rowIndex + entry.entries.length - 1, c: 1 } }
          );
        }
        rowIndex++;
      });
    });

    dataForExport.push(["Total", "", "", "", total.totalCredit, total.totalDebit]);

    merges.push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 3 } }); // Merge first 4 columns

    const ws = XLSX.utils.aoa_to_sheet([["Date", "Transaction ID", "Particulars", "Voucher Type", "Debit Balance", "Credit Balance"], ...dataForExport]);

    ws["!merges"] = merges;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DayBook");

    XLSX.writeFile(wb, `DayBook_${fromDate}_to_${toDate}.xlsx`);
    setIsDropdownOpen(false);
  };

  const exportToPDF = () => {
    if (!dayBookData.length) {
      toast.error("No data to export");
      setIsDropdownOpen(false);
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Day Book Report", 14, 15);

    const tableColumn = [
      "Date",
      "Transaction ID",
      "Particulars",
      "Voucher Type",
      "Debit Balance",
      "Credit Balance",
    ];

    const tableRows: any[] = [];

    // Add data rows
    dayBookData.forEach((entry: any) => {
      entry.entries.forEach((r: any, index: number) => {
        tableRows.push([
          index === 0 ? entry.date : "", // Simulate row-span behavior
          index === 0 ? entry.transactionId : "", // Simulate row-span behavior
          r.accountName,
          r.action,
          r.debitAmount,
          r.creditAmount,
        ]);
      });
    });

    // Add totals row
    if (dayBookData.length > 1) {
      tableRows.push([
        { content: "Total :", colSpan: 4, styles: { fontStyle: "bold", halign: "center" } },
        total.totalCredit,
        total.totalDebit,
      ]);
    }

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 10,
      styles: {
        fontSize: 7,
        cellPadding: 6,
        font: "helvetica",
        textColor: "#495160",
      },
      headStyles: {
        fillColor: "#FDF8F0", // Background color for headers
        textColor: "#495160", // Text color for headers
        fontStyle: "bold", // Bold headers
        halign: "center", // Center-align headers
      },
      bodyStyles: {
        halign: "center", // Center-align body content
      },
      alternateRowStyles: {
        fillColor: "#F9FAFB", // Alternate row color
      },
      theme: "grid", // Add grid lines
    });

    doc.save(`DayBook_${fromDate}_to_${toDate}.pdf`);
    setIsDropdownOpen(false)
  };

  const dropdownItems = [
    {
      text: "PDF",
      onClick: exportToPDF,
    },
    {
      text: "XLSX",
      onClick: exportToExcel,
    },
    {
      text: "Print",
      onClick: () => console.log("Print clicked"),
    },
  ];

  return (
    <>
      <div className="flex items-center mx-5 my-4">
        <div className="flex justify-center items-center">
          <Link to={"/reports"}>
            <div className="flex justify-center items-center h-11 w-11 bg-[white] rounded-full">
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
            <div>
              <Button className="text-xs pl-5 pr-5" size="sm" onClick={handleRun}>Run</Button>
            </div>

            <div className="relative ml-auto flex items-center">
              <Button className="text-xs pl-5 pr-5" size="sm" onClick={toggleDropdown}>
                Export <CheveronDownIcon color="white" strokeWidth={2.5} />
              </Button>
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl z-10  rounded-lg"
                >
                  <ul className="py-1 text-dropdownText">
                    {dropdownItems.map((item, index) => (
                      <li
                        key={index}
                        onClick={item.onClick}
                        className="px-4 py-2 flex items-center gap-2 hover:bg-orange-100 rounded-sm text-sm cursor-pointer"
                      >
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      <div className="mx-5 my-4 bg-slate-50 h-[100vh]">
        <div className="mt-5 bg-white p-5 rounded-xl">
          <DayBookTable total={total} dayBookData={dayBookData} loading={loading} />
        </div>
      </div>
    </>
  );
}

export default DayBook;

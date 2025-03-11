import React, { useEffect, useState, useRef } from "react";
import CehvronDown from "../../assets/icons/CehvronDown";

interface MonthYearDropdownProps {
  setMonth: (month: string) => void;
  month: string;
  setYear: (year: number) => void;
  year: number;
}

const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const MonthYearDropdown: React.FC<MonthYearDropdownProps> = ({ setMonth, month, setYear, year }) => {
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false);
      }
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMonthChange = (selectedMonth: number) => {
    const formattedMonth = (selectedMonth + 1).toString().padStart(2, "0");
    setMonth(formattedMonth);
    setIsMonthOpen(false);
  };

  const handleYearChange = (selectedYear: number) => {
    setYear(selectedYear);
    setIsYearOpen(false);
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-based index

  const availableMonths = year === currentYear ? months.slice(0, currentMonth) : months;

  return (
    <div className="flex space-x-4">
      {/* Month Dropdown */}
      <div className="relative" ref={monthDropdownRef}>
        <button
          className="flex items-center px-4 py-2 border rounded-xl bg-[#FEFDFA] w-40"
          onClick={() => setIsMonthOpen((prev) => !prev)}
        >
          {months[parseInt(month) - 1]}
          <div className="ms-auto">
            <CehvronDown color="#818894"/>
          </div>
        </button>
        {isMonthOpen && (
          <div className="absolute mt-2 bg-white border rounded-md shadow-lg max-h-72 overflow-y-auto z-10 w-40">
            {availableMonths.map((m, index) => (
              <div
                key={index}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                  month === (index + 1).toString().padStart(2, "0") ? "bg-gray-100 font-bold" : ""
                }`}
                onClick={() => handleMonthChange(index)}
              >
                {m}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Year Dropdown */}
      <div className="relative" ref={yearDropdownRef}>
        <button
          className="flex items-center px-4 py-2 border rounded-xl bg-[#FEFDFA] w-40"
          onClick={() => setIsYearOpen((prev) => !prev)}
        >
          {year}
          <div className="ms-auto">
            <CehvronDown color="#818894"/>
          </div>
        </button>
        {isYearOpen && (
          <div className="absolute mt-2 bg-white border rounded-md shadow-lg max-h-72 overflow-y-auto z-10 w-40">
            {Array.from({ length: 10 }, (_, i) => currentYear - i).map((y) => (
              <div
                key={y}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${year === y ? "bg-gray-100 font-bold" : ""}`}
                onClick={() => handleYearChange(y)}
              >
                {y}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthYearDropdown;
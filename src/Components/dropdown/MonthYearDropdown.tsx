import React, { useState } from "react";

interface MonthYearDropdownProps {
  onDateChange: (month: number, year: number) => void;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthYearDropdown: React.FC<MonthYearDropdownProps> = ({ onDateChange }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const month = Number(event.target.value);
    setSelectedMonth(month);
    onDateChange(month, selectedYear);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = Number(event.target.value);
    setSelectedYear(year);
    onDateChange(selectedMonth, year);
  };

  return (
    <div className="flex gap-3">
      <select
        value={selectedMonth}
        onChange={handleMonthChange}
        className="mr-2 p-2 border rounded"
      >
        {months.map((month, index) => (
          <option key={index} value={index}>
            {month}
          </option>
        ))}
      </select>
      <select
        value={selectedYear}
        onChange={handleYearChange}
        className="p-2 border rounded"
      >
        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(
          year => (
            <option key={year} value={year}>
              {year}
            </option>
          )
        )}
      </select>
    </div>
  );
};

export default MonthYearDropdown;

import React, { useState } from "react";
import SearchDropdown from "../../features/accountant/manualJournel/newJournal/SearchDropdown";
import CehvronDown from "../../assets/icons/CehvronDown";

interface DropdownProps<T> {
  value: T | null; // Currently selected value
  options: T[]; // List of options
  onSelect: (selectedOption: T) => void; // Callback when an option is selected
  getDisplayValue: (option: T | null) => string; // Function to determine display value
  getFilterValue: (option: T) => string; // Function to determine filter value
  placeholder?: string; // Placeholder for the input
}

const Dropdown = <T,>({
  value,
  options,
  onSelect,
  getDisplayValue,
  getFilterValue,
  placeholder = "Select an option",
}: DropdownProps<T>) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredOptions = options.filter((option) =>
    getFilterValue(option).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <div
        className="flex items-center border rounded-md border-inputBorder"
        onClick={handleDropdownToggle}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={getDisplayValue(value) || ""}
          readOnly
          className="rounded-md cursor-pointer text-sm p-2 w-full focus:outline-none"
        />
        <div className="-ms-8">
          <CehvronDown color="#818894" />
        </div>
      </div>
      {isDropdownOpen && (
        <div className="absolute z-10 p-2 w-full bg-white border border-tableBorder rounded-lg mt-1">
          <SearchDropdown
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
          />
          <ul className="overflow-y-auto text-start max-h-48">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => {
                  onSelect(option);
                  setIsDropdownOpen(false);
                }}
                className="p-2 cursor-pointer border text-sm border-dropdownBorder text-textColor font-semibold mt-2 rounded-lg bg-CreamBg"
              >
                {getDisplayValue(option)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

import React, { useState, useEffect, useRef } from "react";
import SearchDropdown from "../../features/accountant/manualJournel/newJournal/SearchDropdown";
import CehvronDown from "../../assets/icons/CehvronDown";

interface DropdownProps<T> {
  value: T | null; // Currently selected value
  options: T[]; // List of options
  onSelect: (selectedOption: T) => void; // Callback when an option is selected
  getDisplayValue: (option: T | null) => string; // Function to determine display value
  getFilterValue: (option: T) => string; // Function to determine filter value
  placeholder?: string; // Placeholder for the input
  disabled?: boolean; // Whether the dropdown is disabled
}

const Dropdown = <T,>({
  value,
  options,
  onSelect,
  getDisplayValue,
  getFilterValue,
  placeholder,
  disabled = false,
}: DropdownProps<T>) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown visibility
  const handleDropdownToggle = () => {
    if (!disabled) {
      setIsDropdownOpen((prev) => !prev);
    }
  };

  // Handle input changes for search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Filter options based on search input
  const filteredOptions = options?.filter((option) =>
    getFilterValue(option).toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`relative cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      ref={dropdownRef}
    >
      <div
        className={`flex items-center border rounded-md border-inputBorder ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={handleDropdownToggle}
      >
        <input
  type="text"
  placeholder={placeholder}
  value={
    value
      ? getDisplayValue(value)
      : placeholder
      ? placeholder
      : options.length > 0
      ? getDisplayValue(options[0])
      : ""
  }
  readOnly
  className="rounded-md text-sm p-2 w-full focus:outline-none cursor-pointer"
/>
        <div className="-ms-8">
          <CehvronDown color="#818894" />
        </div>
      </div>
      {isDropdownOpen && !disabled && (
        <div className="absolute z-10 p-2 w-full bg-white border border-tableBorder rounded-lg mt-1">
          <SearchDropdown
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
          />
          <ul className="overflow-y-auto text-start max-h-48">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
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
              ))
            ) : (
              <li className="p-2 text-sm text-gray-500">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

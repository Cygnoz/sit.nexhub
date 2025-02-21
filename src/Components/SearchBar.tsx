import { ChangeEvent } from "react";
import SearchIcon from "../assets/icons/SearchIcon";

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  inputRef?: any;
  onFocus?: any;
  className?: string; // Add className prop
};

const SearchBar = ({
  searchValue,
  onSearchChange,
  placeholder = "Search",
  inputRef,
  onFocus,
  className = "", // Default empty string to avoid undefined
}: Props) => {
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className={`relative w-full flex items-center ${className}`}>
      <SearchIcon />
      <input
        ref={inputRef}
        onFocus={onFocus}
        className={`pl-9 text-sm w-full rounded-md text-gray-800 h-10 p-2 bg-[#1C1C1C0A]  outline-none shadow-none ${className}`}
        placeholder={placeholder}
        onChange={handleSearch}
        value={searchValue}
      />
    </div>
  );
};

export default SearchBar;

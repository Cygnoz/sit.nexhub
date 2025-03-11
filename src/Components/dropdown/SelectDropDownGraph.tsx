import { useEffect, useState, useRef } from "react";
import ChevronDown from "../../assets/icons/CehvronDown";
import SearchBar from "../SearchBar";

type Props = {
  setSelectedValue?: (value: any) => void;
  selectedValue?: any;
  filteredData?: any[];
  width?: string;
  placeholder?: string;
  searchPlaceholder?: string;
};

const SelectDropdownGraph: React.FC<Props> = ({
  setSelectedValue,
  selectedValue,
  filteredData = [],
  width = "w-52",
  placeholder,
  searchPlaceholder = "Search...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredItems, setFilteredItems] = useState(filteredData);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = placeholder
      ? [{ label: placeholder, value: "" }, ...filteredData]
      : filteredData;

    setFilteredItems(items);

    if (!selectedValue && items.length > 0) {
      setSelectedValue?.(items[0]);
    }
  }, [filteredData, placeholder, selectedValue, setSelectedValue]);

  useEffect(() => {
    const items = placeholder
      ? [{ label: placeholder, value: "" }, ...filteredData]
      : filteredData;

    setFilteredItems(
      items.filter((item) =>
        item.label.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue, filteredData, placeholder]);

  const handleSelect = (item: any) => {
    setSelectedValue?.(item);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : prev
        );
        break;

      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;

      case "Enter":
        if (highlightedIndex >= 0) {
          handleSelect(filteredItems[highlightedIndex]);
        }
        break;

      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown} tabIndex={0}>
      <button
        className={`flex items-center px-4 py-2 border rounded-xl bg-[#FEFDFA] ${width}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedValue?.label || placeholder || filteredData[0]?.label || "Select"}
        <div className="ms-auto">
          <ChevronDown height={20} width={20} color="#6B7280" />
        </div>
      </button>

      {isOpen && (
        <div className={`absolute mt-2 top-10 bg-white border rounded-md shadow-lg max-h-72 custom-scrollbar overflow-y-auto z-10 ${width}`}>
          <div className="p-2">
            <SearchBar
              placeholder={searchPlaceholder}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
          </div>

          <div className="max-h-52 overflow-y-auto custom-scrollbar">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <div
                  key={item.value}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    selectedValue?.value === item.value ? "bg-gray-100 font-bold" : ""
                  } ${highlightedIndex === index ? "bg-blue-100" : ""}`}
                  onClick={() => handleSelect(item)}
                >
                  {item.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-red-500 font-bold text-center">
                No options found!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectDropdownGraph;

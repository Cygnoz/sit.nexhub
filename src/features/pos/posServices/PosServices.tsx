import { useState } from "react";
import serviceImage from "../../../assets/Images/serv.png";
import SearchBar from "../../../Components/SearchBar";
import bgImage from "../../../assets/Images/posservices.png";

type Props = { items: any[]; allCategoryData: any[] };

function PosServices({ items, allCategoryData }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<any[]>([]); // State to store selected services

  const uniqueCategories = allCategoryData.filter((category) =>
    items.some((item) => item.categories === category.categoriesName)
  );

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleServiceClick = (service: any) => {
    setSelectedServices((prevServices) => {
      // Check if the service is already selected
      const isAlreadySelected = prevServices.some(
        (selected) => selected.itemName === service.itemName
      );

      // If already selected, return the same state; otherwise, add the service
      if (isAlreadySelected) {
        return prevServices;
      } else {
        return [...prevServices, service];
      }
    });
  };

  const filteredServices = items.filter((service: any) => {
    const matchesCategory =
      selectedCategory === "All" || service.categories === selectedCategory;
    const matchesSearch = service.itemName
      ?.toLowerCase()
      .includes(searchValue.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="flex overflow-x-scroll hide-scrollbar gap-4">
        <div
          onClick={() => handleCategoryClick("All")}
          className={`px-2 py-1 rounded-lg flex justify-center gap-2 items-center min-w-max cursor-pointer mt-1 ${
            selectedCategory === "All"
              ? "border border-[#C96E76] bg-[#FAF1F1]"
              : "bg-white"
          }`}
        >
          <img
            src={serviceImage}
            className="w-6 h-6 rounded-full"
            alt="All"
          />
          <p className="text-xs font-semibold text-[#2C3E50]">All</p>
        </div>

        {uniqueCategories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category.categoriesName)}
            className={`px-2 py-1 rounded-lg flex justify-center gap-2 items-center min-w-max cursor-pointer mt-1 ${
              selectedCategory === category.categoriesName
                ? "border border-[#C96E76] bg-[#FAF1F1]"
                : "bg-white"
            }`}
          >
            <img
              src={category.image || serviceImage}
              className="w-6 h-6 rounded-full"
              alt={category.categoriesName}
            />
            <p className="text-xs font-semibold text-[#2C3E50]">
              {category.categoriesName}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <SearchBar
          onSearchChange={setSearchValue}
          searchValue={searchValue}
          placeholder="Search"
        />
        <div className="mt-3 grid grid-cols-4 h-full gap-4 overflow-y-scroll max-h-96 hide-scrollbar">
          {filteredServices.map((service, index) => (
            <div
              key={index}
              className="relative rounded-lg p-2 h-[168px] bg-white flex flex-col items-center shadow-sm cursor-pointer"
              onClick={() => handleServiceClick(service)} // Add service to state
            >
              <img
                src={service.itemImage || bgImage}
                alt={service.itemName}
                className="w-44 h-24 object-cover rounded-lg mb-2"
              />
              <p className="text-xs font-semibold text-[#2C3E50]">
                {service.itemName}
              </p>
              <div className="absolute bottom-0 left-0 w-full bg-[#DADCCD] p-1 rounded-b-lg">
                <p className="text-sm font-bold text-[#2C3E50] ms-2">
                  ₹{service.sellingPrice}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default PosServices;

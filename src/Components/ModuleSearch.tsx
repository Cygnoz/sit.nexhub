import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import useApi from "../Hooks/useApi";
import { tabsConfig } from "../assets/constants/ModuleSearchTabs";

type Props = {
  page?: string;
  mode?: boolean;
};

function ModuleSearch({ page, mode }: Props) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // API Hooks
  const { request: getCustomerRequest } = useApi("get", 7002);
  const { request: getAllAccounts } = useApi("get", 7001);
  const { request: getAllItems } = useApi("get", 7003);
  const { request: getAllSales } = useApi("get", 7007);
  const { request: getAllPurchases } = useApi("get", 7005);
  const { request: getAllSuppliers } = useApi("get", 7009);

  const requestFunctions: any = {
    getCustomerRequest,
    getAllItems,
    getAllSales,
    getAllPurchases,
    getAllSuppliers,
    getAllAccounts,
  };

  // Fetch data based on selected tab
  const fetchData = async () => {
    if (!searchValue.trim()) return;

    setIsFetching(true);
    const tabConfig = tabsConfig[selectedTab];
    if (!tabConfig) return;

    const { endpoint, requestKey } = tabConfig;
    const requestFunction = requestFunctions[requestKey];

    if (!requestFunction) return;

    try {
      const { response, error } = await requestFunction(endpoint);
      if (!error && response) {
        selectedTab === "Purchase Order"
          ? setAllData(response.data.allPurchaseOrder)
          : selectedTab === "Bills"
          ? setAllData(response.data.allBills)
          : selectedTab === "Payment Made"
          ? setAllData(response.data.allPayments)
          : setAllData(response.data);
      } else {
        console.error(`Error fetching ${selectedTab}:`, error);
      }
    } catch (err) {
      console.error(`Error fetching ${selectedTab}:`, err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (allData.length > 0) {
      const tabConfig = tabsConfig[selectedTab];
      if (!tabConfig) return;

      const filtered = allData?.filter((item) =>
        tabConfig.searchFields.some((field: string) =>
          item[field]?.toLowerCase().includes(searchValue.toLowerCase())
        )
      );

      setFilteredData(filtered);
    }
  }, [allData]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchValue("");
        setFilteredData([]);
        setSelectedTab("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
    setSearchValue("");
    setFilteredData([]);
    setSelectedTab("");
  }, [location]);

  useEffect(() => {
    if (searchValue.trim() === "") {
      setFilteredData([]);
      setAllData([]);
      return;
    }
    fetchData();
  }, [searchValue, selectedTab]);

  useEffect(() => {
    if (isOpen && !selectedTab) {
      setSelectedTab("Customer");
    }
  }, [isOpen]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAllData([]);
    setFilteredData([]);
    if (isSearchFocused && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [selectedTab]);

  const state =
    selectedTab === "Sales Order"
      ? { page: "salesOrder" }
      : selectedTab === "Quote"
      ? { page: "quote" }
      : selectedTab === "Invoice"
      ? { page: "invoice" }
      : selectedTab === "Reciept"
      ? { page: "reciept" }
      : selectedTab === "Credit Note"
      ? { page: "credit-Note" }
      : {};

  return (
    <div className="relative" ref={searchRef}>
      {/* Main SearchBar */}
      <div onClick={() => setIsOpen(true)}>
        <SearchBar
          className={`${
            page === "landing"
              ? !mode
                ? "bg-[#404B52] rounded-3xl text-[#F6F6F6]"
                : "bg-white rounded-3xl text-[#303F58]"
              : ""
          }`}
          placeholder={`Search ${selectedTab}`}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          inputRef={searchInputRef}
          onFocus={() => setIsSearchFocused(true)}
        />
      </div>

      {isOpen && (
        <div
          className={`${
            page === "landing"
              ? !mode
                ? "bg-[#0F1315]"
                : "bg-[#F9F7F5]"
              : "bg-[#F9F7F5]"
          } absolute top-full mt-2 w-[100%] rounded-2xl px-5 py-4 shadow-md z-[9999]`}
        >
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.keys(tabsConfig).map((tab) => (
              <button
                key={tab}
                className={`py-[8px] px-[14px] text-xs font-medium rounded-lg 
                  ${
                    page === "landing"
                      ? !mode
                        ? selectedTab === tab
                          ? "bg-[#232A2F] border border-[#232A2F] text-white"
                          : "bg-[#14181B] text-[#BEC0C2]"
                        : selectedTab === tab
                        ? "bg-[#FAF2E6] border border-[#C88000] text-[#2C3E50]"
                        : "bg-[#F1F1F1] text-[#2C3E50]"
                      : selectedTab === tab
                      ? "bg-[#FAF2E6] border border-[#C88000] text-[#2C3E50]"
                      : "bg-[#F1F1F1] text-[#2C3E50]"
                  }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Display Search Results or No Data Found */}
          <div className="mt-5 max-h-[35vh] overflow-y-scroll hide-scrollbar">
            {isFetching ? (
              <p className="text-center text-sm text-[#495160]">Loading...</p>
            ) : filteredData.length > 0 ? (
              filteredData.map((item) => {
                const fieldsToShow = tabsConfig[selectedTab].searchFields
                  .slice(1)
                  .filter((field: any) => item[field]);

                return (
                  <div
                    key={item._id}
                    className={`mt-2 ${
                      page === "landing"
                        ? !mode
                          ? "bg-[#232A2F]"
                          : "bg-white"
                        : "bg-white"
                    } p-3 rounded-lg cursor-pointer hover:shadow-md`}
                    onClick={() => {
                      const tabConfig = tabsConfig[selectedTab];
                      if (!tabConfig?.navigatePath) {
                        console.error(
                          `No navigation path found for ${selectedTab}`
                        );
                        return;
                      }

                      navigate(`${tabConfig.navigatePath}${item._id}`, {
                        state,
                      });
                    }}
                  >
                    {/* Name/Header */}
                    <p
                      className={`
                      ${
                        page === "landing"
                          ? !mode
                            ? "text-white"
                            : "text-[#0B1320]"
                          : "text-[#0B1320]"
                      } font-bold text-sm`}
                    >
                      {item[tabsConfig[selectedTab].searchFields[0]] || ""}
                    </p>

                    {/* Additional Details */}
                    <div
                      className={`
                      ${
                        page === "landing"
                          ? !mode
                            ? "text-[#bbbbbb]"
                            : "text-[#495160]"
                          : "text-[#495160]"
                      }
                      mt-2  text-xs flex `}
                    >
                      {fieldsToShow.map((field: any, index: any) => (
                        <div key={index} className="flex items-center">
                          <p>{item[field]}</p>
                          {index !== fieldsToShow.length - 1 && (
                            <div className="border-r h-4 border-[#818894] mx-3" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : searchValue.trim() !== "" ? (
              <p className="text-center text-sm mt-5 text-gray-500">
                No Data Found
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default ModuleSearch;

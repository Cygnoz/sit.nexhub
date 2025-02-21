import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { endponits } from "../Services/apiEndpoints";
import useApi from "../Hooks/useApi";

const tabsConfig: any = {
    Customer: {
        endpoint: endponits.GET_ALL_CUSTOMER,
        requestKey: "getCustomerRequest",
        searchFields: ["customerDisplayName", "customerEmail", "mobile", "companyName"],
        navigatePath: "customer/view/",
    },
    Inventory: {
        endpoint: endponits.GET_ALL_ITEMS_TABLE,
        requestKey: "getAllItems",
        searchFields: ["itemName", "sku", "itemType"],
        navigatePath: "inventory/Item"
    },
    SalesOrder: {
        endpoint: endponits.GET_ALL_SALES_ORDER,
        requestKey: "getAllSales",
        searchFields: ["salesOrder", "customerDisplayName", "deliveryMethod", "salesOrderDate"],
        navigatePath: "sales/viewsalesorder/",
    },
    Quote: {
        endpoint: endponits.GET_ALL_QUOTES,
        requestKey: "getAllSales",
        searchFields: ["salesQuotes", "customerDisplayName", "deliveryMethod", "salesQuoteDate"],
        navigatePath: "sales/viewsalesorder/",
    },
    Invoice: {
        endpoint: endponits.GET_ALL_SALES_INVOICE,
        requestKey: "getAllSales",
        searchFields: ["salesInvoice", "customerDisplayName", "deliveryMethod", "salesInvoiceDate"],
        navigatePath: "sales/viewsalesorder/",
    },
    Receipt: {
        endpoint: endponits.GET_ALL_SALES_RECIEPT,
        requestKey: "getAllSales",
        searchFields: ["receipt", "customerDisplayName", "paymentMode", "createdDate"],
        navigatePath: "sales/receipt/view/",
    },
    CreditNote: {
        endpoint: endponits.GET_ALL_CREDIT_NOTE,
        requestKey: "getAllSales",
        searchFields: ["creditNote", "customerDisplayName", "invoiceType", "createdDate"],
        navigatePath: "sales/viewsalesorder/",
    },
    Accounts: {
        endpoint: endponits.Get_ALL_Acounts,
        requestKey: "getAllAccounts",
        searchFields: ["accountName", "accountHead", "accountCode","createdDate"],
        navigatePath: "accountant/view/",
    },
    ManualJournal: {
        endpoint: endponits.GET_ALL_JOURNALS,
        requestKey: "getAllAccounts",
        searchFields: ["journalId", "reference", "date","note"],
        navigatePath: "accountant/manualjournal/view/",
    },
    Supplier: {
        endpoint: endponits.GET_ALL_SUPPLIER,
        requestKey: "getAllSuppliers",
        searchFields: ["supplierDisplayName", "supplierEmail", "mobile"],
        navigatePath: "supplier/view/",
    },
    PurchaseOrder: {
        endpoint: endponits.GET_ALL_PURCHASE_ORDER,
        requestKey: "getAllPurchases",
        searchFields: ["purchaseOrder", "supplierDisplayName", "purchaseOrderDate"],
        navigatePath: "purchase/purchase-order/view/",
    },
    Bills: {
        endpoint: endponits.GET_ALL_BILLS,
        requestKey: "getAllPurchases",
        searchFields: ["billNumber", "supplierDisplayName", "billDate"],
        navigatePath: "purchase/bills/view/",
    },
    PaymentMade: {
        endpoint: endponits.GET_PAYMENTMADE,
        requestKey: "getAllPurchases",
        searchFields: ["paymentMade", "supplierDisplayName", "paymentDate"],
        navigatePath: "purchase/payment-made/view/",
    },
    DebitNote: {
        endpoint: endponits.GET_ALL_DEBIT_NOTE,
        requestKey: "getAllPurchases",
        searchFields: ["debitNote", "supplierDisplayName", "supplierDebitDate"],
        navigatePath: "purchase/debit-note/view/",
    },

};

function ModuleSearch() {
    const [searchValue, setSearchValue] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<string>("");
    const [allData, setAllData] = useState<any[]>([]);
    console.log(allData, "allData");

    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);

    // API Hooks
    const { request: getCustomerRequest } = useApi("get", 5002);
    const { request: getAllAccounts } = useApi("get", 5001);
    const { request: getAllItems } = useApi("get", 5003);
    const { request: getAllSales } = useApi("get", 5007);
    const { request: getAllPurchases } = useApi("get", 5005);
    const { request: getAllSuppliers } = useApi("get", 5009);

    const requestFunctions: any = {
        getCustomerRequest,
        getAllItems,
        getAllSales,
        getAllPurchases,
        getAllSuppliers,
        getAllAccounts
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
                selectedTab==="PurchaseOrder"?
                setAllData(response.data.allPurchaseOrder):
                selectedTab==="Bills"?
                setAllData(response.data.allBills):
                selectedTab==="PaymentMade"?
                setAllData(response.data.allPayments):
                setAllData(response.data)
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
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
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

    const location = useLocation(); // Track route changes

    // Close modal when route changes
    useEffect(() => {
        setIsOpen(false);
        setSearchValue("");
        setFilteredData([]);
        setSelectedTab("");
    }, [location]);

    useEffect(() => {
        if (searchValue.trim() === "") {
            setFilteredData([]); // Clear filtered data when searchValue is empty
            return;
        }
        fetchData();
    }, [searchValue, selectedTab]);

    useEffect(() => {
        if (isOpen && !selectedTab) {
            setSelectedTab("Customer"); // Default to "Customer" tab when search opens
        }
    }, [isOpen]);

    const state = 
    selectedTab === "SalesOrder" ? { page: "salesOrder" } :
    selectedTab === "Quote" ? { page: "quote" } : 
    selectedTab === "Invoice" ? {page:"invoice"} :
    selectedTab === "Reciept" ? {page:"reciept"} :
    selectedTab === "CreditNote" ? {page:"credit-Note"} :
    {};


    return (
        <div className="relative" ref={searchRef}>
            {/* Main SearchBar */}
            <div onClick={() => setIsOpen(true)}>
                <SearchBar
                    placeholder={`Search  ${selectedTab}`}
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                />
            </div>

            {isOpen && (
                <div className="absolute top-full mt-2 bg-[#F9F7F5] w-[100%] rounded-2xl px-5 py-4 shadow-md z-20">
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {Object.keys(tabsConfig).map((tab) => (
                            <button
                                key={tab}
                                className={`py-[8px] px-[14px] text-xs font-medium text-[#2C3E50] rounded-lg 
                                    ${selectedTab === tab
                                        ? "bg-[#FAF2E6] border border-[#C88000]"
                                        : "bg-[#F1F1F1]"
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
                            <p className="text-center text-sm text-gray-500">Loading...</p>
                        ) : filteredData.length > 0 ? (
                            filteredData.map((item) => {
                                const fieldsToShow = tabsConfig[selectedTab].searchFields.slice(1).filter((field: any) => item[field]);

                                return (
                                    <div
                                        key={item._id}
                                        className="mt-2 bg-white p-3 rounded-lg cursor-pointer hover:shadow-md"
                                        onClick={() => {
                                            const tabConfig = tabsConfig[selectedTab];
                                            if (!tabConfig?.navigatePath) {
                                                console.error(`No navigation path found for ${selectedTab}`);
                                                return;
                                            }


                                            navigate(`${tabConfig.navigatePath}${item._id}`, { state });
                                        }}

                                    >
                                        {/* Name/Header */}
                                        <p className="text-[#0B1320] font-bold text-sm">
                                            {item[tabsConfig[selectedTab].searchFields[0]] || ""}
                                        </p>

                                        {/* Additional Details */}
                                        <div className="mt-2 text-xs flex text-[#495160]">
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
                            <p className="text-center text-sm text-gray-500">No Data Found</p>
                        ) : null}
                    </div>

                </div>
            )}
        </div>
    );
}

export default ModuleSearch;

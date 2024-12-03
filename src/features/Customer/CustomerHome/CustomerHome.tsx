import { useContext, useEffect, useState } from "react";
import Cards from "./Cards";
import NewCustomerModal from "./NewCustomerModal";
import CustomerTable from "./CustomerTable";
// import Customers from "./Customers";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import { CustomerEditResponseContext, CustomerResponseContext, TableResponseContext } from "../../../context/ContextShare";
import Dropdown from "./Dropdown";

interface Customer {
  _id: string;
  billingAttention: string;
  companyName: string;
  mobile: string;
  customerEmail: string;
  skypeNameNumber?: string;
  billingPhone: string;
  billingCity: string;
  status: string;
  customerDisplayName: string;
  [key: string]: any;
}

type Props = {};

function CustomerHome({}: Props) {
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const { customerResponse } = useContext(CustomerResponseContext)!;
  const { request: AllCustomers } = useApi("get", 5002);
  const [searchValue, setSearchValue] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { loading, setLoading } = useContext(TableResponseContext)!;
  const { customerEditResponse } = useContext(CustomerEditResponseContext)!;

  const fetchAllCustomers = async () => {
    try {
      // Set loading state to show the skeleton loader
      setLoading({ ...loading, skeleton: true });
  
      const url = `${endponits.GET_ALL_CUSTOMER}`;
      const { response, error } = await AllCustomers(url);
  
      if (!error && response) {
        setCustomerData(response.data);
        console.log(response, "all customers");
        
        // Turn off the skeleton loader after data is received
        setLoading({ ...loading, skeleton: false });
      } else {
        // Handle error scenario
        console.log(error, "all customers error");
  
        // Update the loading state in case of error
        setLoading({ ...loading, skeleton: false, noDataFound: true });
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
  
      // Handle error state
      setLoading({ ...loading, skeleton: false, noDataFound: true });
    }
  };
  

  useEffect(() => {
    fetchAllCustomers();
  }, [customerResponse,customerEditResponse]);

  const activeCustomers = customerData.filter(customer => customer.status === "Active").length;
  const inactiveCustomers = customerData.filter(customer => customer.status === "Inactive").length;

  // Find duplicate customers
  const findDuplicateCustomers = (customers: Customer[]) => {
    const duplicates: Customer[] = [];
    const seen = new Set<string>();
    const seenDuplicates = new Set<string>();

    customers.forEach(customer => {
      if (seen.has(customer.customerDisplayName)) {
        if (!seenDuplicates.has(customer.customerDisplayName)) {
          duplicates.push(customer);
          seenDuplicates.add(customer.customerDisplayName);
        }
      } else {
        seen.add(customer.customerDisplayName);
      }
    });

    return duplicates;
  };

  const duplicateCustomers = findDuplicateCustomers(customerData).length;

  const handleCardClick = (filter: string | null) => {
    setActiveFilter(filter);
  };

  const filteredCustomers = customerData.filter(customer => {
    if (activeFilter === "Active") return customer.status === "Active";
    if (activeFilter === "Inactive") return customer.status === "Inactive";
    if (activeFilter === "Duplicate") {
      return findDuplicateCustomers(customerData).some(dup => dup.customerDisplayName === customer.customerDisplayName);
    }
    return true;
  });

  return (
    <>
      <div className="mx-5 my-4 space-y-4 flex items-center relative">
        <div>
          <h3 className="font-bold text-2xl text-textColor">Customer</h3>
          <p className="text-sm text-gray mt-1">
            A customer is a compiled record of all individuals or entities who
            have purchased or interacted with business
          </p>
        </div>
        <div className="ml-auto gap-3 flex items-center">
          <NewCustomerModal page="" />
          <div>
          <Dropdown/>
          </div>
        </div>
      </div>
      <div>
        <Cards
          all={customerData.length}
          active={activeCustomers}
          inactive={inactiveCustomers}
          duplicate={duplicateCustomers}
          onCardClick={handleCardClick}
        />
      </div>
      <div className="px-6 mt-3">
        <div className="bg-white p-5">
          <CustomerTable loading={loading} customerData={filteredCustomers} searchValue={searchValue} setSearchValue={setSearchValue} />
        </div>
      </div>
    </>
  );
}

export default CustomerHome;

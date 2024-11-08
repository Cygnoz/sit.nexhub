import { useContext, useEffect, useState } from "react";
import NewSupplierModal from "./AddSupplierModal";
import Cards from "./Cards";
import Dropdown from "./Dropdown";
import SupplierTable from "./SupplierTable";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import { SupplierResponseContext, TableResponseContext } from "../../../context/ContextShare";

interface Supplier {
  _id: string;
  billingAttention: string;
  companyName: string;
  mobile: string;
  supplierEmail: string;
  skypeNameNumber?: string;
  billingPhone: string;
  billingCity: string;
  status: string;
  supplierDisplayName: string;
  [key: string]: any;
}

const SupplierHome = () => {
  const [supplierData, setSupplierData] = useState<Supplier[]>([]);
  const { request: AllSuppliers } = useApi("get", 5009);
  const { supplierResponse } = useContext(SupplierResponseContext)!;
  const [searchValue, setSearchValue] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const {loading,setLoading}=useContext(TableResponseContext)!;



  const fetchAllSuppliers = async () => {
    try {
      const url = `${endponits.GET_ALL_SUPPLIER}`;
      setLoading({ ...loading, skelton: true });
  
      const { response, error } = await AllSuppliers(url);
  
      if (error || !response) {
        // Handle no data scenario
        setLoading({ ...loading, skelton: false, noDataFound: true });
        return;
      }
  
      // Set supplier data if response is valid
      setSupplierData(response.data);
  
      // Turn off the skeleton loader after data is received
      setLoading({ ...loading, skelton: false });
  
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setLoading({ ...loading, noDataFound: true, skelton: false });
    }
  };
  

  useEffect(() => {
      fetchAllSuppliers();
  }, [supplierResponse]);

  const activeSuppliers = supplierData.filter(supplier => supplier.status === "Active").length;
  const inactiveSuppliers = supplierData.filter(supplier => supplier.status === "Inactive").length;

  // Find duplicate suppliers
  const findDuplicateSuppliers = (suppliers: Supplier[]) => {
    const duplicates: Supplier[] = [];
    const seen = new Set<string>();
    const seenDuplicates = new Set<string>();

    suppliers.forEach(supplier => {
      if (seen.has(supplier.supplierDisplayName)) {
        if (!seenDuplicates.has(supplier.supplierDisplayName)) {
          duplicates.push(supplier);
          seenDuplicates.add(supplier.supplierDisplayName);
        }
      } else {
        seen.add(supplier.supplierDisplayName);
      }
    });

    return duplicates;
  };

  const duplicateSuppliers = findDuplicateSuppliers(supplierData).length;

  const handleCardClick = (filter: string | null) => {
    setActiveFilter(filter);
  };

  const filteredSuppliers = supplierData.filter(supplier => {
    if (activeFilter === "Active") return supplier.status === "Active";
    if (activeFilter === "Inactive") return supplier.status === "Inactive";
    if (activeFilter === "Duplicate") {
      return findDuplicateSuppliers(supplierData).some(dup => dup.supplierDisplayName === supplier.supplierDisplayName);
    }
    return true;
  });

  return (
    <>
      <div className="px-6 flex items-center relative">
        <div>
          <h3 className="font-bold text-2xl text-textColor">Supplier</h3>
          <p className="text-sm text-gray mt-1">
          Organize supplier details to enhance purchasing and collaboration.
          </p>
        </div>
        <div className="ml-auto gap-3 flex items-center">
          <NewSupplierModal />
          <div>
          {/* <Dropdown /> */}
          </div>
        </div>
      </div>
      <div>
        <Cards
          all={supplierData.length}
          active={activeSuppliers}
          inactive={inactiveSuppliers}
          duplicate={duplicateSuppliers}
          onCardClick={handleCardClick}
        />
      </div>
      <div className="px-6 mt-3">
        <div className="bg-white p-5">
          <SupplierTable loading={loading} supplierData={filteredSuppliers} searchValue={searchValue} setSearchValue={setSearchValue} />
        </div>
      </div>
    </>
  );
};

export default SupplierHome;

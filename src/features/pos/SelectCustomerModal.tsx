import { useEffect, useState } from "react";
import CehvronDown from "../../assets/icons/CehvronDown";
import Modal from "../../Components/model/Modal";
import SearchBar from "../../Components/SearchBar";
import defaultCustomerImage from "../../assets/Images/Rectangle 5558.png";
import { endponits } from "../../Services/apiEndpoints";
import useApi from "../../Hooks/useApi";
import Button from "../../Components/Button";

type Props = {};

function SelectCustomerModal({}: Props) {
  const [customerData, setCustomerData] = useState<any>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  console.log(selectedCustomer);
  
  const { request: AllCustomers } = useApi("get", 5002);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const fetchAllCustomers = async () => {
    try {
      const url = `${endponits.GET_ALL_CUSTOMER}`;
      const { response, error } = await AllCustomers(url);
      if (!error && response) {
        const customers = response.data;
        setCustomerData(customers);
        if (customers.length > 0) {
          setSelectedCustomer(customers[0]);
        }
      } else {
        console.log(error, "all customers error");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };
  
  useEffect(() => {
    fetchAllCustomers();
  }, []);
  

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  const filteredCustomers = customerData.filter(
    (customer: any) =>
      customer.customerDisplayName
        ?.toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      customer.mobile?.toString().includes(searchValue)
  );

  return (
    <>
      <div
        className="relative border-2 border-slate-200 flex rounded-md px-2 py-1 text-sm items-center"
        onClick={openModal}
      >
        <span className="me-5 text-[#818894]">Select Customer</span>
        <div className="pointer-events-none inset-y-0 right-1 flex items-center">
          <CehvronDown color="#495160" />
        </div>
      </div>

      <Modal
        className="p-6 rounded-2xl w-[65%]"
        open={isModalOpen}
        onClose={closeModal}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-textColor text-sm font-bold">
            Customer Details
          </span>
          <p className="text-3xl font-light cursor-pointer" onClick={closeModal}>
            &times;
          </p>
        </div>

        <SearchBar
          onSearchChange={setSearchValue}
          searchValue={searchValue}
          placeholder="Search Customer by Name, Phone"
        />

        <div className="flex justify-between mt-4">
          <div className="w-[40%] pr-4 overflow-y-scroll max-h-[500px] hide-scrollbar grid grid-cols-2 gap-4">
            {filteredCustomers.map((customer: any) => (
              <div
                key={customer.id}
                className={`bg-[#F5F2EE] rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer ${
                  selectedCustomer?._id === customer._id
                    ? "border-2 border-[#948B7C]"
                    : ""
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <img
                  src={customer.customerProfile || defaultCustomerImage}
                  className="w-14 h-14 rounded-full mb-2"
                  alt="Customer"
                />
                <p className="text-[#37393A] font-bold text-xs">
                  {customer.customerDisplayName}
                </p>
                <p className="text-[#818894] text-xs">{customer.mobile}</p>
              </div>
            ))}
          </div>

          {/* Right section - Selected customer details */}
          <div className="w-[60%] bg-[#FAFAFA] rounded-lg">
            {selectedCustomer && (
              <>
               <div className="bg-[#F3F3F3] rounded-[10px] p-5">
                <p className="text-[#4F5152] text-xs font-bold">Customer Info</p>
                <div className="mt-3 bg-white p-5 rounded-lg">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-dropdownText text-xs font-semibold">Customer Name</p>
                            <p className="text-textColor text-sm font-semibold">{selectedCustomer?.customerDisplayName}</p>
                        </div>
                        <div>
                            <img src={selectedCustomer?.customerProfile || defaultCustomerImage} className="w-10 h-10 rounded-full" alt="" />
                        </div>
                    </div>
                    <p className="text-dropdownText text-xs font-semibold mt-3">Billing Address</p>
                    <p className="text-textColor text-sm">
                        {selectedCustomer?.billingAddressLine1 || ""}{""}
                        {selectedCustomer?.billingAddressLine2 || ""}{" "}
                        {selectedCustomer?.billingCity || ""}{" "}
                        {selectedCustomer?.billingCountry || ""}{" "}
                        {selectedCustomer?.billingState || ""}{" "}
                        {selectedCustomer?.billingPinCode || ""}
                      </p>
                      <p className="text-dropdownText text-xs font-semibold mt-3">Shipping Address</p>

                    <p className="text-textColor text-sm ">{selectedCustomer?.shippingAddress1} {selectedCustomer?.shippingAddress2} {selectedCustomer?.shippingCity} {selectedCustomer?.shippingCountry} {selectedCustomer?.shippingState} {selectedCustomer?.shippingPinCode}</p>
                </div>
               </div>   
             </>
            )}
          </div>
        </div>
        <div className="flex justify-end items-center gap-3">
            <Button variant="secondary" className="text-sm pl-10 pr-10 h-10" onClick={closeModal}>Cancel</Button>
            <Button className="text-sm pl-10 pr-10 h-10">Save</Button>
        </div>
      </Modal>
    </>
  );
}

export default SelectCustomerModal;

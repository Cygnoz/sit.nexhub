import { useEffect, useState } from "react";
import Button from "../../Components/Button";
import Modal from "../../Components/model/Modal";
import defaultCustomerImage from "../../assets/Images/Rectangle 5558.png";
import Info from "../../assets/icons/Info";
import { useNavigate } from "react-router-dom";
import useApi from "../../Hooks/useApi";
import toast from "react-hot-toast";
import { endponits } from "../../Services/apiEndpoints";
import { useOrganization } from "../../context/OrganizationContext";

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const initialSalesQuoteState: any = {
  customerId: "",
  customerName: "",
  placeOfSupply: "",
  salesInvoiceDate: getCurrentDate(),
//   paymentMode: "",

  items: [
    {
      itemId: "",
      itemName: "",
      quantity: "",
      sellingPrice: "",
      taxPreference: "",
      taxGroup: "",
      cgst: "",
      sgst: "",
      igst: "",
      cgstAmount: "",
      sgstAmount: "",
      igstAmount: "",
      vatAmount: "",
      itemTotaltax: "",
      discountType: "Percentage",
      amount: "",
      itemAmount: ""
    },
  ],
};

type Props = { selectedItems: any[]; total: number; selectedCustomer: any ;selectedMethodLabel:any};

function PosPayment({ selectedItems, total, selectedCustomer ,selectedMethodLabel}: Props) {
    console.log(selectedItems);
    
  const [isModalOpen, setModalOpen] = useState(false);
  const [paidAmount, setPaidAmount] = useState<any>("");
  const [invoiceState, setInvoiceState] = useState<any>(initialSalesQuoteState);
  console.log(invoiceState);
  
  const { organization: orgData } = useOrganization();
  
  useEffect(() => {
    if (selectedCustomer && orgData) {
      setInvoiceState((prevState: any) => ({
        ...prevState,
        customerId: selectedCustomer._id || "",
        customerName: selectedCustomer.customerDisplayName || "",
        placeOfSupply: orgData.state || "",
        // paymentMode:selectedMethodLabel || ""
      }));
    }
  }, [selectedCustomer, orgData,selectedMethodLabel]);
  useEffect(() => {
    if (selectedItems.length > 0) {
      const mappedItems = selectedItems.map((item) => ({
        itemId: item._id || "",
        itemName: item.itemName || "",
        quantity: 1, 
        sellingPrice: item.sellingPrice || "",
        taxPreference: item.taxPreference || "",
        taxGroup: item.taxRate || "",
        cgst: item.cgst || "",
        sgst: item.sgst || "",
        igst: item.igst || "",
        cgstAmount: ((item.sellingPrice * item.cgst) / 100).toFixed(2) || "0.00",
        sgstAmount: ((item.sellingPrice * item.sgst) / 100).toFixed(2) || "0.00",
        igstAmount: ((item.sellingPrice * item.igst) / 100).toFixed(2) || "0.00",
        vatAmount: "0.00", // If VAT is not applicable, keep it as 0
        itemTotaltax: (
          
          ((item.sellingPrice * (item.igst || 0)) / 100)
        ).toFixed(2),
        amount: item.sellingPrice || "", // Total amount (selling price + tax)
        itemAmount: item.sellingPrice +(item.igst) || "",
      }));
  
      setInvoiceState((prevState: any) => ({
        ...prevState,
        items: mappedItems,
      }));
    }
  }, [selectedItems]);
  

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleKeypadClick = (value: string) => {
    if (value === "delete") {
      setPaidAmount((prev: any) => prev.slice(0, -1));
    } else {
      setPaidAmount((prev: any) => prev + value);
    }
  };

  const handlePredefinedClick = (amount: string) => {
    setPaidAmount(amount.replace("₹ ", ""));
  };

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/posreciept");
  };

  const { request: newSalesInvoiceApi } = useApi("post", 5007);

  const handleSave = async () => {
    try {
      const url = `${endponits.ADD_SALES_INVOICE}`;
      const { response, error } = await newSalesInvoiceApi(url, invoiceState);
      if (!error && response) {
        toast.success(response.data.message);
        handleGoBack();
      } else {
        toast.error(error?.response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      <Button
        className={`text-sm pl-16 h-10 pr-16 ${
          selectedItems.length === 0 ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={selectedItems.length === 0 ? undefined : openModal}
      >
        Go to Payment
      </Button>

      <Modal
        className="w-[40%] overflow-y-auto max-h-[95%] hide-scrollbar px-8 py-4 rounded-2xl"
        open={isModalOpen}
        onClose={closeModal}
      >
        {/* Modal Content */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-textColor text-base font-bold">Add Sale</span>
          <p className="text-3xl font-light cursor-pointer" onClick={closeModal}>
            &times;
          </p>
        </div>

        <div className="bg-[#F3EFE8] px-4 py-2 rounded-lg flex gap-3">
          <img
            src={selectedCustomer?.customerProfile || defaultCustomerImage}
            className="w-10 h-10 rounded-full"
            alt=""
          />
          <p className="text-[#495160] text-xs">
            Customer <br />
            <span className="text-[#37393A] text-xs font-bold">
              {selectedCustomer?.customerDisplayName}
            </span>
          </p>
          <div className="border border-[#DDDDDD] ms-2"></div>
          <p
            className="flex justify-center items-center text-[#585953] text-xs
           font-semibold gap-1
           "
          >
            <Info color="#585953" size={14} /> See more details
          </p>
        </div>

        <p className="text-dropdownText font-bold text-sm mt-4">
          {selectedItems?.length} Items
        </p>
        <p className="text-dropdownText font-bold text-base mt-2">Total </p>
        <p className="mt-2 font-bold text-2xl text-textColor">
          ₹ {total.toFixed(2)}
        </p>

        {/* Input Field */}
        <div className="mt-4">
          <label className="text-textColor text-sm">Paid</label>
          <input
            type="text"
            className="text-xs w-full rounded-l-md text-start text-[#818894]
             bg-white border border-slate-300 h-9 p-2 mt-1 outline-none cursor-pointer"
            value={paidAmount}
            readOnly
          />
        </div>

        {/* Predefined Amount Buttons */}
        <div className="rounded-md mt-4">
          <div className="flex gap-2 mb-4">
            {["₹ 100", "₹ 500", "₹ 1000", "₹ 2000", "₹ 5000", "₹ 10000"].map(
              (amount) => (
                <button
                  key={amount}
                  className="bg-[#F6F6F6] text-xs border-gray-300 font-medium text-gray-700 w-full py-2 px-4 rounded-md"
                  onClick={() => handlePredefinedClick(amount)}
                >
                  {amount}
                </button>
              )
            )}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 bg-[#F4EFE8] px-20 py-6 rounded-lg">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0].map((num) => (
              <button
                key={num}
                className="bg-white text-lg font-bold text-[#37393A] py-[10px] px-10 rounded-[10px]"
                onClick={() => handleKeypadClick(num.toString())}
              >
                {num}
              </button>
            ))}

            <button
              className="bg-white text-lg font-bold text-[#37393A] py-[10px] px-10 rounded-[10px]"
              onClick={() => handleKeypadClick("delete")}
            >
              ⌫
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-[#2A9F6E] text-sm">Change to be given</p>
          <p className="text-dropdownText text-xl font-bold">
            ₹ {(paidAmount ? (paidAmount - total).toFixed(2) : "0.00")}
          </p>
        </div>
        <div className="flex justify-between mt-5 gap-4">
          <Button
            className="text-sm pl-20 h-10 pr-20"
            variant="secondary"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button className="text-sm pl-28 h-10 pr-28" onClick={handleSave}>
            Submit
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default PosPayment;

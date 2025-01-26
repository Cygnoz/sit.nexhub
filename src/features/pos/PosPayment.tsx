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
      amount: "",
      itemAmount: "",
      salesAccountId:""
    },
  ],
  totalDiscount: "",
  discountTransactionType: "",
  discountTransactionAmount: "",

  paidAmount: "",

  subTotal: "",
  totalItem: "",

  totalTax: "",
  totalAmount: "",

  paymentMethod:"",
};

type Props = {
  selectedItems: any[]; total: number; selectedCustomer: any; selectedMethodLabel: any; quantities: { [key: string]: number; };
  discountType: any, discount: any, subtotal: any, discounts: any
};

function PosPayment({ selectedItems, total, selectedCustomer, selectedMethodLabel, quantities, discountType, discount, subtotal
  , discounts
}: Props) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [paidAmount, setPaidAmount] = useState<any>("");
  const [invoiceState, setInvoiceState] = useState<any>(initialSalesQuoteState);
  console.log(invoiceState,"as");

  const { organization: orgData } = useOrganization();

  useEffect(() => {
    if (selectedCustomer && orgData) {
      setInvoiceState((prevState: any) => ({
        ...prevState,
        customerId: selectedCustomer?._id || "",
        customerName: selectedCustomer?.customerDisplayName || "",
        placeOfSupply: orgData.state || "",
        totalDiscount: discount || "0",
        discountTransactionAmount: discounts || "0",
        paymentMethod: selectedMethodLabel || "",
      }));
    }
  }, [selectedCustomer, orgData, selectedMethodLabel, discount, discounts]);


  
  useEffect(() => {
    if (selectedItems.length > 0) {
      const mappedItems = selectedItems.map((item) => {
        const sellingPrice = parseFloat(item.sellingPrice) || 0;
        const quantity = quantities[item._id] || 1; 

        const cgst = item.cgst !== undefined && !isNaN(parseFloat(item.cgst)) ? parseFloat(item.cgst) : undefined;
        const sgst = item.sgst !== undefined && !isNaN(parseFloat(item.sgst)) ? parseFloat(item.sgst) : undefined;
        const igst = item.igst !== undefined && !isNaN(parseFloat(item.igst)) ? parseFloat(item.igst) : undefined;
        

        const cgstAmount = selectedCustomer?.taxType === "Non-Tax" 
        ? "0.00" 
        : cgst !== undefined 
          ? ((sellingPrice * cgst * quantity) / 100).toFixed(2) 
          : "0.00";
      
      const sgstAmount = selectedCustomer?.taxType === "Non-Tax" 
        ? "0.00" 
        : sgst !== undefined 
          ? ((sellingPrice * sgst * quantity) / 100).toFixed(2) 
          : "0.00";
      
      const igstAmount = selectedCustomer?.taxType === "Non-Tax" 
        ? "0.00" 
        : selectedCustomer?.taxType === "GST"
          ? "0.00" 
          : igst !== undefined 
            ? ((sellingPrice * igst * quantity) / 100).toFixed(2) 
            : "0.00";
      
      const itemTotaltax = selectedCustomer?.taxType === "Non-Tax" 
        ? "0.00" 
        : selectedCustomer?.taxType === "GST"
          ? (parseFloat(cgstAmount) + parseFloat(sgstAmount)).toFixed(2)
          : parseFloat(igstAmount).toFixed(2);
      
      const itemAmount = selectedCustomer?.taxType === "Non-Tax" 
        ? (sellingPrice * quantity).toFixed(2) // No tax added
        : selectedCustomer?.taxType === "GST"
          ? (sellingPrice * quantity + parseFloat(cgstAmount) + parseFloat(sgstAmount)).toFixed(2)
          : (sellingPrice * quantity + parseFloat(igstAmount)).toFixed(2);
      

        return {
          itemId: item._id || "",
          itemName: item.itemName || "",
          quantity,
          sellingPrice,
          taxPreference: item.taxPreference || "",
          taxGroup: item.taxRate || undefined,
          cgst,
          sgst,
          igst,
          cgstAmount,
          sgstAmount,
          igstAmount,
          salesAccountId: item.salesAccountId,
          vatAmount: "0.00",
          itemTotaltax,
          amount: sellingPrice * quantity,
          itemAmount: Number(itemAmount)?.toFixed(2),
        };
      });

      // Calculate totals
      const subTotal = mappedItems.reduce((sum, item) => sum + parseFloat(item.itemAmount), 0).toFixed(2);
      const totalTax = mappedItems.reduce((sum, item) => sum + parseFloat(item.itemTotaltax), 0).toFixed(2);
      const totalAmount = (subtotal + parseFloat(totalTax)) - discount
      const totalItem = mappedItems.reduce((sum, item) => sum + item.quantity, 0); // Sum of all quantities

      // Update invoice state
      setInvoiceState((prevState: any) => ({
        ...prevState,
        items: mappedItems,
        subTotal,
        totalTax,
        totalAmount,
        totalItem: totalItem.toString(),
        discountTransactionType: discountType,
        paidAmount:total
      }));
    }
  }, [selectedItems, selectedCustomer?.taxType, quantities, discountType, total, discount, subtotal]);




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
        setTimeout(() => {
          handleGoBack();
        }, 500); 
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
        className={`text-sm pl-16 h-10 pr-16 ${selectedItems.length === 0 ? "cursor-not-allowed" : "cursor-pointer"
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

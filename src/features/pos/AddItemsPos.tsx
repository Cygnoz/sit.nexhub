import { useState } from "react";
import DebitCardIcon from "../../assets/icons/DebitCardIcon";
import RsIcon from "../../assets/icons/RsIcon";
import UpiIcon from "../../assets/icons/UpiIcon";
import Button from "../../Components/Button";
import PosDiscount from "./PosDiscount";
import OutlineTrashIcon from "../../assets/icons/OutlineTrashIcon";
import PosPayment from "./PosPayment";
// import noItemFoundIMage from "../../assets/Images/no item added.png"

type Props = { selectedItems: any[]; onRemoveItem: (item: any) => void ; selectedCustomer:any };

const paymentMethods = [
  { id: 1, label: "Cash", icon: <RsIcon /> },
  { id: 2, label: "Debit Card", icon: <DebitCardIcon /> },
  { id: 3, label: "UPI", icon: <UpiIcon /> },
];

function AddItemsPos({ selectedItems, onRemoveItem ,selectedCustomer}: Props) {
  const [selectedMethod, setSelectedMethod] = useState<number | null>(1);
  const [selectedMethodLabel, setSelectedMethodLabel] = useState<string>("Cash");
  const [discount, setDiscount] = useState<any>("");
  const [discountType, setDiscountType] = useState<string>("Percentage");

  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    () =>
      selectedItems.reduce(
        (acc, item) => ({
          ...acc,
          [item._id]: 1,
        }),
        {}
      )
  );

  const handleMethodSelect = (method: { id: number; label: string }) => {
    setSelectedMethod(method.id); 
    setSelectedMethodLabel(method.label);
  };
  const handleIncrement = (itemId: string, currentStock: number) => {
    setQuantities((prev) => {
      const newQuantity = (prev[itemId] || 1) + 1;
      if (newQuantity > currentStock) {
        alert("Quantity exceeds current stock!");
        return prev;
      }
      return { ...prev, [itemId]: newQuantity };
    });
  };

  const handleDecrement = (itemId: string) => {
    setQuantities((prev) => {
      const newQuantity = (prev[itemId] || 1) - 1;
      if (newQuantity < 1) {
        return prev;
      }
      return { ...prev, [itemId]: newQuantity };
    });
  };

  const subtotal = selectedItems.reduce(
    (total, item) => total + item.sellingPrice * (quantities[item._id] || 1),
    0
  );

  const tax = selectedItems.reduce((total, item) => {
    const igst = item.igst && item.igst > 0 ? parseFloat(item.igst) : 0; 
    const quantity = quantities[item._id] || 1; 
    const sellingPrice = parseFloat(item.sellingPrice) || 0;
    const itemTax = (sellingPrice * quantity * igst) / 100;
    return total + itemTax;
  }, 0);
  
  // Calculate discount
  const discountValue =
    discountType === "Percentage"
      ? ((subtotal +tax) * discount) / 100
      : Math.min(discount, subtotal);
      console.log(discountValue);
      

  const total = subtotal + tax - discountValue;

  return (
    <div className="bg-white p-6 mt-3 rounded-lg h-auto">
     <div>
     <div className="flex justify-between items-center">
        <p className="text-textColor text-sm font-bold">Selected Item</p>
        <p className="text-dropdownText text-sm font-semibold">Order no: 001343</p>
      </div>

      {/* Selected Items */}
      <div className="overflow-y-scroll max-h-[300px] hide-scrollbar">
        {selectedItems.map((item) => (
          <div key={item._id} className="mt-3 bg-[#F6F6F6] p-[10px] rounded-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center w-[60%]">
                <img
                  src={item.itemImage || "defaultImageURL"}
                  className="w-20 h-11 object-cover rounded-lg"
                  alt={item.itemName}
                />
                <p className="text-dropdownText text-xs font-semibold ms-3">
                  {item.itemName}
                  <br />
                  <span className="text-textColor font-bold text-xs block mt-1.5">
                    ₹ {item.sellingPrice.toFixed(2)}
                  </span>
                </p>
              </div>
              <div>
                <div className="flex justify-center items-center gap-5 me-4">
                  <div
                    className="bg-white rounded-full p-[6px] w-6 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleDecrement(item._id)}
                  >
                    -
                  </div>
                  <input
                    type="text"
                    value={quantities[item._id] || 1}
                    readOnly
                    className="bg-white border border-[#CECECE] p-2 w-12 rounded-lg h-8 text-center text-sm"
                  />
                  <div
                    className="bg-white rounded-full p-[6px] w-6 h-6 flex items-center justify-center cursor-pointer"
                    onClick={() => handleIncrement(item._id, item.currentStock)}
                  >
                    +
                  </div>
                  <div className="cursor-pointer" onClick={() => onRemoveItem(item)}>
                    <OutlineTrashIcon color="red" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Discount Section */}
      <div className="mt-8">
        <p className="text-[#495160] text-xs">Discount</p>
        <PosDiscount
          discount={discount}
          discountType={discountType}
          onDiscountChange={setDiscount}
          onDiscountTypeChange={setDiscountType}
        />
      </div>

      {/* Totals */}
      <div className="mt-4 bg-white rounded-lg">
        <div className="flex justify-between items-center">
          <p className="text-xs text-dropdownText font-semibold">Sub total</p>
          <p className="text-sm text-textColor font-semibold">₹ {subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-dropdownText font-semibold">Tax</p>
          <p className="text-sm text-textColor font-semibold">₹ {tax.toFixed(2)}</p>
        </div>
        <hr style={{ borderTop: "2px dashed #CECECE", fontWeight: "lighter" }} className="my-3" />
        <div className="flex justify-between items-center">
          <p className="text-base text-[#2C3E50] font-bold">Total</p>
          <p className="text-base text-[#2C3E50] font-bold">₹ {total.toFixed(2)}</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="w-full mt-8">
        <p className="text-[#495160] text-sm font-semibold">Payment Method</p>
        <div className="flex items-center justify-between mt-3">
      {paymentMethods.map((method) => (
        <div key={method.id} onClick={() => handleMethodSelect(method)}>
          <div
            className={`border w-32 px-[10px] py-2 rounded-lg flex justify-center items-center 
              cursor-pointer border-[#C7CACF] ${selectedMethod === method.id ? "bg-[#DADCCD]" : "bg-[#FFFFFF]"
              }`}
          >
            <div
              className={`p-2 rounded-full ${selectedMethod === method.id ? "bg-[#FFFFFF]" : "bg-[#EBEBEB]"
                }`}
            >
              {method.icon}
            </div>
          </div>
          <p className="text-center text-[#2C3E50] font-semibold text-[10px] mt-1.5">
            {method.label}
          </p>
        </div>
      ))}
    </div>
        <div className="flex justify-between mt-7">
          <Button className="text-sm pl-14 h-10 pr-14" variant="secondary">
            Cancel
          </Button>
          <PosPayment selectedItems={selectedItems} total={total} selectedMethodLabel={selectedMethodLabel} selectedCustomer={selectedCustomer}
          quantities={quantities}
          discountType={discountType} discount={discountValue} discounts={discount} subtotal={subtotal} />
        </div>
      </div>
     </div>
    </div>
  );
}

export default AddItemsPos;

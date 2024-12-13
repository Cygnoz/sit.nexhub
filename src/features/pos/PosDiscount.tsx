import { useState, useEffect } from "react";
import CehvronDown from "../../assets/icons/CehvronDown";

type Props = {
  discount?: number;
  discountType?: string;
  onDiscountChange?: (value: number) => void;
  onDiscountTypeChange?: (type: string) => void;
};

function PosDiscount({
  discount = 0,
  discountType = "%",
  onDiscountChange,
  onDiscountTypeChange,
}: Props) {
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [discountValue, setDiscountValue] = useState<string>(discount.toString());
  const [localDiscountType, setLocalDiscountType] = useState<string>(discountType);

  const handleInputClick = () => {
    setDiscountModalOpen((prev) => !prev);
  };

  const handlePercentageClick = (percentage: string) => {
    const numericValue = percentage.replace("%", ""); 
    setDiscountValue(numericValue);
    setDiscountModalOpen(false); 
  };

  const handleKeypadClick = (value: string) => {
    if (value === "clear") {
      setDiscountValue("");
    } else if (value === "delete") {
      setDiscountValue((prev) => prev.slice(0, -1));
    } else {
      setDiscountValue((prev) => prev + value);
    }
  };

  // Sync local state to parent when the modal closes
  useEffect(() => {
    if (!discountModalOpen) {
      const parsedValue = parseFloat(discountValue) || 0;
      if (onDiscountChange) {
        onDiscountChange(parsedValue);
      }
      if (onDiscountTypeChange) {
        onDiscountTypeChange(localDiscountType);
      }
    }
  }, [discountModalOpen, discountValue, localDiscountType, onDiscountChange, onDiscountTypeChange]);

  return (
    <div className="mt-2 relative">
      {/* Input Field */}
      <div className="flex">
        <input
          type="text"
          className="text-xs w-full rounded-l-md text-start text-[#818894] bg-white border border-slate-300 h-9 p-2 outline-none cursor-pointer"
          placeholder="Enter Discount Amount"
          value={discountValue}
          onClick={handleInputClick} 
          readOnly
        />
        <div className="relative w-20">
          <select
            className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder 
                       text-sm pl-2 pr-2 rounded-r-md leading-tight 
                       focus:outline-none focus:bg-white focus:border-gray-500"
            name="discountType"
            value={localDiscountType}
            onChange={(e) => setLocalDiscountType(e.target.value)}
          >
            <option value="%">%</option>
            <option value="INR">INR</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <CehvronDown color="gray" />
          </div>
        </div>
      </div>

      {/* Discount Modal */}
      {discountModalOpen && (
        <div className="rounded-md p-4">
          {/* Predefined Percentages */}
          <div className="flex gap-2 mb-4">
            {["5%", "10%", "20%", "30%", "40%", "50%"].map((percentage) => (
              <button
                key={percentage}
                className="bg-[#F6F6F6] text-xs border-gray-300 font-medium text-gray-700 py-2 px-4 rounded-md"
                onClick={() => handlePercentageClick(percentage)}
              >
                {percentage}
              </button>
            ))}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 bg-[#F4EFE8] p-6 rounded-lg">
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
      )}
    </div>
  );
}

export default PosDiscount;

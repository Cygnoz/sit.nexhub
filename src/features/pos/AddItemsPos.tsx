import { useState } from "react";
import DebitCardIcon from "../../assets/icons/DebitCardIcon";
import RsIcon from "../../assets/icons/RsIcon";
import UpiIcon from "../../assets/icons/UpiIcon";
import Button from "../../Components/Button";
// import PosDiscount from "./PosDiscount";

type Props = {};

const paymentMethods = [
  { id: 1, label: "Cash", icon: <RsIcon /> },
  { id: 2, label: "Debit Card", icon: <DebitCardIcon /> },
  { id: 3, label: "UPI", icon: <UpiIcon /> },
];

function AddItemsPos({}: Props) {
  const [selectedMethod, setSelectedMethod] = useState<number | null>(1);
  const [count, setCount] = useState<number>(1);

  const handleIncrement = () => setCount((prev) => prev + 1);
  const handleDecrement = () => {
    if (count > 1) setCount((prev) => prev - 1); // Prevent count from going below 1
  };

  const imga =
    "https://s3-alpha-sig.figma.com/img/adbf/47a1/e4cf9bcbe51bf2e2269e437ef4b9fc1e?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FnQgpyawViSDtLKOyUekpS6dA0fzReAzztFYAfjQU3aXl-bthXudtxhPMRVxbVBr5R5di0tT1eTc7rPDBcqkWf3i96Wq5qmn0F9xhviMSseGh4NAoELpvC5wST1uLDqnkH3C1y~Qv0f0371Mk6s7E8Gm6slZrLPKyVIzoMs7i5Cf9YsnR3nqbS4V9AL3yaolGrdNP623ab1Ov1R7c~kK7IUdzJaPF-Jb4t4uHLR910sI2BxRIUfDnWD8h5skHe7sDWeP5jwHfPpIOlYuY97i6Zmlkp~vfU4Gy~pUNaa93ZWSZXVxqmRjSFZ1caaXuFs5fJRv8FNBUGVD09Cyl-IWaA__";

  return (
    <div className="bg-white p-6 mt-3 rounded-lg h-[90%] relative">
      <div className="flex justify-between items-center">
        <p className="text-textColor text-sm font-bold">Selected Item</p>
        <p className="text-dropdownText text-sm font-semibold">
          Order no: 001343
        </p>
      </div>
      <div className="mt-3 bg-[#F6F6F6] p-[10px] rounded-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center w-[60%]">
            <img src={imga} className="w-20 rounded-lg" alt="" />
            <p className="text-dropdownText text-xs font-semibold ms-3">
              Laptop Motherboard Repair
              <br />
              <span className="text-textColor font-bold text-xs block mt-1.5">
                ₹ 1000.00
              </span>
            </p>
          </div>
          <div>
            <div className="flex justify-center items-center gap-5 me-4">
              <div
                className="bg-white rounded-full p-[6px] w-6 h-6 flex items-center justify-center cursor-pointer"
                onClick={handleDecrement}>
                -
              </div>
              <input type="text" value={count} readOnly className="bg-white border border-[#CECECE] p-2 w-12 rounded-lg h-8 text-center text-sm"/>
              <div
                className="bg-white rounded-full p-[6px] w-6 h-6 flex items-center justify-center cursor-pointer"
                onClick={handleIncrement}
              >
                +
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8"> 
        {/* <p className="text-[#495160] text-xs">Discount</p>
        <PosDiscount/> */}
      </div>
      
      <div className="mt-5 bg-white p-4 rounded-lg">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <p className="text-xs text-dropdownText font-semibold">Sub total</p>
            <p className="text-sm text-textColor font-semibold">₹ 1000.00</p>
          </div>
          {/* Tax */}
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-dropdownText font-semibold">Tax</p>
            <p className="text-sm text-textColor font-semibold">₹ 100.00</p>
          </div>
          <hr style={{borderTop:"2px dashed #CECECE",fontWeight:"lighter"}} className="my-3" /> 
          {/* Total */}
          <div className="flex justify-between items-center">
            <p className="text-base text-[#2C3E50] font-bold">Total</p>
            <p className="text-base text-[#2C3E50] font-bold">₹ 1100.00</p>
          </div>
        </div>


      <div className="absolute bottom-0 left-0 w-full px-6 py-4">
        <p className="text-[#495160] text-sm font-semibold">Payment Method</p>
        <div className="flex items-center justify-between mt-3">
          {paymentMethods.map((method) => (
            <div key={method.id} onClick={() => setSelectedMethod(method.id)}>
              <div
                className={`border w-32 px-[10px] py-2 rounded-lg flex justify-center items-center cursor-pointer border-[#C7CACF] ${
                  selectedMethod === method.id? "bg-[#DADCCD]": "bg-[#FFFFFF]"}`}>
                <div
                  className={`p-2 rounded-full ${
                    selectedMethod === method.id? "bg-[#FFFFFF]": "bg-[#EBEBEB]"}`}>
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
          <Button className="text-sm pl-16 h-10 pr-16">Go to Payment</Button>
        </div>
      </div>
    </div>
  );
}

export default AddItemsPos;

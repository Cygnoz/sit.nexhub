import ShoppingCart from "../../assets/Images/shopping-cart_6054136 1.png";
import leftImage from "../../assets/Images/7182239_3582344 1.png";
import Button from "../../Components/Button";
import { useNavigate } from "react-router-dom";
import { useContext, useRef } from "react";
import { PosResponseContext } from "../../context/ContextShare";
import { useReactToPrint } from "react-to-print";

type Props = {};

function PosReceipt({ }: Props) {
  const navigate = useNavigate();
  const { posResponse } = useContext(PosResponseContext)!;

  const handleNavigate = () => {
    navigate("/pos");
  };

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="flex w-[80%] bg-white rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-10">
          <img src={leftImage} className="w-80 mb-8" alt="Left Illustration" />
          <Button onClick={() => reactToPrintFn()}  className="text-sm pl-36 pr-36">Print Receipt</Button>
          <Button
            className="text-sm pl-[150px] pr-[150px] mt-4"
            variant="secondary"
            onClick={handleNavigate}
          >
            New Sales
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex-1 p-10"  ref={contentRef}>
          {posResponse ? (
            <>
              <div className="flex items-center justify-center">
                <img src={ShoppingCart} className="w-16" alt="Shopping Cart" />
              </div>
              <h2 className="text-lg text-center font-semibold text-[#495160] mt-4">
                Paid Successful
              </h2>

              <div className="mb-6 text-[#495160]">
                <div className="flex justify-between">
                  <span className="text-sm">Invoice</span>
                  <span className="text-[#37393A] font-semibold">
                    {posResponse.salesInvoice}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm">Payment</span>
                  <span className="text-[#37393A] font-semibold">{posResponse?.paymentMethod}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-[#37393A] font-semibold">Total Item</h3>
                  <h3 className="text-[#37393A] font-semibold">
                    {posResponse.totalItem} Item{posResponse.totalItem > 1 ? "s" : ""}
                  </h3>
                </div>
                <div className="flex justify-between text-gray-600 mt-2">
                  <span className="text-[#495160] text-sm">Sale Amount</span>
                  <span className="font-semibold text-[#37393A]">
                    ₹ {posResponse.saleAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <hr
                style={{ borderTop: "2px dashed #CECECE", fontWeight: "lighter" }}
                className="my-3"
              />

              <div className="mb-6 text-[#37393A] text-sm space-y-3 font-semibold">
                <div className="flex justify-between text-gray-600">
                  <span>Sub total</span>
                  <span>₹ {posResponse.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹ {posResponse.totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span>₹ {posResponse.totalDiscount.toFixed(2)}</span>
                </div>
              </div>

              <hr
                style={{ borderTop: "2px dashed #CECECE", fontWeight: "lighter" }}
                className="my-3"
              />

              <div className="flex justify-between text-gray-800 font-bold text-lg">
                <span>Total</span>
                <span>₹ {posResponse.totalAmount.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PosReceipt;

import ShoppingCart from "../../assets/Images/shopping-cart_6054136 1.png";
import leftImage from "../../assets/Images/7182239_3582344 1.png";
import Button from "../../Components/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { endponits } from "../../Services/apiEndpoints";
import useApi from "../../Hooks/useApi";

type Props = {};

function PosReceipt({}: Props) {
  const navigate = useNavigate();
  const [lastInvoice, setLastInvoice] = useState<any>(null);
  console.log(lastInvoice);
  
  const { request: getSalesInvoice } = useApi("get", 5007);

  const handleNavigate = () => {
    navigate("/pos");
  };

  const fetchAllInvoices = async () => {
    try {
      const url = `${endponits.GET_ALL_SALES_INVOICE}`;
      const { response, error } = await getSalesInvoice(url);
      if (!error && response) {
        const invoiceData = response.data.updatedInvoices;
        if (invoiceData.length > 0) {
          setLastInvoice(invoiceData[invoiceData.length - 1]); 
        }
      } else {
        console.error(error);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    fetchAllInvoices();
  }, []);

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="flex w-[80%] bg-white rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-10">
          <img src={leftImage} className="w-80 mb-8" alt="Left Illustration" />
          <Button className="text-sm pl-36 pr-36">Print Receipt</Button>
          <Button
            className="text-sm pl-[150px] pr-[150px] mt-4"
            variant="secondary"
            onClick={handleNavigate}
          >
            New Sales
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex-1 p-10">
          {lastInvoice ? (
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
                    {lastInvoice.salesInvoice}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm">Payment</span>
                  <span className="text-[#37393A] font-semibold">Cash</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-[#37393A] font-semibold">Total Item</h3>
                  <h3 className="text-[#37393A] font-semibold">
                    {lastInvoice.totalItem} Item{lastInvoice.totalItem > 1 ? "s" : ""}
                  </h3>
                </div>
                <div className="flex justify-between text-gray-600 mt-2">
                  <span className="text-[#495160] text-sm">Sale Amount</span>
                  <span className="font-semibold text-[#37393A]">
                    ₹ {lastInvoice.saleAmount.toFixed(2)}
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
                  <span>₹ {lastInvoice.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹ {lastInvoice.totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span>₹ {lastInvoice.totalDiscount.toFixed(2)}</span>
                </div>
              </div>

              <hr
                style={{ borderTop: "2px dashed #CECECE", fontWeight: "lighter" }}
                className="my-3"
              />

              <div className="flex justify-between text-gray-800 font-bold text-lg">
                <span>Total</span>
                <span>₹ {lastInvoice.totalAmount.toFixed(2)}</span>
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

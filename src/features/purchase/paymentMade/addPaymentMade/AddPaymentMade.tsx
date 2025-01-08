import { useState } from "react";
import CheveronLeftIcon from "../../../../assets/icons/CheveronLeftIcon";
import BillPayment from "../addPaymentMade/BillPayment"
import { Link } from "react-router-dom";
import SupplierAdvance from "./SupplierAdvance";


type Props = {page?:string}

function AddPaymentMade({page }: Props) {
    const [selectedTab, setSelectedTab] = useState<"billPayment" | "supplierAdvance">("billPayment");

    return (
        <div className="px-8">
            <div className="flex gap-5">
               <Link to={"/purchase/payment-made"}>
               <div className="flex justify-center items-center h-11 w-11 bg-tertiary_main rounded-full">
                    <CheveronLeftIcon /> 
                </div>
               </Link>
               <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor ">Bill Payment</h4>
        </div>

                <div className="rounded-[40px] w-[100%] bg-[#EAEBEB] px-4 py- hidden">
                    <div className="flex gap-2 py-2">
                        <button
                            className={`px-4 py-2 rounded-[30px]  text-sm 
                            ${selectedTab === "billPayment" ? "bg-[#FFFFFF] text-textColor font-bold" : "text-dropdownText font-semibold"}`}
                            onClick={() => setSelectedTab("billPayment")}
                        >
                            <span className="flex items-center justify-center gap-2">
                              Bill Payment
                            </span>
                        </button>
                        <button
                            className={`px-4 py-2 rounded-[30px]  text-sm 
                            ${selectedTab === "supplierAdvance" ? "bg-[#FFFFFF] text-textColor font-bold" : "text-dropdownText font-semibold"}`}
                            onClick={() => setSelectedTab("supplierAdvance")}
                        >
                            <span className="flex items-center justify-center gap-2">
                                Supplier Advance
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Conditionally render components based on selectedTab */}
            <div>
                {selectedTab === "billPayment" ? <BillPayment page={page} /> : <SupplierAdvance />}
            </div>
        </div>
    );
}

export default AddPaymentMade;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentViewTypes from "../../../purchase/debitNote/viewDebitNote/PaymentViewTypes";



type Props = { data?: any };

function SideBar({ data }: Props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    const colorShow = (index: number) => {
        setActiveIndex(index);
    };

    const handleRowClick = (id: string) => {
        const state = { page: "invoice" };
        navigate(`/sales/viewsalesorder/${id}`, { state });
    };


    return (
        <div className="bg-[#F6F6F6] rounded-md px-3 py-6 space-y-4">
            <div>
                <PaymentViewTypes />
            </div>
            {data?.invoice?.map((item: any, index: number) => (
                <div
                    key={index}
                    onClick={() => {
                        colorShow(index);
                        handleRowClick(item.invoiceId);
                    }}
                    className={`text-[#303F58] p-4 rounded-md mb-4 space-y-2 ${activeIndex === index ? "bg-white" : ""
                        } cursor-pointer`}
                >
                    <div className="flex justify-between font-bold">
                        <p>{data?.customerName}</p>
                        <div className="flex justify-end"> <p className="ms-auto">{item?.totalAmount}</p></div>
                    </div>
                    <p>
                        {item?.salesInvoiceDate} | {item?.salesInvoice}
                    </p>
                    <p className="font-bold">Mode: {data?.paymentMode}</p>
                </div>
            ))}
        </div>
    );
}

export default SideBar;

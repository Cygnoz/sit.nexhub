import { useState } from "react";
import Button from "../../Components/Button";
import Modal from "../../Components/model/Modal";
import defaultCustomerImage from "../../assets/Images/Rectangle 5558.png";
import Info from "../../assets/icons/Info";

type Props = {}

function PosPayment({ }: Props) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [paidAmount, setPaidAmount] = useState<string>("");

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleKeypadClick = (value: string) => {
        if (value === "delete") {
            setPaidAmount((prev) => prev.slice(0, -1));
        } else {
            setPaidAmount((prev) => prev + value);
        }
    };

    const handlePredefinedClick = (amount: string) => {
        setPaidAmount(amount.replace("₹ ", ""));
    };

    return (
        <>
            <Button className="text-sm pl-16 h-10 pr-16" onClick={openModal}>
                Go to Payment
            </Button>

            <Modal
                className="w-[45%] px-8 py-4 rounded-2xl"
                open={isModalOpen}
                onClose={closeModal}
            >
                <div className="flex justify-between items-center mb-2">
                    <span className="text-textColor text-base font-bold">Add Sale</span>
                    <p className="text-3xl font-light cursor-pointer" onClick={closeModal}>
                        &times;
                    </p>
                </div>
                <div className="bg-[#F3EFE8] px-4 py-2 rounded-lg flex gap-3">
                    <img
                        src={defaultCustomerImage}
                        className="w-10 h-10 rounded-full"
                        alt=""
                    />
                    <p className="text-[#495160] text-xs">
                        Customer <br />
                        <span className="text-[#37393A] text-xs font-bold">Alwin</span>
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
                <p className="text-dropdownText font-bold text-sm mt-4">1 Items</p>
                <p className="text-dropdownText font-bold text-base mt-2">Total </p>
                <p className="mt-2 font-bold text-2xl text-textColor">₹ 1000.00</p>

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
                    <p className="text-dropdownText text-xl font-bold">₹100</p>
                </div>
                <div className="flex justify-between mt-5 gap-4">
                    <Button className="text-sm pl-28 h-10 pr-28 " variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button className="text-sm pl-32 h-10 pr-32">
                        Submit
                    </Button>
                </div>
            </Modal>
        </>
    );
}

export default PosPayment;

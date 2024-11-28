import { useState } from "react";
import Button from "../../../Components/Button"
import { useNavigate } from "react-router-dom";
import bgImage from "../../../assets/Images/Frame 6.png";
import Modal from "../../../Components/model/Modal";

type Props = { data?: any }

function SendSalesOrder({ data }: Props) {
    const [isModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };
    const handleRowClick = () => {
        navigate(`/sales/invoice/new?id=${data._id}`);};

    return (
        <>
            <Button className="pl-4 pr-4" size="sm" onClick={openModal}>
                <p className="text-sm font-medium">Mark as Confirmed</p>
            </Button>
            <Modal open={isModalOpen} onClose={closeModal} style={{ width: "55%" }}>
                <div className="p-5 ">

                    <div
                        className="mb-5 flex items-center justify-center py-3 rounded-xl bg-CreamBg relative overflow-hidden"
                        style={{
                            backgroundImage: `url(${bgImage})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right center"
                        }}
                    >
                        <div className="relative flex flex-col items-center text-center">
                            <p className="font-bold text-base mt-2 text-textColor">
                                Sales Order Has Been Marked as Confirmed
                            </p>
                        </div>
                        <div
                            className="absolute top-3 right-3 text-3xl cursor-pointer z-10"
                            onClick={closeModal}
                        >
                            <p>&times;</p>
                        </div>
                    </div>


                    <form>
                        <div className="text-center" >

                            <p className="text-textColor px-2 text-sm">
                                Sales Order Has Been Marked as Confirmed would to like to proceed to Invoice

                            </p>

                            <div className="flex justify-center items-center gap-4 my-4 mt-14">
                                <Button variant="primary" size="sm" className="pl-10 pr-10 text-sm" onClick={handleRowClick}>
                                    Yes
                                </Button>
                                <Button onClick={closeModal} variant="secondary" className="pl-10 pr-10 text-sm" size="sm">
                                    No
                                </Button>

                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default SendSalesOrder
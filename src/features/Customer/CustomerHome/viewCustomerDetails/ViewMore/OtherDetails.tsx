import { useContext, useEffect, useState } from "react";
import Modal from "../../../../../Components/model/Modal";
import { CustomerDeatilsContext } from "../../../../../context/ContextShare";

type Props = {}

function OtherDetails({ }: Props) {
    const { customerDatials } = useContext(CustomerDeatilsContext)!;

    useEffect(() => {
        console.log(customerDatials, "data");
    }, [customerDatials]); // Dependency array ensures it logs whenever the context data changes


    const [selectedTab, setSelectedTab] = useState("Other Details");
    const [isModalOpen, setModalOpen] = useState(false);

    const Header = [
        { title: "Other Details", onclick: () => setSelectedTab("Other Details") },
        { title: "Taxes", onclick: () => setSelectedTab("Taxes") },
        { title: "Contact Person", onclick: () => setSelectedTab("Contact Person") },
    ];

    const OtherDetails = [
        {
            icon: "",
            title: "Opening Balance",
            item:"",
        },{
            icon: "",
            title: "PAN",
            item:"",
        },
        {
            icon: "",
            title: "Credit Days",
            item:"",
        },
        {
            icon: "",
            title: "Currency",
            item:"",
        },
        {
            icon: "",
            title: "Payment Terms",
            item:"",
        },
        {
            icon: "",
            title: "Portal Language",
            item:"",
        },
        {
            icon: "",
            title: "Credit Limit",
            item:"",
        },
        {
            icon: "",
            title: "Website URL",
            item:"",
        },
        {
            icon: "",
            title: "Interest Percentage",
            item:"",
        },
        {
            icon: "",
            title: "Documents",
            item:"",
        },
        {
            icon: "",
            title: "Department",
            item:"",
        },
        {
            icon: "",
            title: "Designation",
            item:"",
        },


    ];

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div>
            <button onClick={() => setModalOpen(true)} className=" font-semibold underline">View More</button>
            <Modal
                open={isModalOpen}
                onClose={() => setModalOpen(false)}
                className=""
                style={{ width: "50%" }}
            >
                <div className="gap-6 bg-white px-5  rounded-lg">
                    <div
                        className="ms-auto text-end text-3xl cursor-pointer relative z-10"
                        onClick={closeModal}
                    >
                        &times;
                    </div>
                    <div className="flex max-w-full">

                        {Header.map((item, index) => (
                            <div
                                key={index}
                                className={`rounded-lg w-full text-center my-2 px-3 text-sm py-1.5 cursor-pointer ${selectedTab === item.title ? "bg-lightBeige" : "bg-white"
                                    }`}
                                onClick={item.onclick}
                            >
                                <div className="flex items-center justify-center space-x-2 py-.05"> {/* Flexbox to align horizontally */}
                                    {/* Render the icon */}
                                    <p className="text-sm">{item.title}</p>

                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-span-9">
                        {/* Pass the required props to the Overview component */}
                        {selectedTab === "Other Details" && (
                            <div>
                                <div className="flex-1 h-px bg-[#6c2a1f] ml-1"></div>
                                <div className="text-start grid grid-cols-4 bg-[#F6F6F6] my-3">
                                {
                                    OtherDetails.map((Details)=>(
                                        <div className="py-5 px-5 rounded border-b-2 border-[#E0E0E0]">
                                            <p>22</p>
                                            <p className="text-[#4B5C79] font-400 text-[12px] py-1">{Details.title}</p>
                                            <p className="text-[#303F58] font-bold text-[14px]">ee</p>
                                        </div>
                                    ))
                                }
                                </div>
                            </div>

                        )}
                        {selectedTab === "Taxes" && (
                            // <Overview
                            //   customerData={customerData}
                            //   statusData={statusData}
                            //   customerId={customerId}
                            //   handleStatusSubmit={handleStatusSubmit}
                            // />
                            <h1>Taxes</h1>
                        )}
                        {selectedTab === "Contact Person" && (
                            // <SalesHistory
                            //   customerId={customerId}
                            // />
                            <h1>Person</h1>
                        )}
                    </div>
                </div>
            </Modal>



        </div>
    )
}

export default OtherDetails
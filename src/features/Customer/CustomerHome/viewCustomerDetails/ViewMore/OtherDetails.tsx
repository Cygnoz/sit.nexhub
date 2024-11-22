import { useContext, useEffect, useState } from "react";
import Modal from "../../../../../Components/model/Modal";
import { CustomerDeatilsContext } from "../../../../../context/ContextShare";
import Taxes from "./Taxes";
import ContactPerson from "./ContactPerson";
import Wallet from "../../../../../assets/icons/Wallet";
import CalendarDays from "../../../../../assets/icons/CalendarDays";
import IndianRupee from "../../../../../assets/icons/IndianRupee";
import TeenyIcon from "../../../../../assets/icons/TeenyIcon";
import CalendarCheck from "../../../../../assets/icons/CalendarCheck";
import Languages from "../../../../../assets/icons/Languages";
import RecieptIndianRupee from "../../../../../assets/icons/RecieptIndianRupee";
import Calender from "../../../../../assets/icons/Calender";
import Percent from "../../../../../assets/icons/Percent";
import FileCheck_2 from "../../../../../assets/icons/FileCheck_2";
import UserRoundCog from "../../../../../assets/icons/UserRoundCog";
import User from "../../../../../assets/icons/User";
import line from '../../../../../assets/Images/Rectangle 5557.png'

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
            icon: <Wallet color={"#303F58"} width={17} />,
            title: "Opening Balance",
            item: (customerDatials.debitOpeningBalance ?
                `(Db)  ${customerDatials.debitOpeningBalance}` :
                customerDatials.creditOpeningBalance ?
                    `(Cr)  ${customerDatials.creditOpeningBalance}` :
                    "N/A"),
        }, {
            icon: <TeenyIcon color={"#303F58"} width={17} />,
            title: "PAN",
            item: (customerDatials.pan ? customerDatials.pan : "N/A"),
        },
        {
            icon: <CalendarDays color={"#303F58"} width={16} />,
            title: "Credit Days",
            item: (customerDatials.creditDays ? customerDatials.creditDays : "N/A"),
        },
        {
            icon: <IndianRupee color={"#303F58"} weight={2} />,
            title: "Currency",
            item: (customerDatials.currency ? customerDatials.currency : "N/A"),
        },
        {
            icon: <CalendarCheck color={"#303F58"} width={16} />,
            title: "Payment Terms",
            item: (customerDatials.paymentTerms ? customerDatials.paymentTerms : "N/A"),
        },
        {
            icon: <Languages color={"#303F58"} width={16} />,
            title: "Portal Language",
            item: "N/A",
        },
        {
            icon: <RecieptIndianRupee color={"#303F58"} size={16} height={24} />,
            title: "Credit Limit",
            item: "N/A",
        },
        {
            icon: <Calender color={"#303F58"} width={16} height={20} />,
            title: "Website URL",
            item: (customerDatials.websiteURL ? customerDatials.websiteURL : "N/A"),
        },
        {
            icon: <Percent color={"#303F58"} width={16} />,
            title: "Interest Percentage",
            item: "N/A",
        },
        {
            icon: <FileCheck_2 color={"#303F58"} width={16} />,
            title: "Documents",
            item: "N/A",
        },
        {
            icon: <UserRoundCog color={"#303F58"} size={16} />,
            title: "Department",
            item: (customerDatials.department ? customerDatials.department : "N/A"),
        },
        {
            icon: <User color={"#303F58"} width={16} />,
            title: "Designation",
            item: (customerDatials.designation ? customerDatials.designation : "N/A"),
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
                <div className="gap-6 bg-white px-5 h-[450px] rounded-lg">
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
                                <div >  <img className="w-[100%]  h-[0.5%]" src={line} alt="" /></div>
                                <div className="text-start grid grid-cols-4 bg-[#F6F6F6] my-3">
                                    {
                                        OtherDetails.map((Details) => (
                                            <div className="py-5 px-5 rounded border-b-2 border-[#E0E0E0]">
                                                <p>{Details.icon}</p>
                                                <p className="text-[#4B5C79] font-400 text-[12px] py-1">{Details.title}</p>

                                                <p className="text-[#303F58] font-bold text-[14px] break-words max-w-[200px]">
                                                    {Details.item}
                                                </p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                        )}
                        {selectedTab === "Taxes" && (
                            <Taxes />
                        )}
                        {selectedTab === "Contact Person" && (

                            <ContactPerson />
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default OtherDetails
import { useContext } from "react";
import { SupplierDetailsContext } from "../../../../context/ContextShare";
import User from "../../../../assets/icons/User";
import MailIcon from "../../../../assets/icons/MailIcon";
import Factory from "../../../../assets/icons/Factory";
import PhoneIcon from "../../../../assets/icons/PhoneIcon";

type Props = {}

function ContactPerson({ }: Props) {
    const { supplierDetails } = useContext(SupplierDetailsContext)!;
    console.log(supplierDetails, "supplierDetails");

    const OtherDetails = supplierDetails?.contactPerson?.length
        ? supplierDetails.contactPerson.map((person: any) => ({
            icon: {
                user: <User color={"#303F58"} width={16} />,
                mail: <MailIcon size={14} color={"#303F58"} />,
                mobile: <PhoneIcon size={14} color={"#303F58"} />,
                mobileNo2: <Factory color={"#303F58"} width={14} />,
            },
            Name: person.firstName || "N/A",
            Email: person.email || "N/A",
            PhoneNo: person.mobile || "N/A",
            PhoneNo2: supplierDetails.workPhone || "N/A",
        }))
        : [
            {
                icon: {
                    user: <User color={"#303F58"} width={16} />,
                    mail: <MailIcon size={14} color={"#303F58"} />,
                    mobile: <PhoneIcon size={14} color={"#303F58"} />,
                    mobileNo2: <Factory color={"#303F58"} width={14} />,
                },
                Name: "N/A",
                Email: "N/A",
                PhoneNo: "N/A",
                PhoneNo2: "N/A",
            },
        ];

    return (
        <div>
            <div className="text-start grid grid-cols-1 sm:grid-cols-3 my-3 overflow-y-auto">
                {OtherDetails.map((Details: any, index: number) => (
                    <div
                        key={index}
                        className="py-5 px-5 rounded m-3 bg-[#F6F6F6] space-y-2"
                    >
                        <div className="flex gap-2 mb-2">
                            <span>{Details.icon.user}</span>
                            <p className="mt-1 font-bold">{Details.Name}</p>
                        </div>
                        <div className="flex gap-2">
                            <span>{Details.icon.mail}</span>
                            <p>{Details.Email}</p>
                        </div>
                        <div className="flex gap-2">
                            <span>{Details.icon.mobile}</span>
                            <p>{Details.PhoneNo}</p>
                        </div>
                        <div className="flex gap-2">
                            <span>{Details.icon.mobileNo2}</span>
                            <p className="mt-1">{Details.PhoneNo2}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ContactPerson;
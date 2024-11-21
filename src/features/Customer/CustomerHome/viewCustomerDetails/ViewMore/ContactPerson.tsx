import { useContext } from "react";
import { CustomerDeatilsContext } from "../../../../../context/ContextShare";
import line from '../../../../../assets/Images/Rectangle 5557.png'
import User from "../../../../../assets/icons/User";
import MailIcon from "../../../../../assets/icons/MailIcon";
import PhoneIcon from "../../../../../assets/icons/PhoneIcon";
import Factory from "../../../../../assets/icons/Factory";

type Props = {}

function ContactPerson({ }: Props) {
    const { customerDatials } = useContext(CustomerDeatilsContext)!;
    const OtherDetails = customerDatials?.contactPerson?.map((person:any) => ({
        icon: {
          user: <User color={"#303F58"} width={16} />,
          mail: <MailIcon size={14} color={"#303F58"} />,
          mobile: <PhoneIcon size={14} color={"#303F58"} />,
          mobileNo2: <Factory color={"#303F58"} width={14} />,
        },
        Name: person.firstName || "N/A",
        Email: person.email || "N/A",
        PhoneNo: person.mobile || "N/A",
        PhoneNo2: customerDatials.workPhone || "N/A",
      })) || [];
      
    return (
        <div>
            <div >  <img className="w-[100%]  h-[0.5%]" src={line} alt="" /></div>

            <div className="text-start grid grid-cols-3  my-3">
                {
                    OtherDetails.map((Details:any) => (
                        <div className="py-5 px-5 rounded m-3 bg-[#F6F6F6]  space-y-2">
                            <div className="flex gap-2 mb-2">
                                <span>{ Details.icon.user}</span>
                                <p className="mt-1 font-bold">{Details.Name}</p>
                            </div>
                            <div className="flex gap-2">
                                <span>{ Details.icon.mail}</span>
                                <p className="">{Details.Email}</p>
                            </div>
                            <div className="flex gap-2">
                                <span>{ Details.icon.mobile}</span>
                                <p className="">{Details.PhoneNo}</p>
                            </div>
                            <div className="flex gap-2">
                                <span>{ Details.icon.mobileNo2}</span>
                                <p className="mt-1">{Details.PhoneNo2}</p>
                            </div>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ContactPerson
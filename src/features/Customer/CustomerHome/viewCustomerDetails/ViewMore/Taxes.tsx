import { useContext } from "react";
import { CustomerDeatilsContext } from "../../../../../context/ContextShare";
import line from '../../../../../assets/Images/Rectangle 5557.png'
import HandCoins from "../../../../../assets/icons/HandCoins";
import Dock from "../../../../../assets/icons/Dock";
import Locate from "../../../../../assets/icons/Locate";
import Factory from "../../../../../assets/icons/Factory";

type Props = {}

function Taxes({ }: Props) {
    const { customerDatials } = useContext(CustomerDeatilsContext)!;

    const OtherDetails = [
        {
            icon: <HandCoins color={"#303F58"} width={16}/>,
            title: "GST Treatment ",
            item: (customerDatials.gstTreatment ? customerDatials.gstTreatment : "N/A"),
            
        }, {
            icon: <Dock color={"#303F58"} width={16}/>,
            title: "GSTIN / UIN",
            item: "N/A",
        },
        {
            icon: <Locate color={"#303F58"} width={16}/>,
            title: "Place of Supply",
            item: (customerDatials.placeOfSupply ? customerDatials.placeOfSupply : "N/A"),
        },
        {
            icon: <Factory color={"#303F58"} width={16}/>,
            title: "Business Legal Name",
            item: (customerDatials.businessLegalName ? customerDatials.businessLegalName : "N/A"),
        },
        {
            icon: <Factory color={"#303F58"} width={16}/>,
            title: "Business Trade Name",
            item: (customerDatials.businessTradeName ? customerDatials.businessTradeName : "N/A"),
        },
    ];
    return (
        <div >
            <div >  <img className="w-[100%]  h-[0.5%]" src={line} alt="" /></div>
            <div className="text-start grid grid-cols-3 bg-[#F6F6F6] my-3">
                {
                    OtherDetails.map((Details) => (
                        <div className="py-5 px-5 rounded border-b-2  border-[#E0E0E0]">
                            <p>{Details.icon}</p>
                            <p className="text-[#4B5C79] font-400 text-[12px] py-1">{Details.title}</p>
                            <p className="text-[#303F58]  font-bold text-[14px]">{Details.item}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Taxes
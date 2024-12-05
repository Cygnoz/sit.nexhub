import { useState } from "react";
import serviceImage from "../../../assets/Images/serv.png";
import SearchBar from "../../../Components/SearchBar";
import bgImage from "../../../assets/Images/posservices.png"

type Service = {
    name: string;
    image: string;
};

type ServiceItem = {
    name: string;
    price: number;
    image: string;
};
type Props = {}

function PosProducts({ }: Props) {
    const services: Service[] = [
        { name: "All", image: serviceImage },
        { name: "SmartPhones", image: serviceImage },
        { name: "Laptops", image: serviceImage },
        { name: "Speakers", image: serviceImage },
        { name: "Camera", image: serviceImage },
        { name: "Projectors & Printers", image: serviceImage },
        { name: "Data Storage", image: serviceImage },
        { name: "Computer Accessories", image: serviceImage },
    ];

    const serviceItems: ServiceItem[] = [
        { name: "Laptop Motherboard Repair", price: 1000, image: bgImage },
        { name: "Smartphone Screen Replacement", price: 800, image: bgImage },
        { name: "Home Appliance Repair", price: 900, image: bgImage },
        { name: "TV Screen and Audio Repair", price: 500, image: bgImage },
        { name: "TV Mounting", price: 1000, image: bgImage },
        { name: "Smart Device Installation", price: 1000, image: bgImage },
        { name: "Home Appliance Repair", price: 900, image: bgImage },
        { name: "TV Screen and Audio Repair", price: 500, image: bgImage },
        { name: "TV Mounting", price: 1000, image: bgImage },
        { name: "Smart Device Installation", price: 1000, image: bgImage },
    ];

    const [selectedService, setSelectedService] = useState<string>("All");
    const [searchValue, setSearchValue] = useState<string>("");

    const handleServiceClick = (serviceName: string) => {
        setSelectedService(serviceName);
    };

    return (
        <>
        <div className="flex overflow-x-scroll hide-scrollbar gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => handleServiceClick(service.name)}
              className={`px-2 py-1 rounded-lg flex justify-center gap-2 items-center min-w-max cursor-pointer ${
                selectedService === service.name
                  ? "border border-[#C96E76] bg-[#FAF1F1]"
                  : "bg-white"
              }`}
            >
              <img
                src={service.image}
                className="w-6 h-6 rounded-full"
                alt={service.name}
              />
              <p className={`text-xs font-semibold text-[#2C3E50]`}>
                {service.name}
              </p>
            </div>
          ))}
        </div>
  
        <div className="mt-3  overflow-y-scroll max-h-96 hide-scrollbar">
                 <SearchBar
                   onSearchChange={setSearchValue}
                   searchValue={searchValue}
                   placeholder="Search "
                 />
              <div className="mt-3 grid grid-cols-4 gap-4">
           {serviceItems.map((item, index) => (
             <div
               key={index}
               className="relative rounded-lg p-2 h-[168px] bg-white flex flex-col items-center shadow-sm"
             >
               <img
                 src={item.image}
                 alt={item.name}
                 className="w-44 object-cover rounded-lg mb-2"
               />
               <p className="text-xs font-semibold text-[#2C3E50]">{item.name}</p>
               <div className="absolute bottom-0 left-0 w-full bg-[#DADCCD] p-1 rounded-b-lg">
                 <p className="text-sm font-bold text-[#2C3E50] ms-2">₹{item.price}</p>
               </div>
             </div>
           ))}
         </div>
        </div>
        <div className="mt-5">
          <p className="text-textColor font-bold text-base">Frequently Moving Products</p>
        </div>
      </>
    )
}

export default PosProducts
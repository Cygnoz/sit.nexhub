import AllClients from "../../../assets/Images/All-clients.png";
import Active from "../../../assets/Images/Active clients.png";
import Inactive from "../../../assets/Images/client_5895553 2.png";
// import Duplicate from "../../../assets/Images/duplicate_clients.png";
import { useState } from "react";
import CustomerCard from "./CustomerCard";

interface CardsProps {
  all: number;
  active: number;
  inactive: number;
  duplicate: number;
  onCardClick: (filter: string | null) => void;
}

function CustomerCards({ all, active, inactive, duplicate, onCardClick }: CardsProps) { 
  const customerCardsData = [
    {
      icon: AllClients,
      title: "All Customers",
      description: "Total number of customers",
      number: all,
      filter: null,
    },
    {
      icon: Active,
      title: "Active",
      description: "Active customers",
      number: active,
      filter: "Active",
    },
    {
      icon: Inactive,
      title: "Inactive",
      description: "Inactive customers",
      number: inactive,
      filter: "Inactive",
    },
    {
      icon: Inactive,
      title: "Duplicate",
      description: "Duplicate customer records",
      number: duplicate,
      filter: "Duplicate",
    },
  ];
  
  const [activeCard, setActiveCard] = useState<number | null>(0);

  const handleCardClick = (index: number, filter: string | null) => {
    setActiveCard(index);
    onCardClick(filter);
  };

  return (
    <div className="flex space-x-4 justify-center px-6 mt-2">
      {customerCardsData.map((card, index) => (
        <CustomerCard
          key={index}
          icon={card.icon}
          title={card.title}
          description={card.description}
          number={card.number}
          active={activeCard === index}
          onClick={() => handleCardClick(index, card.filter)}
        />
      ))}
    </div>
  );
}

export default CustomerCards;

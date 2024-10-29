import AllClients from "../../../assets/Images/All-clients.png";
import Active from "../../../assets/Images/Active clients.png";
import Inactive from "../../../assets/Images/client_5895553 2.png";
import { useState } from "react";
import SupplierCard from "./SupplierCard";

interface CardsProps {
  all: number;
  active: number;
  inactive: number;
  duplicate: number;
  onCardClick: (filter: string | null) => void;
}

function Cards({ all, active, inactive, duplicate, onCardClick }: CardsProps) {
  const supplierCardsData = [
    {
      icon: AllClients,
      title: "All Supplier",
      description: "Lorem ipsum dolor sit amet",
      number: all,
      filter: null,
    },
    {
      icon: Active,
      title: "Active",
      description: "Lorem ipsum dolor sit amet",
      number: active,
      filter: "Active",
    },
    {
      icon: Inactive,
      title: "Inactive",
      description: "Lorem ipsum dolor sit amet",
      number: inactive,
      filter: "Inactive",
    },
    {
      icon: Inactive,
      title: "Duplicate",
      description: "Lorem ipsum dolor sit amet",
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
      {supplierCardsData.map((card, index) => (
        <SupplierCard
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

export default Cards;

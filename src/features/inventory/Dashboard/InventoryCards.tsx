import { useState } from "react";
import OrderCards from "./OrderCards";
import toatalInvImage from "../../../assets/Images/product packaging (packaging the product into a box).png";
import totalSalesImage from "../../../assets/Images/processing_2816119 1.png";
import pendingImage from "../../../assets/Images/shopping-bags_3601438 1.png";
import pendingSalesImage from "../../../assets/Images/discount_12707444 1.png";
import CardSkeleton from "../../../Components/skeleton/CardSkeleton";

interface CardData {
  icon: string;
  title: string;
  count: string;
  rating: number; // Numeric change or percentage change
}

interface Props {
  data: {
    totalInventoryValue: number;
    totalSalesValue: number;
    inventoryValueChange: number;
    recentlyAddedItemsCount: number;
    salesValueChange: number;
    underStockItemsCount: number;
  } | null;
}

const InventoryCards: React.FC<Props> = ({ data }) => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setActiveCard(index);
  };

  const cards: CardData[] = data
    ? [
        {
          icon: toatalInvImage,
          title: "Total Inventory Value",
          count: data.totalInventoryValue?.toString() || "N/A",
          rating: data.inventoryValueChange ?? 0,
        },
        {
          icon: totalSalesImage,
          title: "Total Sales Value",
          count: data.totalSalesValue?.toString() || "N/A",
          rating: data.salesValueChange ?? 0,
        },
        {
          icon: pendingImage,
          title: "Recently Added",
          count: data.recentlyAddedItemsCount?.toString() || "N/A",
          rating: 18, // Placeholder value
        },
        {
          icon: pendingSalesImage,
          title: "Under Stock",
          count: data.underStockItemsCount?.toString() || "N/A",
          rating: 10, // Placeholder value
        },
        // Additional card for frequently ordered items
      ]
    : [];

  return (
    <div>
      <div className="flex justify-between w-full space-x-4">
        {cards.length > 0
          ? cards.map((card, index) => (
              <OrderCards
                key={index}
                icon={card.icon}
                title={card.title}
                count={card.count}
                rating={card.rating}
                active={activeCard === index}
                onClick={() => handleCardClick(index)}
              />
            ))
          : Array.from({ length: 4 }).map((_, index) => <CardSkeleton key={index} />)}
      </div>
    </div>
  );
};

export default InventoryCards;

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
  rating: number; // Changed from string to number
}

interface Props {
  data: {
    totalInventoryValue: number;
    totalSaleValue: number;
    turnoverRate: number;
    pendingPurchase: string;
    pendingSales: string;
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

  const cards: CardData[] = data ? [
    {
      icon: toatalInvImage,
      title: "Total Inventory Value",
      count: data.totalInventoryValue.toString(),
      rating: data.inventoryValueChange,
    },
    {
      icon: totalSalesImage,
      title: "Total Sales Value",
      count: data.totalSaleValue.toString(),
      rating: data.salesValueChange,
    },
    {
      icon: pendingImage,
      title: "Recently Added",
      count: data.recentlyAddedItemsCount.toString(),
      rating: 18, // Placeholder; you can make this dynamic if needed
    },
    {
      icon: pendingSalesImage,
      title: "Under Stock",
      count: data.underStockItemsCount.toString(),
      rating: 10, // Placeholder; you can make this dynamic if needed
    },
  ] : [];

  return (
    <div>
      <div className="flex justify-between w-full space-x-4">
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <OrderCards
              key={index}
              icon={card.icon}
              title={card.title}
              count={card.count}
              rating={card.rating} // Pass rating as number
              active={activeCard === index}
              onClick={() => handleCardClick(index)}
            />
          ))
        ) : (
          // Render skeleton loaders when data is loading
          Array.from({ length: 4 }).map((_, index) => ( // Specify the number of skeletons
            <CardSkeleton key={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryCards;

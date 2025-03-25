import ActiveCustomerIcon from "../../../assets/icons/ActiveCustomerIcon";
import CustomerRentationIcon from "../../../assets/icons/CustomerRentationIcon";
import TopCustomerIcon from "../../../assets/icons/TopCustomerIcon";
import TotalSalesIcon from "../../../assets/icons/TotalSalesIcon";
import OrderCards from "./OrderCards";

type Props = {
  data?:any
}

const InventoryCards = ({data}: Props) => {
  console.log("dat",data);
  
  const cards = [
    {
      icon: <TopCustomerIcon/>,
      title: "Total Inventory Value",
      count: data?.totalInventoryValue ||0,
      rating: "12,95",
    },
    {
      icon: <ActiveCustomerIcon/>,
      title: "Total Items In Inventory",
      count: data?.totalItemCount ||0,
      rating: "18,95",
    },
    {
        icon: <CustomerRentationIcon/> ,
        title:"Out of Stock Item",
        count: data?.totalOutOfStock||0,
        rating: "12,95",
    },
    {
        icon:<TotalSalesIcon/> ,
        title: "Recent Items",
        count: data?.newItems ||0,
        rating: "18",
    },
  ];
  return (
    <div>
        <div className="flex-row sm:flex justify-between gap-4 overflow-x-auto">
      {cards.map((card:any, index) => (
        <OrderCards
          key={index}
          icon={card.icon}
          title={card.title}
          count={card.count}
          rating={card.rating}
        />
      ))}
    </div>
    </div>
  )
}

export default InventoryCards
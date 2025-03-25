import ActiveCustomerIcon from "../../../assets/icons/ActiveCustomerIcon";
import CustomerRentationIcon from "../../../assets/icons/CustomerRentationIcon";
import NewCustomerIcon from "../../../assets/icons/NewCustomerIcon";
import TopCustomerIcon from "../../../assets/icons/TopCustomerIcon";
import OrderCards from "./OrderCards"
type Props = {
  data?:any
}

const Cards = ({data}: Props) => {
  console.log("data",data);
  
  const cards = [
    {
      icon: <TopCustomerIcon/>,
      title: "Total Active Suppliers  ",
      count: data?.activeSupplier,
      rating: "12,95",
    },
    {
      icon: <NewCustomerIcon/>,
      title: "Total Spend on Suppliers",
      count: data?.totalSpendOnSupplier,
      rating: "18,95",
    },
    {
        icon: <ActiveCustomerIcon/>,
        title: "Pending Supplier Payments",
        count:data?.pendingSupplierPayments,
        rating: "12,95",
    },
    {
        icon:<CustomerRentationIcon/> ,
        title: "Total Shipments This Month  ",
        count: data?.totalShipments,
        rating: "18",
    }
  ];
  return (
    <div>
        <div className="flex-row sm:flex justify-between overflow-x-auto">
      {cards.map((card, index) => (
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

export default Cards
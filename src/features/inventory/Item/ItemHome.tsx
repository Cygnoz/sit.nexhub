import { useEffect, useState } from "react";
import PlusCircle from "../../../assets/icons/PlusCircle";
import Button from "../../../Components/Button";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import ItemTable from "./ItemTable";
import { Link } from "react-router-dom";
type Props = {};
interface ItemsData {
  itemSettings?: ItemSettings;
}
interface ItemSettings {
  itemDuplicateName: boolean;
  hsnSac: boolean;
  hsnDigits: string;
}
function ItemHome({}: Props) {
  const [itemsData, setItemsData] = useState<ItemsData>({
  });
  const { request: AllItems } = useApi("get", 5003);
  const fetchAllItems = async () => {
    try {
      const url = `${endponits.GET_ALL_ITEMS_Dropdown}`;
      const { response, error } = await AllItems(url);
      if (!error && response) {
        setItemsData(response.data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  useEffect(() => {
    fetchAllItems()
  }, [])
  const hsnsac=itemsData.itemSettings?.hsnSac
  return (
    <div className="mx-5 my-4 text-[#303F58]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Item</h1>
          <p className="text-sm text-gray mt-1">
          Organize item data effortlessly, monitor stock in real-time, and optimize inventory for smooth operations.
          </p>
        </div>
        <Link to="/inventory/Item/new"
          state={{
            hsnSac: hsnsac || false,
          }}>
          <Button variant="primary" size="xl">
            <PlusCircle color="white" />
            <p className="text-sm font-medium">Add Item</p>
          </Button>
        </Link>
      </div>
      <div className="flex flex-col mt-4 gap-2 bg-white rounded-lg p-6">
 
        <div>
          <ItemTable hsnsac={hsnsac} />
        </div>
      </div>
    </div>
  );
}

export default ItemHome;

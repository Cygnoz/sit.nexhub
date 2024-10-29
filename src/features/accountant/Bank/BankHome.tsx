import Ellipsis from "../../../assets/icons/Ellipsis";
import NewBankModal from "./NewBankModal";
import Table from "./Table";

type Props = {};

function BankHome({}: Props) {
  // const [searchValue, setSearchValue] = useState<string>("");
  return (
    <div className="mx-5 my-4  h-[100vh]">
      <div className="flex items-center">
        <div>
          <h3 className="font-bold text-2xl text-textColor">Bank</h3>
          <p className="text-sm text-gray mt-1">
          Providing essential details for managing financial transactions. Manage your banking details securely and efficiently
          </p>
        </div>
        <div className="ml-auto gap-3 flex items-center">
          <NewBankModal />
          <div className="cursor-pointer">
            <Ellipsis />
          </div>
        </div>
        <div></div>
      </div>

      <div className="mt-5 bg-white">
        <div>
          <Table />
        </div>
      </div>
    </div>
  );
}

export default BankHome;

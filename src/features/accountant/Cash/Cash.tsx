
import CreateAccountModal from "./CreateAccountModal";
import Table from "./Table";

type Props = {};

function Cash({}: Props) {
  return (
    <>
      <div className="mx-5 my-4 ">
        <div className="flex items-center">
          <div>
            <h3 className="font-bold text-2xl text-textColor">Cash</h3>
            <p className="text-sm text-gray mt-1">
              Manage your cash asset effectively with detailed insights into
              each account. Allowing for easy identification and organization of
              funds.
            </p>
          </div>
          <div className="ml-auto gap-3 flex items-center">
            <CreateAccountModal />
            <div className="cursor-pointer">
              {/* <Ellipsis /> */}
            </div>
          </div>
          <div></div>
        </div>

        <div className="mt-5 p-6 bg-white px-4 rounded">
          <div className="mt-2">
            <Table />
          </div>
        </div>
      </div>
    </>
  );
}

export default Cash;

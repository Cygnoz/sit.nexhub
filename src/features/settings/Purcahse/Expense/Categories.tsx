import { useState } from "react";
import Booktext from "../../../../assets/icons/Booktext";
import BookopenCheck from "../../../../assets/icons/BookopenCheck";
import BookX from "../../../../assets/icons/BookX";
import SearchBar from "../../../../Components/SearchBar";
import Button from "../../../../Components/Button";
import ListFilter from "../../../../assets/icons/ListFilter";
import Delete from "../../../../assets/icons/Delete";
import Modal from "../../../../Components/model/Modal";
import bgImage from "../../../../assets/Images/14.png"

type Props = {};

const filterList = [
  { title: "All", icon: Booktext },
  { title: "Active", icon: BookopenCheck },
  { title: "Inactive", icon: BookX },
];

const tableHead = ["Category Name", "Description", "Action"];

const data = [
  {
    categoryName: "Advertising And Marketing",
    description:
      "Your expenses on promotional, marketing and advertising activities like banners, web-adds, trade shows, etc. are recorded in advertising and marketing account.",
  },
  {
    categoryName: "Automobile Expense",
    description:
      "Transportation related expenses like fuel charges and maintenance charges for automobiles, are included to the automobile expense account.",
  },
  {
    categoryName: "Bank Fees and Charges",
    description:
      "Any bank fees levied is recorded into the bank fees and charges account. A bank account maintenance fee, transaction charges, a late payment fee are some examples.",
  },
  {
    categoryName: "Other Expense",
    description:
      "Any bank fees levied is recorded into the bank fees and charges account. A bank account maintenance fee, transaction charges, a late payment fee are some examples.",
  },
  {
    categoryName: "Lodging",
    description:
      "Any bank fees levied is recorded into the bank fees and charges account. A bank account maintenance fee, transaction charges, a late payment fee are some examples.",
  },

];

const Categories = ({}: Props) => {
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [searchValue, setSearchValue] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="bg-white p-5 my-4 space-y-5">
      <div className=" gap-3 mt-4 text-xs  grid-flow-col grid">
        {filterList.map((item) => (
          <button
            key={item.title}
            onClick={() => setSelectedTab(item.title)}
            className={` flex border-2 rounded-md justify-center h-9 w-full items-center gap-2
                  ${
                    selectedTab === item.title
                      ? "bg-[#E3E6D5] text-[#585953] border-[#E3E6D5]"
                      : "border-zinc-300 bg-transparent text-textColor"
                  }`}
          >
            {item.icon && (
              <item.icon
                color={selectedTab === item.title ? "#585953" : "#4B5C79"}
                height={15}
                width={15}
              />
            )}
            <span
              className={`font-semibold ${
                selectedTab === item.title ? "#4B5C79" : "text-[#4B5C79]"
              }`}
            >
              {item.title}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <SearchBar
          placeholder="Search"
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
        <Button size="sm" className="text-sm min-w-fit" variant="secondary">
          <ListFilter classname="h-5" color={"currentColor"} />
          Sort By
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white relative pb-4  ">
          <thead className="text-[12px] text-center text-dropdownText ">
            <tr className="bg-lightPink ">
              <th className="py-3  border-b border-tableBorder ">
                <input type="checkbox" className="form-checkbox w-4 h-4" />
              </th>
              {tableHead.map((item, index) => (
                <th
                  className="py-2 px-6 font-medium border-b border-tableBorder relative"
                  key={index}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-dropdownText text-left text-[13px] relative text-sm">
  {data.map((item, index) => (
    <tr className="relative" key={index}>
      <td className="py-5 px-6 border-y border-tableBorder">
        <input type="checkbox" className="form-checkbox w-4 h-4" />
      </td>
      <td className="py-5 px-6 border-y text-center border-tableBorder whitespace-nowrap"  onClick={openModal}>
        {item.categoryName}
      </td>
      <td className="py-5 px-24 border-y border-tableBorder whitespace-pre-wrap">
        {item.description}
      </td>
      <td className="py-5 px-6 border-y border-tableBorder text-center">
        <Delete className="font-bold" color={"currentColor"}  />
      </td>
    </tr>
  ))}
</tbody>


        </table>
      </div>

      <Modal open={isModalOpen} onClose={closeModal}  style={{width:"39%"}}>
          <div className="p-5 mt-3">
            <div className="mb-5 flex p-4 rounded-xl bg-CreamBg relative overflow-hidden">
              <div
                className="absolute top-0 -right-8 w-[178px] h-[89px]"
                style={{
                  backgroundImage: `url(${bgImage})`,
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-textColor">
                 Edit Category
                </h3>
              
              </div>
              <div
                className="ms-auto text-3xl cursor-pointer relative z-10"
                onClick={closeModal}
              >
                &times;
              </div>
            </div>

            <form className="">
              <div className="">
                <div className="mb-3">
                  <label className="block text-sm mb-1 text-labelColor">
                  Category  Name
                  </label>
                  <input
                    type="text"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-10 focus:outline-none focus:bg-white focus:border-darkRed"
                  />
                </div>

                <div className="">
                  <label className="block text-sm mb-1 text-labelColor">
                    Hint <span className="text-neutral-400">(Max 50 chars)</span>
                  </label>
                  <textarea
                    rows={3}
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 focus:outline-none focus:bg-white focus:border-darkRed"
                  />
                </div>
              

                <br />
                <div className="flex justify-end gap-2 mb-3">

                 
                  <Button variant="primary" size="sm">
                    Save
                  </Button>
                   <Button onClick={closeModal} variant="secondary" size="sm">

                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Modal>
    </div>
  );
};

export default Categories;

import React from "react";
import No_Data_found from "../../../assets/Images/NO_DATA.png";
import TableSkelton from "../../../Components/skeleton/Table/TableSkelton";

type Props = {
  dayBookData: any;
  total: any;
  loading: boolean;
};

const DayBookTable = ({ dayBookData, total, loading }: Props) => {
  const tableHeadings = [
    "Date",
    "Transaction Id",
    "Particulars",
    "Voucher Type",
    "Debit Balance",
    "Credit Balance",
  ];

  return (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full bg-white border border-gray-200" style={{ borderColor: '#EAECF0' }}>
        <thead className="bg-[#FDF8F0]">
          <tr>
            {tableHeadings.map((heading, index) => (
              <th
                key={index}
                className="py-3 px-4 text-[#495160] text-center text-xs border border-[#EAECF0]"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(5)].map((_, i) => <TableSkelton key={i} columns={tableHeadings} />)
          ) : dayBookData.length > 1 ? (
            dayBookData.slice(1).map((entry: any, index: any) => (
              <React.Fragment key={index}>
                {entry.entries.map((r: any, subIndex: any) => (
                  <tr key={`${index}-${subIndex}`} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    {subIndex === 0 && (
                      <>
                        <td className="py-2.5 px-4 border border-[#EAECF0] text-sm text-[#495160] text-center" rowSpan={entry.entries.length}>
                          {entry.date}
                        </td>
                        <td className="py-2.5 px-4 border border-[#EAECF0] text-sm text-[#495160] text-center" rowSpan={entry.entries.length}>
                          {entry.transactionId}
                        </td>
                      </>
                    )}
                    <td className="py-3 px-4 border border-[#EAECF0] text-sm text-[#495160] text-center">{r.accountName}</td>
                    <td className="py-3 px-4 border border-[#EAECF0] text-sm text-[#495160] text-center">{r.action}</td>
                    <td className="py-3 px-4 border border-[#EAECF0] text-sm text-[#495160] text-center">{r.debitAmount}</td>
                    <td className="py-3 px-4 border border-[#EAECF0] text-sm text-[#495160] text-center">{r.creditAmount}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-10 text-center">
                <div className="flex justify-center flex-col items-center">
                  <img width={70} src={No_Data_found} alt="No Data Found" />
                  <p className="font-bold text-red-700">No Records Found!</p>
                </div>
              </td>
            </tr>
          )}
          {!loading && dayBookData.length > 1 && (
            <tr className="font-semibold">
              <td className="py-2 px-4 border border-[#EAECF0] text-base text-center text-[#495160]" colSpan={4}>
                Total :
              </td>
              <td className="py-5 px-4 border border-[#EAECF0] text-base text-[#495160] text-center font-bold">
                {total.totalCredit}
              </td>
              <td className="py-5 px-4 border border-[#EAECF0] text-base text-[#495160] text-center font-bold">
                {total.totalDebit}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DayBookTable;

type Props = {
  columns: any[]
}

function TableSkelton({ columns }: Props) {
return (
  <tr>
    {columns.map(( index) => (
      <td key={index} className="py-2.5 px-4 border-y border-tableBorder">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded shimmer"></div>
        </div>
      </td>
    ))}
  </tr>
);
}

export default TableSkelton;

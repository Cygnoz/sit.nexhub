
type Props = { color?: string , height?:number, width?:number, weight?:number};

const IndianRupee = ({color ,weight ,width , height}: Props) => {
  return (
    <div>
      <svg
        width={width?width:"18"}
        height={height?height:"18"}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 3H18M6 8H18M14.5 21L6 13H9C15.667 13 15.667 3 9 3"
          stroke={color?color:"currentColor"}
          strokeWidth={weight?weight:"3"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default IndianRupee;

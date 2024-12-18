type Props = {
  size?:number,
  stroke?:number,
  color?:string
};

const ArrowrightUp = ({size,stroke,color}: Props) => {
  return (
    <div>
      <svg
        width={size||"16"}
        height={size||"16"}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 7H17M17 7V17M17 7L7 17"
          stroke={color||"currentColor"}
          strokeWidth={stroke||"2"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ArrowrightUp;

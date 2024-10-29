type Props = {
  size?: number;
  color?: string;
  className?: string;
  stroke?:number
};

function ArrowDownIcon({ size = 24, color = "black", className = "",stroke }: Props) {
  return (
    <div className={className}>
<svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 17V3M12 17L6 11M12 17L18 11M19 21H5"
        stroke={color}
        strokeWidth={stroke||"3"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    </div>
  );
}

export default ArrowDownIcon;


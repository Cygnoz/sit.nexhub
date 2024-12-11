type Props = { color: string, size?:any };

function DotIcon({ color, size }: Props) {
  return (
    <svg
      width={size?size:"6"}
      height={size?size:"6"}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="6"
        stroke={color}
        strokeWidth="12"
        fill="none"
      />
    </svg>
  );
}

export default DotIcon;

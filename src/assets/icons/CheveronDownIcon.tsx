type Props = { color: string, strokeWidth?: any };

function CheveronDownIcon({ color, strokeWidth }: Props) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke={color}
        strokeWidth={strokeWidth ? strokeWidth : "4"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default CheveronDownIcon;

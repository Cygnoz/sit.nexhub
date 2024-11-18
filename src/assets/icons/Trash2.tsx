import React from 'react';

interface Trash2Props {
  color?: string;
  size?: number;
  onClick?: () => void;
  className?: string;
}

const Trash2: React.FC<Trash2Props> = ({ color, size, onClick, className }) => {
  return (
    <svg
      width={size || "12"}
      height={size || "12"}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={className}
    >
      <path
        d="M3 6H21M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Trash2;

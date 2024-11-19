import React from 'react';

interface CheveronLeftIconProps {
  color?: string;
}

const CheveronLeftIcon: React.FC<CheveronLeftIconProps> = ({ color = '#808080' }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 6L9 12L15 18"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheveronLeftIcon;

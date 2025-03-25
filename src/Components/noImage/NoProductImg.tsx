import React from "react";

interface NoProductImgProps {
  size?: number;
}

const NoProductImg: React.FC<NoProductImgProps> = ({ size = 100 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circular background */}
      <circle cx="50" cy="50" r="50" fill="#E5E7EB" />

      {/* Camera icon */}
      <path
        d="M50 37C43.37 37 38 42.37 38 49C38 55.63 43.37 61 50 61C56.63 61 62 55.63 62 49C62 42.37 56.63 37 50 37ZM50 57C45.58 57 42 53.42 42 49C42 44.58 45.58 41 50 41C54.42 41 58 44.58 58 49C58 53.42 54.42 57 50 57ZM65 31H59.59L57.29 28.71C56.9 28.32 56.37 28 55.83 28H44.17C43.63 28 43.1 28.32 42.71 28.71L40.41 31H35C33.9 31 33 31.9 33 33V65C33 66.1 33.9 67 35 67H65C66.1 67 67 66.1 67 65V33C67 31.9 66.1 31 65 31ZM63 63H37V35H42.5L45.5 32H54.5L57.5 35H63V63Z"
        fill="#9CA3AF"
      />
    </svg>
  );
};

export default NoProductImg;

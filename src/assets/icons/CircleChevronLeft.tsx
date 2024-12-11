type Props = {
  className?: string;
};

const CircleChevronLeft: React.FC<Props> = ({ className }) => {
  return (
    <div>
      <svg
      className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          strokeWidth="1"
          stroke-linecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default CircleChevronLeft;

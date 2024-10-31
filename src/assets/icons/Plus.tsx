type Props = { color: string ,classname?:string};

const Plus = ({ color ,classname}: Props) => {
  return (
    <div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={classname}
      >
        <path
          d="M5 12H19M12 5V19"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default Plus;

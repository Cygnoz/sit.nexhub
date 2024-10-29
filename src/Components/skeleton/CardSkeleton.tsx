
const CardSkeleton = () => {
  return (
    <div className="w-full p-7 rounded-lg shadow-md animate-pulse bg-neutral-200 ">
      <div className="h-12 w-12 bg-gray-300 rounded-full mb-2 animate-bounce bg-slate-300"></div>
      <div className="h-5 w-4/5 bg-gray-300 rounded mb-1 bg-slate-300"></div>
      <div className="h-4 w-3/5 bg-gray-300 rounded bg-slate-300"></div>
    </div>
  );
};

export default CardSkeleton;

const LayoutSkeleton = () => {
  return (
    <div className="flex animate-pulse">
      <aside className="bg-primary_main h-[100vh] w-[72px]">
        <nav>
          <div className="flex justify-between items-center px-6 pt-7 pb-5">
            <div className="bg-gray-300 h-8 w-8 rounded-full"></div>
          </div>
        </nav>
      </aside>
      <div className="w-[100%] bg-">
        <div
          className="p-4 flex items-center gap-2 w-full border-b-slate-400 border-y-orange-200"
          style={{ borderBottom: "1.5px solid rgba(28, 28, 28, 0.1)" }}
        >
          <div className="w-[68%]">
            <div className="bg-gray-300 h-10 rounded w-full"></div>
          </div>
          <div className="flex ms-8 justify-center items-center gap-2">
            <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
            <span className="text-xs font-semibold text-dropdownText whitespace-nowrap bg-gray-300 h-4 w-20"></span>
          </div>
          <div className="flex items-center gap-4 ml-auto"></div>
        </div>
        <div className="bg-BgSubhead flex mx-7 justify-between px-5 py-3 my-4  items-center rounded-full">
          <div className="bg-gray-300 h-8 rounded w-1/4 mb-4"></div>
          <div className="bg-gray-300 h-4 rounded w-1/2 mb-2"></div>
          <div className="bg-gray-300 h-4 rounded w-1/2 mb-2"></div>
          <div className="bg-gray-300 h-4 rounded w-1/2 mb-2"></div>
          <div className="bg-gray-300 h-4 rounded w-1/2 mb-2"></div>
        </div>
      </div>
    </div>
  );
};

export default LayoutSkeleton;

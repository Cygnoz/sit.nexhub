import React from "react";
import CycleChevronRight from "../../assets/icons/CycleChevronRight";
import CircleChevronLeft from "../../assets/icons/CircleChevronLeft";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      setTimeout(() => {
        onPageChange(page);
      }, 300);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers: JSX.Element[] = [];

    // Always show the first page
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageClick(1)}
          className={`px-3 py-1 text-sm rounded transition duration-200 transform hover:scale-105 ${
            currentPage === 1
              ? "bg-[darkred] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          1
        </button>
      );
    }

    if (currentPage > 3) {
      pageNumbers.push(<span key="dots-start" className="text-textColor">...</span>);
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let page = startPage; page <= endPage; page++) {
      if (page !== 1 && page !== totalPages) {
        pageNumbers.push(
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`px-3 py-1 text-sm rounded transition duration-200 transform hover:scale-105 ${
              page === currentPage
                ? "bg-[darkred] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        );
      }
    }

    // Show dots if necessary
    if (currentPage < totalPages - 3) {
      pageNumbers.push(<span key="dots-end" className="text-textColor">...</span>);
    }

    // Always show the last page
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          className={`px-3 py-1 text-sm rounded transition duration-200 transform hover:scale-105 ${
            currentPage === totalPages
              ? "bg-[darkred] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center space-x-2 mt-4">
        {/* Left Chevron Button */}
        {currentPage > 1 && (
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition duration-200"
          >
            <CircleChevronLeft className="text-textColor" />
          </button>
        )}

        {/* Render Page Numbers */}
        <div className="flex items-center space-x-1">
          {renderPageNumbers()}
        </div>

        {/* Right Chevron Button */}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition duration-200"
          >
            <CycleChevronRight className="text-textColor" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;

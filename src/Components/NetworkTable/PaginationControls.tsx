import { useNetwork } from "../../state/network/Context";
import { Button } from "../Common/Button";

interface PaginationControlsProps {
  className?: string;
}

export function PaginationControls({ className = "" }: PaginationControlsProps) {
  const { pagination, paginationCallbacks } = useNetwork();

  if (!pagination || !paginationCallbacks) {
    return null;
  }

  const {
    currentPage = 1,
    totalPages = 1,
    hasNextPage = false,
    hasPreviousPage = false,
    isLoading = false,
    totalItems = 0,
    pageSize = 0,
  } = pagination;

  const { onNextPage, onPreviousPage, onPageChange } = paginationCallbacks;

  const handlePrevious = () => {
    if (hasPreviousPage && !isLoading && onPreviousPage) {
      onPreviousPage();
    }
  };

  const handleNext = () => {
    if (hasNextPage && !isLoading && onNextPage) {
      onNextPage();
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && !isLoading && onPageChange) {
      onPageChange(page);
    }
  };

  // Calculate page range to show (show up to 5 page numbers)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Calculate range of items shown
  const startItem = totalItems > 0 ? (currentPage - 1) * (pageSize || 0) + 1 : 0;
  const endItem = Math.min(currentPage * (pageSize || 0), totalItems);

  return (
    <div
      className={`flex items-center justify-between px-m py-xs ${className}`}
      data-testid="pagination-controls"
    >
      <div className="flex items-center gap-xs text-h6 text-brand-primary-gray">
        {totalItems > 0 && (
          <span>
            Showing {startItem}-{endItem} of {totalItems}
          </span>
        )}
      </div>

      <div className="flex items-center gap-xs">
        <Button
          onClick={handlePrevious}
          disabled={!hasPreviousPage || isLoading}
          data-testid="pagination-previous"
          className="px-s py-xs"
        >
          Previous
        </Button>

        <div className="flex items-center gap-xxs">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-xs text-brand-primary-gray"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <Button
                key={pageNum}
                onClick={() => handlePageClick(pageNum)}
                disabled={isLoading}
                data-testid={`pagination-page-${pageNum}`}
                className={`px-xs py-xs min-w-[32px] ${
                  isActive
                    ? "bg-brand-primary-blue text-white"
                    : "bg-transparent hover:bg-bg-gray-80"
                }`}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          onClick={handleNext}
          disabled={!hasNextPage || isLoading}
          data-testid="pagination-next"
          className="px-s py-xs"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

type PaginationControlsProps = {
  currentPage: number;
  totalCount: number;
  loading: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
};

const PaginationControls = ({
  currentPage,
  totalCount,
  loading,
  hasNextPage,
  onPageChange,
}: PaginationControlsProps) => {
  return (
    <div className="mt-6 flex items-center justify-between">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="px-4 py-2 bg-(--color-secondary) text-white rounded-md hover:bg-(--color-tertiary) disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <span className="text-sm text-gray-300">
        Page {currentPage} of {Math.ceil(totalCount / 10)}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage || loading}
        className="px-4 py-2 bg-(--color-secondary) text-white rounded-md hover:bg-(--color-tertiary) disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;

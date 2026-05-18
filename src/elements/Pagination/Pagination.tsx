import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage,
                                                   totalPages,
                                                   onPageChange,
                                                   disabled = false
                                               }) => {
    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (currentPage > 1 && !disabled) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages && !disabled) {
            onPageChange(currentPage + 1);
        }
    };

    // Generate page numbers array
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="pagination-container">
            <button
                type="button"
                onClick={handlePrev}
                disabled={currentPage === 1 || disabled}
                className="pagination-button pagination-button--arrow"
            >
                &laquo; Prev
            </button>

            <div className="pagination-pages">
                {pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => !disabled && onPageChange(page)}
                        disabled={disabled}
                        className={`pagination-button ${
                            currentPage === page ? 'pagination-button--active' : ''
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                type="button"
                onClick={handleNext}
                disabled={currentPage === totalPages || disabled}
                className="pagination-button pagination-button--arrow"
            >
                Next &raquo;
            </button>
        </div>
    );
};

export default Pagination;
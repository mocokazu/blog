import Link from 'next/link';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const pageNumbers = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const getPageHref = (page: number) => {
    return page === 1 ? basePath : `${basePath}/page/${page}`;
  };

  return (
    <nav className="flex items-center justify-center space-x-1">
      <Link
        href={getPageHref(Math.max(1, currentPage - 1))}
        className={`p-2 rounded-md ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="前へ"
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : undefined}
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      {startPage > 1 && (
        <>
          <Link
            href={getPageHref(1)}
            className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100"
          >
            1
          </Link>
          {startPage > 2 && (
            <span className="px-1 py-1 text-gray-500">
              <MoreHorizontal className="w-5 h-5" />
            </span>
          )}
        </>
      )}

      {pageNumbers.map((page) => (
        <Link
          key={page}
          href={getPageHref(page)}
          className={`px-3 py-1 rounded-md ${
            page === currentPage
              ? 'bg-primary-600 text-white font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Link>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-1 py-1 text-gray-500">
              <MoreHorizontal className="w-5 h-5" />
            </span>
          )}
          <Link
            href={getPageHref(totalPages)}
            className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {totalPages}
          </Link>
        </>
      )}

      <Link
        href={getPageHref(Math.min(totalPages, currentPage + 1))}
        className={`p-2 rounded-md ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        aria-label="次へ"
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : undefined}
      >
        <ChevronRight className="w-5 h-5" />
      </Link>
    </nav>
  );
}

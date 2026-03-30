import ReactPaginate from 'react-paginate'
import css from './Pagination.module.css'

interface PaginationProps {
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
}

interface PageChangeEvent {
  selected: number
}

export default function Pagination({
  currentPage,
  pageCount,
  onPageChange,
}: PaginationProps) {
  const handlePageChange = ({ selected }: PageChangeEvent) => {
    onPageChange(selected + 1)
  }

  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      onPageChange={handlePageChange}
      forcePage={currentPage - 1}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  )
}

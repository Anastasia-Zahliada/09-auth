'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import NoteList from '@/components/NoteList/NoteList'
import Pagination from '@/components/Pagination/Pagination'
import SearchBox from '@/components/SearchBox/SearchBox'
import { fetchNotes } from '@/lib/api/notes'
import type { NoteTag } from '@/types/note'
import css from '../../NotesPage.module.css'

const PER_PAGE = 12

interface NotesClientProps {
  tag?: NoteTag
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(inputValue.trim())
      setPage(1)
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [inputValue])

  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ['notes', page, search, tag ?? 'all'],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search, tag }),
    placeholderData: keepPreviousData,
  })

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage)
  }

  const notes = data?.notes ?? []
  const totalPages = data?.totalPages ?? 0
  const showInitialLoader = isPending && !data
  const showNotes = !isError && notes.length > 0

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={setInputValue} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            pageCount={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {showInitialLoader && <p>Loading, please wait...</p>}
      {isError && <p>Something went wrong.</p>}
      {showNotes && <NoteList notes={notes} />}
      {!isError && !showInitialLoader && notes.length === 0 && (
        <p>No notes found.</p>
      )}
      {isFetching && !showInitialLoader && <p>Loading, please wait...</p>}
    </main>
  )
}

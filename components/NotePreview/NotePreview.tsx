'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchNoteById } from '@/lib/api/notes'
import css from './NotePreview.module.css'

interface NotePreviewProps {
  id: string
}

export default function NotePreview({ id }: NotePreviewProps) {
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: Boolean(id),
    refetchOnMount: false,
  })

  if (isLoading) {
    return <p>Loading, please wait...</p>
  }

  if (error || !note) {
    return <p>Something went wrong.</p>
  }

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.tag}>{note.tag}</p>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          {new Date(note.createdAt).toLocaleDateString('en-GB')}
        </p>
      </div>
    </div>
  )
}

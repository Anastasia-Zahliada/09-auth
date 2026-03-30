'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal/Modal'
import { fetchNoteById } from '@/lib/api/notes'
import css from '@/components/NotePreview/NotePreview.module.css'

interface NotePreviewClientProps {
  id: string
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter()
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

  return (
    <Modal onClose={() => router.back()}>
      {isLoading && <p>Loading, please wait...</p>}
      {(error || !note) && !isLoading && <p>Something went wrong.</p>}
      {note && (
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
      )}
    </Modal>
  )
}

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteNote } from '@/lib/api/clientApi'
import type { Note } from '@/types/note'
import css from './NoteList.module.css'

interface NoteListProps {
  notes: Note[]
}

export default function NoteList({ notes }: NoteListProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      setError('')
      await queryClient.invalidateQueries({ queryKey: ['notes'] })
      router.refresh()
    },
    onError: () => {
      setError('Could not delete the note.')
    },
  })

  return (
    <>
      <ul className={css.list}>
        {notes.map((note) => (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <Link href={`/notes/${note.id}`} className={css.link}>
                View details
              </Link>
              <button
                className={css.button}
                type="button"
                onClick={() => deleteNoteMutation.mutate(note.id)}
                disabled={deleteNoteMutation.isPending}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {error && <p>{error}</p>}
    </>
  )
}

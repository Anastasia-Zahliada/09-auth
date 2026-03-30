'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type ChangeEvent } from 'react'
import { createNote } from '@/lib/api/notes'
import { initialDraft, useNoteStore } from '@/lib/store/noteStore'
import { NOTE_TAGS, type NoteDraft, type NoteTag } from '@/types/note'
import css from './NoteForm.module.css'

export default function NoteForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const draft = useNoteStore((state) => state.draft)
  const setDraft = useNoteStore((state) => state.setDraft)
  const clearDraft = useNoteStore((state) => state.clearDraft)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      clearDraft()
      router.back()
    },
  })

  const formValues = isHydrated ? draft : initialDraft

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target

    setDraft({ [name]: value } as Partial<NoteDraft>)
  }

  const handleSubmit = async (formData: FormData) => {
    await createNoteMutation.mutateAsync({
      title: String(formData.get('title') ?? '').trim(),
      content: String(formData.get('content') ?? '').trim(),
      tag: String(formData.get('tag') ?? 'Todo') as NoteTag,
    })
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <form className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={formValues.title}
          minLength={3}
          maxLength={50}
          required
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={formValues.content}
          maxLength={500}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={formValues.tag}
          onChange={handleChange}
        >
          {NOTE_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          formAction={handleSubmit}
          disabled={createNoteMutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  )
}

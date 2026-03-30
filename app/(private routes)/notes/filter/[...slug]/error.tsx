'use client'

interface FilterNotesErrorProps {
  error: Error
}

export default function FilterNotesError({ error }: FilterNotesErrorProps) {
  return <p>Could not fetch the list of notes. {error.message}</p>
}

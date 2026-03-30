'use client'

import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal/Modal'
import NotePreview from './NotePreview'

interface NotePreviewModalProps {
  id: string
}

export default function NotePreviewModal({ id }: NotePreviewModalProps) {
  const router = useRouter()

  return (
    <Modal onClose={() => router.back()}>
      <NotePreview id={id} />
    </Modal>
  )
}

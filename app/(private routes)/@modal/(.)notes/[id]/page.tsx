import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { cookies } from 'next/headers'
import { fetchNoteById } from '@/lib/api/serverApi'
import NotePreviewClient from './NotePreview.client'

interface NotePreviewModalPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function NotePreviewModalPage({
  params,
}: NotePreviewModalPageProps) {
  const { id } = await params
  const cookieStore = await cookies()
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id, cookieStore.toString()),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  )
}

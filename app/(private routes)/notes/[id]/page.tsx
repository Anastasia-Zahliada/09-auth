import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { fetchNoteById } from '@/lib/api/serverApi'
import NoteDetailsClient from './NoteDetails.client'
import css from './NoteDetails.module.css'

interface NoteDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params
  const cookieStore = await cookies()
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id, cookieStore.toString()),
  })

  return (
    <main className={css.main}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient />
      </HydrationBoundary>
    </main>
  )
}

export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params
  const cookieStore = await cookies()
  const note = await fetchNoteById(id, cookieStore.toString())
  const description =
    note.content.trim().slice(0, 160) ||
    `Open the "${note.title}" note in NoteHub.`

  return {
    title: `${note.title} | NoteHub`,
    description,
    openGraph: {
      title: `${note.title} | NoteHub`,
      description,
      url: `/notes/${id}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  }
}

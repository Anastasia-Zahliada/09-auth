import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchNotes } from '@/lib/api/notes'
import { NOTE_TAGS, type NoteTag } from '@/types/note'
import NotesClient from './Notes.client'

const PER_PAGE = 12

interface FilterNotesPageProps {
  params: Promise<{
    slug: string[]
  }>
}

const getTagFromSlug = (slug: string[]): NoteTag | undefined => {
  if (slug.length !== 1) {
    notFound()
  }

  const [tag] = slug

  if (tag === 'all') {
    return undefined
  }

  if (NOTE_TAGS.includes(tag as NoteTag)) {
    return tag as NoteTag
  }

  notFound()
}

export default async function FilterNotesPage({
  params,
}: FilterNotesPageProps) {
  const { slug } = await params
  const tag = getTagFromSlug(slug)
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag ?? 'all'],
    queryFn: () => fetchNotes({ page: 1, perPage: PER_PAGE, search: '', tag }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  )
}

export async function generateMetadata({
  params,
}: FilterNotesPageProps): Promise<Metadata> {
  const { slug } = await params
  const tag = getTagFromSlug(slug)
  const selectedFilter = tag ?? 'All'

  return {
    title: `${selectedFilter} Notes | NoteHub`,
    description: `Browse NoteHub notes filtered by ${selectedFilter}.`,
    openGraph: {
      title: `${selectedFilter} Notes | NoteHub`,
      description: `Browse NoteHub notes filtered by ${selectedFilter}.`,
      url: `/notes/filter/${tag ?? 'all'}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  }
}

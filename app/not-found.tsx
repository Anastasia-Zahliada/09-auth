import type { Metadata } from 'next'
import css from './not-found.module.css'

export const metadata: Metadata = {
  title: 'Page Not Found | NoteHub',
  description: 'The NoteHub page you are looking for does not exist.',
  openGraph: {
    title: 'Page Not Found | NoteHub',
    description: 'The NoteHub page you are looking for does not exist.',
    url: '/not-found',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
}

export default function NotFound() {
  return (
    <main>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </main>
  )
}

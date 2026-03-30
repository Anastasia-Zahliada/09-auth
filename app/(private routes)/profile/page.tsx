import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getMe } from '@/lib/api/serverApi'
import css from './ProfilePage.module.css'

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'View your NoteHub profile details.',
  openGraph: {
    title: 'Profile | NoteHub',
    description: 'View your NoteHub profile details.',
    url: '/profile',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
}

export default async function ProfilePage() {
  try {
    const cookieStore = await cookies()
    const user = await getMe(cookieStore.toString())

    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <div className={css.header}>
            <h1 className={css.formTitle}>Profile Page</h1>
            <Link href="/profile/edit" className={css.editProfileButton}>
              Edit Profile
            </Link>
          </div>
          <div className={css.avatarWrapper}>
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          </div>
          <div className={css.profileInfo}>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
          </div>
        </div>
      </main>
    )
  } catch {
    redirect('/sign-in')
  }
}

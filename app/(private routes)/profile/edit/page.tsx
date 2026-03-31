'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getErrorMessage, getMe, updateMe } from '@/lib/api/clientApi'
import { useAuthStore } from '@/lib/store/authStore'
import css from './EditProfilePage.module.css'

export default function EditProfilePage() {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const { data: user, isPending } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  })

  const updateProfileMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedUser) => {
      setUser(updatedUser)
      router.push('/profile')
      router.refresh()
    },
    onError: (mutationError) => {
      setError(getErrorMessage(mutationError))
    },
  })

  useEffect(() => {
    if (user) {
      setUsername(user.username)
    }
  }, [user])

  const handleSubmit = async (formData: FormData) => {
    setError('')

    await updateProfileMutation.mutateAsync({
      username: String(formData.get('username') ?? '').trim(),
    })
  }

  if (isPending || !user) {
    return <p>Loading, please wait...</p>
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} action={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={updateProfileMutation.isPending}
            >
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
          <p>{error}</p>
        </form>
      </div>
    </main>
  )
}

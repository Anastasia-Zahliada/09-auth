'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { getErrorMessage, login } from '@/lib/api/clientApi'
import { useAuthStore } from '@/lib/store/authStore'
import css from './SignInPage.module.css'

export default function SignInPage() {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const [error, setError] = useState('')

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setUser(user)
      router.push('/profile')
      router.refresh()
    },
    onError: (mutationError) => {
      setError(getErrorMessage(mutationError))
    },
  })

  const handleSubmit = async (formData: FormData) => {
    setError('')

    await loginMutation.mutateAsync({
      email: String(formData.get('email') ?? '').trim(),
      password: String(formData.get('password') ?? '').trim(),
    })
  }

  return (
    <main className={css.mainContent}>
      <form className={css.form}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            formAction={handleSubmit}
            disabled={loginMutation.isPending}
          >
            Log in
          </button>
        </div>

        <p className={css.error}>{error}</p>
      </form>
    </main>
  )
}

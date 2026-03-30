import type { AxiosError } from 'axios'
import { api } from './api'
import type { Note, NoteTag } from '@/types/note'
import type { User } from '@/types/user'

interface AuthCredentials {
  email: string
  password: string
}

interface SessionResponse {
  success: boolean
}

export interface FetchNotesParams {
  page: number
  perPage: number
  search?: string
  tag?: NoteTag
}

export interface FetchNotesResponse {
  notes: Note[]
  totalPages: number
}

export interface CreateNotePayload {
  title: string
  content: string
  tag: NoteTag
}

interface UpdateProfilePayload {
  username: string
}

export const getErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<{
    message?: string
    error?: string
    response?: { message?: string }
  }>

  return (
    axiosError.response?.data?.response?.message ??
    axiosError.response?.data?.message ??
    axiosError.response?.data?.error ??
    axiosError.message ??
    'Something went wrong.'
  )
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
  })

  return response.data
}

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`)

  return response.data
}

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const response = await api.post<Note>('/notes', payload)

  return response.data
}

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`)

  return response.data
}

export const register = async (credentials: AuthCredentials): Promise<User> => {
  const response = await api.post<User>('/auth/register', credentials)

  return response.data
}

export const login = async (credentials: AuthCredentials): Promise<User> => {
  const response = await api.post<User>('/auth/login', credentials)

  return response.data
}

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
}

export const checkSession = async (): Promise<boolean> => {
  const response = await api.get<SessionResponse>('/auth/session')

  return response.data.success
}

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me')

  return response.data
}

export const updateMe = async (
  payload: UpdateProfilePayload
): Promise<User> => {
  const response = await api.patch<User>('/users/me', payload)

  return response.data
}

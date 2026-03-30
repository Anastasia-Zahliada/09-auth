import type { AxiosResponse } from 'axios'
import { notehubApi, getHeaders } from './client'
import type { Note, NoteTag } from '@/types/note'

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

export interface DeleteNoteResponse {
  id: string
  title: string
  content: string
  tag: NoteTag
  createdAt: string
  updatedAt: string
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> =
    await notehubApi.get<FetchNotesResponse>('/notes', {
      headers: getHeaders(),
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
  const response: AxiosResponse<Note> = await notehubApi.get<Note>(
    `/notes/${id}`,
    {
      headers: getHeaders(),
    }
  )

  return response.data
}

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const response: AxiosResponse<Note> = await notehubApi.post<Note>(
    '/notes',
    payload,
    {
      headers: getHeaders(),
    }
  )

  return response.data
}

export const deleteNote = async (id: string): Promise<DeleteNoteResponse> => {
  const response: AxiosResponse<DeleteNoteResponse> =
    await notehubApi.delete<DeleteNoteResponse>(`/notes/${id}`, {
      headers: getHeaders(),
    })

  return response.data
}

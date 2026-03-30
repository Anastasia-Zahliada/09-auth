import axios from 'axios'

const API_URL = 'https://notehub-public.goit.study/api'

export const notehubApi = axios.create({
  baseURL: API_URL,
})

const getToken = () => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN

  if (!token) {
    throw new Error('Missing NEXT_PUBLIC_NOTEHUB_TOKEN environment variable')
  }

  return token
}

export const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
})

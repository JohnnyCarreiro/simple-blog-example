import axios from 'axios'

export const api = axios.create({
  baseURL: String(process.env.PRODUCTION_URL)
})

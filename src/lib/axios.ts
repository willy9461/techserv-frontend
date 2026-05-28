import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // necesario para que el navegador envíe y reciba las cookies JWT
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axiosInstance
const {
  APP_HOST, APP_PORT, APP_SERVER_PORT, APP_PROTOCOL,
  APP_API_PREFIX, APP_PUBLIC_URL,
} = process.env

export const PROTOCOL = APP_PROTOCOL || 'http'
export const HOST = APP_HOST || 'localhost'
export const PORT = Number(APP_PORT) || 3000
export const SERVER_PORT = Number(APP_SERVER_PORT) || 8000
export const API_PREFIX = APP_API_PREFIX
export const PUBLIC_URL = APP_PUBLIC_URL || ''

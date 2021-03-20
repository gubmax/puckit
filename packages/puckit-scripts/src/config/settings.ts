function getSettings() {
  const {
    APP_HOST, APP_PORT, APP_SERVER_PORT, APP_PROTOCOL, APP_PUBLIC_URL,
  } = process.env

  return {
    PROTOCOL: APP_PROTOCOL || 'http',
    HOST: APP_HOST || 'localhost',
    PORT: Number(APP_PORT) || 3000,
    SERVER_PORT: Number(APP_SERVER_PORT) || 8000,
    PUBLIC_URL: APP_PUBLIC_URL || '',
  }
}

export default getSettings

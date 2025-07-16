
export const SERVER_URL_STORAGE_KEY = 'server-base-url'

export const getURLFromStorage = () => {

  const foundUrl = sessionStorage.getItem(SERVER_URL_STORAGE_KEY)

  return {
    BASE_URL: import.meta.env.VITE_NODE_ENVIRONMENT === 'production' ? `https://${foundUrl}` : 'http://localhost:8000',

    // Files
    GET_ALL_UPLOADED_FILES: '/get-files',  // GET
    FILES: '/files', // DELETE
    UPLOAD_FILES: '/upload-files',  // POST

    // Chats
    CHATS: '/chats',  // GET to get chats  // `/${chat_id}` with PUT and DELETE to update or delete

    // Models
    MODELS: '/models', // GET
    PULL_MODEL: '/models/pull/', // GET

    // Websocket
    WS_BASE_URL: import.meta.env.VITE_NODE_ENVIRONMENT === 'production' ? `wss://${foundUrl}/ws` : 'ws://localhost:8000/ws',
    WS_USER_QUERY: 'chat'
  }
}

export const API_KEYS = getURLFromStorage()

export const STORAGE_KEYS = {
  NO_DELETE_CONFIRM: 'no-del-conf'
}

export const APP_INFO = {
  VERSION: '1.4.6',
  NAME: 'Legal Corp AI',
}
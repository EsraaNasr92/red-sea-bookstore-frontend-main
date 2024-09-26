export const BASE_URL=process.env.NODE_ENV == 'development' ? 'http://localhost:3255/api/v1/' : "https://mediasea.net/api/v1/"
export const CLIENT_REF="6PpzNsnEz+5RTZxR0aeQidBSMsTnBKfkNAtdf22s9Fo="
export const ACCESS_TOKEN = localStorage.getItem('token') || null;
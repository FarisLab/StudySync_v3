export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword', // .doc
];

export const CHUNK_SIZE = 1000; // characters per chunk
export const CHUNK_OVERLAP = 200; // character overlap between chunks

export const DEFAULT_CHAT_PROMPT = `You are a helpful AI study assistant. You help students understand their study materials and answer questions based on their uploaded documents. Always be clear, concise, and accurate in your responses.`;

export const APP_ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  DOCUMENTS: '/documents',
  CHAT: '/chat',
  PROFILE: '/profile',
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
} as const;

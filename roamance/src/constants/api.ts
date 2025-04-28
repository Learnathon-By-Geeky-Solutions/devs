import { ENV_VARS } from './keys';

export const API_BASE_URL = ENV_VARS.API_URL;

const USERS = `${API_BASE_URL}/users`;
export const USER_ENDPOINTS = {
  REGISTER: USERS,
  UPDATE: USERS,
  DELETE: USERS,
  PROFILE: `${USERS}/me`,
} as const;

const USER_AUTH = `${API_BASE_URL}/auth`;
export const USER_AUTH_ENDPOINTS = {
  ROOT: USER_AUTH,
  LOGIN: `${USER_AUTH}/login`,
  REFRESH_TOKEN: `${USER_AUTH}/refresh-token`,
} as const;

const USER_INFO = `${USERS}/info`;
export const USER_INFO_ENDPOINTS = {
  ROOT: USER_INFO,
  ME: `${USER_INFO}/me`,
  UPDATE: `${USER_INFO}`,
  DELETE: `${USER_INFO}`,
};

const USER_PREFERENCES = `${USERS}/preferences`;
export const USER_PREFERENCES_ENDPOINTS = {
  ROOT: USER_PREFERENCES,
  ME: `${USER_PREFERENCES}/me`,
  UPDATE: `${USER_PREFERENCES}`,
  DELETE: `${USER_PREFERENCES}`,
};

/* ---------------------------------- Posts ---------------------------------- */

const POSTS = `${API_BASE_URL}/posts`;
export const POSTS_ENDPOINTS = {
  ROOT: POSTS,
  CREATE: `${POSTS}/create`,
  GET: (postId: string) => `${POSTS}/${postId}`,
  GET_ALL: POSTS,
  UPDATE: (postId: string) => `${POSTS}/update/${postId}`,
  GET_BY_IDS: `${POSTS}/by-ids`,
  GET_BY_USER_ID: (userId: string) => `${POSTS}/by-user/${userId}`,
  SAVE: (postId: string) => `${POSTS}/save/${postId}`,
  GET_SAVED: `${POSTS}/saved`,
  LIKE: (postId: string) => `${POSTS}/like/${postId}`,
  LIKED_BY: (postId: string) => `${POSTS}/liked-by/${postId}`,
  DELETE: (postId: string) => `${POSTS}/delete/${postId}`,
};


/* -------------------------------- Comments -------------------------------- */

const COMMENTS = `${API_BASE_URL}/comments`;
export const COMMENTS_ENDPOINTS = {
  ROOT: COMMENTS,
  CREATE: (postId: string) => `${COMMENTS}/create/post/${postId}`,
  GET: (commentId: string) => `${COMMENTS}/${commentId}`,
  GET_BY_POST_ID: (postId: string) => `${COMMENTS}/by-post/${postId}`,
};

const CHATS = `${API_BASE_URL}/chats`;
export const CHATS_ENDPOINTS = {
  ROOT: CHATS,
  CREATE: (userId: string) => `${CHATS}/create/user/${userId}`,
  GET: (chatId: string) => `${CHATS}/${chatId}`,
  GET_ALL: CHATS,
};

const MESSAGES = `${API_BASE_URL}/messages`;
export const MESSAGES_ENDPOINTS = {
  ROOT: MESSAGES,
  CREATE: (chatId: string) => `${MESSAGES}/create/chat/${chatId}`,
  GET_BY_CHAT_ID: (chatId: string) => `${MESSAGES}/chat/${chatId}`,
};

const TRAVEL = `${API_BASE_URL}/travel`;
const JOURNALS = `${TRAVEL}/journals`;
export const JOURNAL_ENDPOINTS = {
  ROOT: JOURNALS,
  CREATE: `${JOURNALS}`,
  GET_BY_ID: (id: string) => `${JOURNALS}/${id}`,
  UPDATE: (id: string) => `${JOURNALS}/${id}`,
  DELETE: (id: string) => `${JOURNALS}/${id}`,
} as const;

const SUBSECTIONS = `${TRAVEL}/subsections`;
export const SUBSECTION_ENDPOINTS = {
  ROOT: SUBSECTIONS,
  CREATE: `${SUBSECTIONS}`,
  GET_BY_ID: (id: string) => `${SUBSECTIONS}/${id}`,
  UPDATE: (id: string) => `${SUBSECTIONS}/${id}`,
  DELETE: (id: string) => `${SUBSECTIONS}/${id}`,
} as const;

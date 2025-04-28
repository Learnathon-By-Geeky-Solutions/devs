import { Audit, BaseResponse, Location, User } from '@/types';

/* --------------------------------- Comment -------------------------------- */

export type Comment = {
  id: string;
  text: string;
  image_path: string;
  video_path: string;
  user: User;
  post: Post;
  audit: Audit;
};

export type CommentRequestDto = {
  text: string;
  image_path: string;
  video_path: string;
};

export type CommentResponseDto = {
  id: string;
  text: string;
  image_path: string;
  video_path: string;
  user: User;
  audit: Audit;
};

export type CommentListResponseDto = Array<CommentResponseDto>;

export type CommentListResponse = BaseResponse<CommentListResponseDto>;
export type CommentResponse = BaseResponse<CommentResponseDto>;

export type CommentDtoByEndpoints = {
  CREATE: { request: CommentRequestDto; response: CommentResponse };
  GET: { request: undefined; response: CommentResponse };
  GET_BY_POST_ID: { request: undefined; response: CommentListResponse };
};

/* ---------------------------------- Post ---------------------------------- */

export type Post = {
  id: string;
  text: string;
  image_paths: string[];
  video_paths: string[];
  location: Location;
  is_safe: boolean;
  tidbits: string;
  likes_count: number;
  comments_count: number;
  user: User;
  liked_by: User[];
  saved_by: User[];
  comments: Comment[];
  audit: Audit;
};

export type PostRequestDto = {
  text: string;
  image_paths: string[];
  video_paths: string[];
  location: Location;
};

export type PostResponseDto = {
  id: string;
  text: string;
  image_paths: string[];
  video_paths: string[];
  location: Location;
  is_safe: boolean;
  tidbits: string;
  likes_count: number;
  comments_count: number;
  user: User;
  audit: Audit;
};

export type PostListResponseDto = Array<PostResponseDto>;

export type PostListResponse = BaseResponse<PostListResponseDto>;
export type PostResponse = BaseResponse<PostResponseDto>;

export type PostDtoByEndpoints = {
  CREATE: { request: PostRequestDto; response: PostResponse };
  GET: { request: undefined; response: PostResponse };
  GET_ALL: { request: undefined; response: PostListResponse };
  UPDATE: { request: PostRequestDto; response: PostResponse };
  GET_BY_IDS: { request: string[]; response: PostListResponse };
  GET_BY_USER_ID: { request: undefined; response: PostListResponse };
  SAVE: { request: undefined; response: BaseResponse<null> };
  GET_SAVED: { request: undefined; response: PostListResponse };
  LIKE: { request: undefined; response: BaseResponse<null> };
  LIKED_BY: { request: undefined; response: BaseResponse<User[]> };
  DELETE: { request: undefined; response: BaseResponse<null> };
};

/* --------------------------------- Message -------------------------------- */

export type Message = {
  id: string;
  text: string;
  image_path: string;
  video_path: string;
  user: User;
  chat: Chat;
  audit: Audit;
};

export type MessageRequestDto = {
  text: string;
  image_path: string;
  video_path: string;
};

export type MessageResponseDto = {
  id: string;
  text: string;
  image_path: string;
  video_path: string;
  user: User;
  audit: Audit;
};

export type MessageListResponseDto = Array<MessageResponseDto>;

export type MessageListResponse = BaseResponse<MessageListResponseDto>;
export type MessageResponse = BaseResponse<MessageResponseDto>;

export type MessageDtoByEndpoints = {
  CREATE: { request: MessageRequestDto; response: MessageResponse };
  GET_BY_CHAT_ID: { request: undefined; response: MessageListResponse };
};

/* ---------------------------------- Chat ---------------------------------- */

export type Chat = {
  id: string;
  users: User[];
  messages: Message[];
  last_text: Message;
  audit: Audit;
};

export type ChatResponseDto = {
  id: string;
  users: User[];
  last_text: Message;
  audit: Audit;
};

export type ChatListResponseDto = Array<ChatResponseDto>;

export type ChatListResponse = BaseResponse<ChatListResponseDto>;
export type ChatResponse = BaseResponse<ChatResponseDto>;

export type ChatDtoByEndpoints = {
  CREATE: { request: undefined; response: ChatResponse };
  GET: { request: undefined; response: ChatResponse };
  GET_ALL: { request: undefined; response: ChatListResponse };
};

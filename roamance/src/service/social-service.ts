import {
  CHATS_ENDPOINTS,
  COMMENTS_ENDPOINTS,
  MESSAGES_ENDPOINTS,
  POSTS_ENDPOINTS,
} from '@/constants/api';
import { BaseResponse } from '@/types';
import {
  ChatListResponse,
  ChatResponse,
  CommentListResponse,
  CommentRequestDto,
  CommentResponse,
  MessageListResponse,
  MessageRequestDto,
  MessageResponse,
  PostListResponse,
  PostRequestDto,
  PostResponse,
  User,
} from '@/types';
import { api } from '@/api/roamance-api';
import { ApiError } from '@/api/errors';

// Posts
export const PostService = {
  createPost: async (post: PostRequestDto): Promise<PostResponse> => {
    try {
      const response = await api.post<PostResponse, PostRequestDto>(POSTS_ENDPOINTS.CREATE, post);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to create post: ${error.message}`);
      }
      throw error;
    }
  },

  getPost: async (postId: string): Promise<PostResponse> => {
    try {
      const response = await api.get<PostResponse>(POSTS_ENDPOINTS.GET(postId));
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to get post: ${error.message}`);
      }
      throw error;
    }
  },

  getAllPosts: async (): Promise<PostListResponse> => {
    try {
      const response = await api.get<PostListResponse>(POSTS_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to get all posts: ${error.message}`);
      }
      throw error;
    }
  },

  updatePost: async (
    postId: string,
    post: PostRequestDto
  ): Promise<PostResponse> => {
    try {
      const response = await api.put<PostResponse, PostRequestDto>(
        POSTS_ENDPOINTS.UPDATE(postId),
        post
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to update post: ${error.message}`);
      }
      throw error;
    }
  },

  getPostsByIds: async (postIds: string[]): Promise<PostListResponse> => {
    try {
      const response = await api.post<PostListResponse, { ids: string[] }>(
        POSTS_ENDPOINTS.GET_BY_IDS,
        { ids: postIds }
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to get posts by IDs: ${error.message}`);
      }
      throw error;
    }
  },

  getPostsByUserId: async (userId: string): Promise<PostListResponse> => {
    try {
      const response = await api.get<PostListResponse>(
        POSTS_ENDPOINTS.GET_BY_USER_ID(userId)
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to get posts by user ID: ${error.message}`);
      }
      throw error;
    }
  },

  savePost: async (postId: string): Promise<BaseResponse<null>> => {
    try {
      const response = await api.post<BaseResponse<null>, null>(
        POSTS_ENDPOINTS.SAVE(postId)
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to save post: ${error.message}`);
      }
      throw error;
    }
  },

  getSavedPosts: async (): Promise<PostListResponse> => {
    try {
      const response = await api.get<PostListResponse>(POSTS_ENDPOINTS.GET_SAVED);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to get saved posts: ${error.message}`);
      }
      throw error;
    }
  },

  likePost: async (postId: string): Promise<BaseResponse<null>> => {
    try {
      const response = await api.post<BaseResponse<null>, null>(
        POSTS_ENDPOINTS.LIKE(postId)
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to like post: ${error.message}`);
      }
      throw error;
    }
  },

  getLikedByPost: async (postId: string): Promise<BaseResponse<User[]>> => {
    try {
      const response = await api.get<BaseResponse<User[]>>(
        POSTS_ENDPOINTS.LIKED_BY(postId)
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to get users who liked post: ${error.message}`);
      }
      throw error;
    }
  },

  deletePost: async (postId: string): Promise<BaseResponse<null>> => {
    try {
      const response = await api.delete<BaseResponse<null>>(
        POSTS_ENDPOINTS.DELETE(postId)
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to delete post: ${error.message}`);
      }
      throw error;
    }
  },
};

// Comments
export const CommentService = {
  createComment: async (
    postId: string,
    comment: CommentRequestDto
  ): Promise<CommentResponse> => {
    try {
      const response = await api.post<CommentResponse, CommentRequestDto>(
        COMMENTS_ENDPOINTS.CREATE(postId),
        comment
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to create comment: ${error.message}`);
      }
      throw error;
    }
  },

  getComment: async (commentId: string): Promise<CommentResponse> => {
    try {
      const response = await api.get<CommentResponse>(COMMENTS_ENDPOINTS.GET(commentId));
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to get comment: ${error.message}`);
      }
      throw error;
    }
  },

  getCommentsByPostId: async (postId: string): Promise<CommentListResponse> => {
    try {
      const response = await api.get<CommentListResponse>(
        COMMENTS_ENDPOINTS.GET_BY_POST_ID(postId)
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to get comments by post ID: ${error.message}`);
      }
      throw error;
    }
  },
};

// Chats
export const ChatService = {
  createChat: async (userId: string): Promise<ChatResponse> => {
    try {
      const response = await api.post<ChatResponse, null>(CHATS_ENDPOINTS.CREATE(userId));
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to create chat: ${error.message}`);
      }
      throw error;
    }
  },

  getChat: async (chatId: string): Promise<ChatResponse> => {
    try {
      const response = await api.get<ChatResponse>(CHATS_ENDPOINTS.GET(chatId));
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to get chat: ${error.message}`);
      }
      throw error;
    }
  },

  getAllChats: async (): Promise<ChatListResponse> => {
    try {
      const response = await api.get<ChatListResponse>(CHATS_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to get all chats: ${error.message}`);
      }
      throw error;
    }
  },
};

// Messages
export const MessageService = {
  createMessage: async (
    chatId: string,
    message: MessageRequestDto
  ): Promise<MessageResponse> => {
    try {
      const response = await api.post<MessageResponse, MessageRequestDto>(
        MESSAGES_ENDPOINTS.CREATE(chatId),
        message
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to create message: ${error.message}`);
      }
      throw error;
    }
  },

  getMessagesByChatId: async (chatId: string): Promise<MessageListResponse> => {
    try {
      const response = await api.get<MessageListResponse>(
        MESSAGES_ENDPOINTS.GET_BY_CHAT_ID(chatId)
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to get messages by chat ID: ${error.message}`);
      }
      throw error;
    }
  },
};

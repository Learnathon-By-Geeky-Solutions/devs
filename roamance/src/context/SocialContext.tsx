'use client';

import { CommentService, PostService } from '@/service/social-service';
import { userService } from '@/service/user-service';
import {
  Comment,
  CommentRequestDto,
  CommentResponseDto,
  Post,
  PostRequestDto,
  User,
} from '@/types';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'sonner';

interface SocialContextValue {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  savedPosts: Post[];
  setSavedPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  fetchPosts: () => Promise<void>;
  fetchSavedPosts: () => Promise<void>;
  createPost: (postData: PostRequestDto) => Promise<void>;
  toggleLikePost: (postId: string) => Promise<void>;
  toggleSavePost: (post: Post) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  fetchComments: (postId: string) => Promise<CommentResponseDto[]>;
  createComment: (
    postId: string,
    commentData: CommentRequestDto
  ) => Promise<CommentResponseDto | null>;
  isLoading: boolean;
  isPostsLoading: boolean;
  isSavedPostsLoading: boolean;
  isCommentsLoading: boolean;
  isCreatingPost: boolean;
  isCreatingComment: boolean;
  error: string | null;
}

const SocialContext = createContext<SocialContextValue>({
  user: {} as User,
  setUser: () => {},
  posts: [],
  setPosts: () => {},
  savedPosts: [],
  setSavedPosts: () => {},
  fetchPosts: async () => {},
  fetchSavedPosts: async () => {},
  createPost: async () => {},
  toggleLikePost: async () => {},
  toggleSavePost: async () => {},
  deletePost: async () => {},
  fetchComments: async () => [],
  createComment: async () => null,
  isLoading: false,
  isPostsLoading: false,
  isSavedPostsLoading: false,
  isCommentsLoading: false,
  isCreatingPost: false,
  isCreatingComment: false,
  error: null,
});

interface SocialProviderProps {
  children: ReactNode;
  initialPosts?: Post[];
}

export const SocialProvider = ({
  children,
  initialPosts = [],
}: SocialProviderProps) => {
  const [user, setUser] = useState<User>({} as User);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isPostsLoading, setIsPostsLoading] = useState(!initialPosts.length);
  const [isSavedPostsLoading, setIsSavedPostsLoading] = useState(false);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      setIsUserLoading(true);
      const userData = await userService.getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setIsPostsLoading(true);
      setError(null);
      const postListResponse = await PostService.getAllPosts();

      if (postListResponse.success) {
        setPosts(
          await Promise.all(
            postListResponse.data.map(async (dto) => ({
              ...dto,
              liked_by: await PostService.getLikedByPost(dto?.id || '').then(
                (res) => res.data
              ),
              comments: await CommentService.getCommentsByPostId(
                dto?.id || ''
              ).then((res) =>
                res.data.map(
                  (comment) => ({ ...comment, post: dto }) as Comment
                )
              ),
              saved_by: [],
            }))
          )
        );
      } else {
        setError('Failed to fetch posts');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('An error occurred while fetching posts');
    } finally {
      setIsPostsLoading(false);
    }
  }, []);

  const createPost = useCallback(
    async (postData: PostRequestDto): Promise<void> => {
      try {
        setIsCreatingPost(true);

        const response = await PostService.createPost({
          text: postData.text,
          image_paths: postData.image_paths,
          video_paths: postData.video_paths,
          location: postData.location || { latitude: 0, longitude: 0 },
        });

        if (response.success) {
          // Add optimistic update - add the new post to the top of the feed
          if (response.data) {
            const newPost: Post = {
              ...response.data,
              liked_by: [],
              comments: [],
              saved_by: [],
            };

            setPosts((prevPosts) => [newPost, ...prevPosts]);
          }

          toast.success('Post shared successfully!');
          fetchPosts(); // Refresh posts after creating a new one
        } else {
          toast.error('Failed to create post');
        }
      } catch (error) {
        console.error('Error creating post:', error);
        toast.error('Failed to create post. Please try again.');
      } finally {
        setIsCreatingPost(false);
      }
    },
    [fetchPosts]
  );

  const fetchSavedPosts = useCallback(async () => {
    try {
      setIsSavedPostsLoading(true);
      setError(null);
      const postListResponse = await PostService.getSavedPosts();

      if (postListResponse.success) {
        setSavedPosts(
          await Promise.all(
            postListResponse.data.map(async (dto) => ({
              ...dto,
              liked_by: await PostService.getLikedByPost(dto?.id || '').then(
                (res) => res.data
              ),
              comments: await CommentService.getCommentsByPostId(
                dto?.id || ''
              ).then((res) =>
                res.data.map(
                  (comment) => ({ ...comment, post: dto }) as Comment
                )
              ),
              saved_by: [user],
            }))
          )
        );
      } else {
        setError('Failed to fetch saved posts');
      }
    } catch (err) {
      console.error('Error fetching saved posts:', err);
      setError('An error occurred while fetching saved posts');
    } finally {
      setIsSavedPostsLoading(false);
    }
  }, [user]);

  const toggleLikePost = useCallback(
    async (postId: string) => {
      const post = posts.find((p) => p.id === postId);
      const isLiked = post?.liked_by?.some((u) => u.id === user.id);
      try {
        const response = await PostService.likePost(postId);
        if (response.success && post) {
          // Optimistically update like state
          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    likes_count: isLiked
                      ? Math.max((p.likes_count || 0) - 1, 0)
                      : (p.likes_count || 0) + 1,
                    liked_by: isLiked
                      ? p.liked_by.filter((u) => u.id !== user.id)
                      : [...p.liked_by, user!],
                  }
                : p
            )
          );
          setSavedPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    likes_count: isLiked
                      ? Math.max((p.likes_count || 0) - 1, 0)
                      : (p.likes_count || 0) + 1,
                    liked_by: isLiked
                      ? p.liked_by.filter((u) => u.id !== user.id)
                      : [...p.liked_by, user!],
                  }
                : p
            )
          );
          toast.success(isLiked ? 'Post unliked!' : 'Post liked!');
        }
      } catch (err) {
        console.error('Error liking post:', err);
        toast.error('Failed to like post. Please try again.');
      }
    },
    [posts, user]
  );

  const toggleSavePost = useCallback(
    async (post: Post) => {
      const savedPost = savedPosts.find((p) => p.id === post.id);

      console.log('toggleSavePost', savedPosts, post);

      try {
        const response = await PostService.savePost(post.id);
        if (response.success) {
          setSavedPosts((prev) =>
            savedPost ? prev.filter((p) => p.id !== post.id) : [post, ...prev]
          );
          toast.success(savedPost ? 'Post unsaved!' : 'Post saved!');
        }
      } catch (err) {
        console.error('Error saving post:', err);
        toast.error('Failed to save post. Please try again.');
      }
    },
    [savedPosts]
  );

  const deletePost = useCallback(async (postId: string) => {
    try {
      if (!confirm('Are you sure you want to delete this post?')) return;
      const response = await PostService.deletePost(postId);
      if (response.success) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setSavedPosts((prev) => prev.filter((p) => p.id !== postId));
        toast.success('Post deleted successfully!');
      } else {
        toast.error('Failed to delete post. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.error('Failed to delete post. Please try again.');
    }
  }, []);

  const fetchComments = useCallback(
    async (postId: string): Promise<CommentResponseDto[]> => {
      try {
        setIsCommentsLoading(true);
        setError(null);
        const response = await CommentService.getCommentsByPostId(postId);

        if (response.success) {
          // Transform API response to Comment[] by adding missing properties
          const transformedComments: Comment[] = response.data.map(
            (comment) => ({
              ...comment,
              post: { id: postId } as Post, // Minimal post object with correct type
            })
          );
          return transformedComments;
        } else {
          setError('Failed to fetch comments');
          return [];
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('An error occurred while fetching comments');
        return [];
      } finally {
        setIsCommentsLoading(false);
      }
    },
    []
  );

  const createComment = useCallback(
    async (
      postId: string,
      commentData: CommentRequestDto
    ): Promise<CommentResponseDto | null> => {
      if (!user.id) {
        toast.error('You need to be logged in to comment');
        return null;
      }

      if (!commentData.text.trim()) {
        toast.error('Comment cannot be empty');
        return null;
      }

      try {
        setIsCreatingComment(true);

        const response = await CommentService.createComment(
          postId,
          commentData
        );

        if (response.success) {
          // Create a comment object with complete data
          const newComment: Comment = {
            ...response.data,
            post: { id: postId } as Post, // Minimal post object with correct type
            user: user,
          };

          // Update the post's comments in state
          setPosts((prevPosts) =>
            prevPosts.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    comments: [newComment, ...(p.comments || [])],
                  }
                : p
            )
          );

          // Also update saved posts if the commented post is saved
          setSavedPosts((prevPosts) =>
            prevPosts.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    comments: [newComment, ...(p.comments || [])],
                  }
                : p
            )
          );

          toast.success('Comment added successfully');
          return newComment;
        } else {
          toast.error('Failed to add comment. Please try again.');
          return null;
        }
      } catch (err) {
        console.error('Error adding comment:', err);
        toast.error('Failed to add comment. Please try again.');
        return null;
      } finally {
        setIsCreatingComment(false);
      }
    },
    [user]
  );

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return (
    <SocialContext.Provider
      value={{
        user,
        setUser,
        posts,
        setPosts,
        savedPosts,
        setSavedPosts,
        fetchPosts,
        fetchSavedPosts,
        createPost,
        toggleLikePost,
        toggleSavePost,
        deletePost,
        fetchComments,
        createComment,
        isLoading: isUserLoading,
        isPostsLoading,
        isSavedPostsLoading,
        isCommentsLoading,
        isCreatingPost,
        isCreatingComment,
        error,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocialContext = () => useContext(SocialContext);

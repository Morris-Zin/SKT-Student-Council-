import { BLOGS_URL, IMAGE_UPLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const blogsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: ({ pageNumber, keyword, sortBy }) => ({
        url: BLOGS_URL,
        credentials: 'include',
        params: { pageNumber, keyword, sortBy },
      }),
      providesTags: ['BlogDelete'],
      keepUnusedDataFor: 5,
    }),
    getBlogById: builder.query({
      query: (id) => ({
        url: `${BLOGS_URL}/${id}`,
        credentials: 'include',
      }),
      providesTags: ['Blog', 'BlogPost'],
      keepUnusedDataFor: 5,
    }),

    createBlog: builder.mutation({
      query: (data) => ({
        url: BLOGS_URL,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Blog'],
    }),

    editBlog: builder.mutation({
      query: ({ blogId, data }) => ({
        url: `${BLOGS_URL}/${blogId}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Blog', 'BlogPost'],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `${BLOGS_URL}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['BlogDelete'],
    }),

    uploadBlogImage: builder.mutation({
      query: (data) => ({
        url: '/api/upload',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Blog'],
    }),

    deleteImage: builder.mutation({
      query: (imageId) => ({
        url: `/api/upload/${imageId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Blog'],
    }),

    createComment: builder.mutation({
      query: ({ blogId, data }) => ({
        url: `${BLOGS_URL}/${blogId}/comments`,
        method: 'POST',
        body: { data },
        credentials: 'include',
      }),
      invalidatesTags: ['Blog'],
    }),
    deleteComment: builder.mutation({
      query: ({ blogId, commentId }) => ({
        url: `${BLOGS_URL}/${blogId}/comments/${commentId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Blog'],
    }),

    editComment: builder.mutation({
      query: ({ blogId, commentId, data }) => ({
        url: `${BLOGS_URL}/${blogId}/comments/${commentId}`,
        method: 'PUT',
        credentials: 'include',
        body: { data },
      }),
      invalidatesTags: ['Blog'],
    }),
  }),
});

export const {
  useGetBlogByIdQuery,
  useGetBlogsQuery,
  useCreateBlogMutation,
  useEditBlogMutation,
  useDeleteBlogMutation,
  useUploadBlogImageMutation,
  useCreateCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useDeleteImageMutation,
} = blogsApiSlice;

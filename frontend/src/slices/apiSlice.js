import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { useSelector } from 'react-redux';
import { BASE_URL, BLOGS_URL } from '../constants';

export const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: ['Blog', 'User'],
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    // prepareHeaders: (headers) => headers,
  }),
  endpoints: () => ({}),
});

// src/store/api/sessionApi.js
import { baseApi } from './baseApi';

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSession: builder.mutation({
      query: (body) => ({
        url: '/sessions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Session'],
    }),
    getSession: builder.query({
      query: (sessionId) => `/sessions/${sessionId}`,
      providesTags: (result, error, id) => [{ type: 'Session', id }],
    }),
    getMySessions: builder.query({
      query: () => '/sessions/my',
      providesTags: ['Session'],
    }),
    completeSession: builder.mutation({
      query: (sessionId) => ({
        url: `/sessions/${sessionId}/complete`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Session', id }, 'Session'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateSessionMutation,
  useGetSessionQuery,
  useGetMySessionsQuery,
  useCompleteSessionMutation,
} = sessionApi;

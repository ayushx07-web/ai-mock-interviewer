// src/store/api/progressApi.js
import { baseApi } from './baseApi';

export const progressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProgress: builder.query({
      query: () => '/progress',
      providesTags: ['Progress'],
    }),
    triggerCompute: builder.mutation({
      query: () => ({
        url: '/progress/compute',
        method: 'POST',
      }),
      invalidatesTags: ['Progress'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMyProgressQuery, useTriggerComputeMutation } = progressApi;

// src/store/api/answerApi.js
import { baseApi } from './baseApi';

export const answerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitAnswer: builder.mutation({
      query: ({ sessionId, body }) => ({
        url: `/sessions/${sessionId}/answers`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { sessionId }) => [{ type: 'Session', id: sessionId }],
    }),
    transcribeAudio: builder.mutation({
      query: (formData) => ({
        url: '/answers/transcribe',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSubmitAnswerMutation, useTranscribeAudioMutation } = answerApi;

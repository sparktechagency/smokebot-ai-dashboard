import { baseApis } from './main/baseApis'

const chatApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    postChat: builder.mutation({
      query: (data) => ({
        url: '/chatbot/chat',
        method: 'POST',
        body: data,
      }),
    }),
    getUserChatHistory: builder.query({
      query: (params) => ({
        url: `/chatbot/get-user-chat`,
        method: 'GET',
        params,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { usePostChatMutation, useGetUserChatHistoryQuery } = chatApis

export default chatApis

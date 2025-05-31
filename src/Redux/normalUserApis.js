import { baseApis } from './main/baseApis'

const normalUserApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params) => ({
        url: '/normal-user/get-all-users',
        method: 'GET',
        params,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetAllUsersQuery } = normalUserApis

export default normalUserApis

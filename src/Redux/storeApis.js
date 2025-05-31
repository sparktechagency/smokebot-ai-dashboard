import { baseApis } from './main/baseApis'

const storeApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllStores: builder.query({
      query: (params) => ({
        url: '/store/all-store',
        method: 'GET',
        params,
      }),
    }),
    changeStatusStore: builder.mutation({
      query: (id) => ({
        url: `/user/change-status/${id}`,
        method: 'PATCH',
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetAllStoresQuery, useChangeStatusStoreMutation } = storeApis

export default storeApis

import { baseApis } from './main/baseApis'

const featuresApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllFeatures: builder.query({
      query: (params) => ({
        url: '/product/get-all',
        method: 'GET',
        params,
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetAllFeaturesQuery } = featuresApis

export default featuresApis

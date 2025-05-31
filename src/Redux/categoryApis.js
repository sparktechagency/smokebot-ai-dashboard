import { baseApis } from './main/baseApis'

const categoryApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: '/category/get-all',
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: `/category/add-category`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
  }),
  overrideExisting: false,
})

export const { useCreateCategoryMutation, useGetAllCategoriesQuery } =
  categoryApis

export default categoryApis

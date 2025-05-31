import { baseApis } from './main/baseApis'

const productApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (params) => ({
        url: '/product/get-my-products',
        method: 'GET',
        params,
      }),
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: `/product/create`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/product/update/${id}`,
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: ['Product'],
    }),
    updateCSVProduct: builder.mutation({
      query: (data) => {
        return {
          url: `/upload-csv`,
          method: 'POST',
          body: data,
        }
      },
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateCSVProductMutation,
  useDeleteProductMutation,
} = productApis

export default productApis

import { baseApis } from './main/baseApis'

const storeApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    purchaseSubscription: builder.mutation({
      query: () => ({
        url: '/subscription/purchase-subscription',
        method: 'POST',
      }),
    }),
    trialSubscription: builder.mutation({
      query: () => ({
        url: `/subscription/continue-with-trial`,
        method: 'POST',
      }),
    }),
    getMyProfile: builder.query({
      query: () => ({
        url: `/user/get-my-profile`,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
})

export const {
  usePurchaseSubscriptionMutation,
  useTrialSubscriptionMutation,
  useGetMyProfileQuery,
} = storeApis

export default storeApis

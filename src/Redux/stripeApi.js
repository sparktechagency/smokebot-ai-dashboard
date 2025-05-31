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
  }),
  overrideExisting: false,
})

export const { usePurchaseSubscriptionMutation, useTrialSubscriptionMutation } =
  storeApis

export default storeApis

import { apiSlice } from "./apiSlice";
import { OFFER_URL } from "../constants";

export const offersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOffer: builder.mutation({
      query: (data) => ({
        url: OFFER_URL,
        method: "POST",
        body: data,
      }),
    }),
    getOffers: builder.query({
      query: () => ({
        url: OFFER_URL,
        method: "GET",
      }),
      providesTags: ["Offer"],
      keepUnusedDataFor: 5,
    }),
    getFilteredOffers: builder.query({
      query: (filters) => ({
        url: `${OFFER_URL}/filtered`,
        method: "GET",
        params: filters,
      }),
    }),
    getOfferById: builder.query({
      query: (id) => ({
        url: `${OFFER_URL}/${id}`,
        method: "GET",
      }),
    }),
    deleteOffer: builder.mutation({
      query: (id) => ({
        url: `${OFFER_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    applyToOffer: builder.mutation({
      query: ({ id, data }) => ({
        url: `${OFFER_URL}/${id}/apply`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Offer"],
    }),
    getOfferApplications: builder.query({
      query: (id) => `${OFFER_URL}/${id}/applications`,
      providesTags: ["Application"],
    }),
    updateApplicationStatus: builder.mutation({
      query: ({ offerId, applicationId, status }) => ({
        url: `${OFFER_URL}/${offerId}/applications/${applicationId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Application"],
    }),
  }),
});

export const {
  useCreateOfferMutation,
  useGetOffersQuery,
  useGetFilteredOffersQuery,
  useGetOfferByIdQuery,
  useDeleteOfferMutation,
  useApplyToOfferMutation,
  useGetOfferApplicationsQuery,
  useUpdateApplicationStatusMutation,
} = offersApiSlice;

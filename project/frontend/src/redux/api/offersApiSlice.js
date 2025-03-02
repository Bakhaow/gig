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
  }),
});

export const {
  useCreateOfferMutation,
  useGetOffersQuery,
  useGetFilteredOffersQuery,
  useGetOfferByIdQuery,
  useDeleteOfferMutation,
} = offersApiSlice;

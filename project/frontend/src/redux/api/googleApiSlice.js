import { apiSlice } from "./apiSlice";
import { GOOGLE_URL } from "../constants";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    googleLogin: builder.mutation({
      query: (credential) => ({
        url: `${GOOGLE_URL}`,
        method: "POST",
        body: { token: credential },
      }),
    }),
  }),
});

export const { useGoogleLoginMutation } = usersApiSlice;

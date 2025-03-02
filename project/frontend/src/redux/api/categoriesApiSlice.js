import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (category) => ({
        url: `${CATEGORY_URL}`,
        method: "POST",
        body: category,
      }),
    }),
    updateCategory: builder.mutation({
      query: (category) => ({
        url: `${CATEGORY_URL}/${category._id}`,
        method: "PUT",
        body: category,
      }),
    }),
    removeCategory: builder.mutation({
      query: (category) => ({
        url: `${CATEGORY_URL}/${category._id}`,
        method: "DELETE",
      }),
    }),
    getAllCategories: builder.query({
      query: () => ({
        url: `${CATEGORY_URL}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useRemoveCategoryMutation,
  useGetAllCategoriesQuery,
} = categoryApiSlice;

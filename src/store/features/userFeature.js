import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const BASE_URL = "XXXXXXXXXXXXXXXXXXXXXXXXXXXX";

export const UserApi = createApi({
  reducerPath: "UserApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["User"],

  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: user_End_Points.login,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
  
});

export const { useLoginUserQuery } = UserApi;

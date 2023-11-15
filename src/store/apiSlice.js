import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => '/services',
    }),
    getService: builder.query({
      query: (serviceId) => `/services/${serviceId}`,
    }),
  }),
});

export const { useGetServicesQuery, useGetServiceQuery } = api;
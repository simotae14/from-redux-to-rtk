import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    // headers: {
    //   "x-custom-header-global": Math.random(),
    // },
    prepareHeaders: (headers) => {
      headers.set('x-custom-header-global', Math.random());
      return headers;
    }
  }),
  refetchOnFocus: true, // when you change tab and return the data will be refetched automatically
  refetchOnReconnect: true, // when you lose internet connection and reconnect the data will be refetched automatically
  tagTypes: ['Services', 'Dogs'],
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => ({
        url: '/services',
        headers: {
          "x-custom-header": Math.random(),
        },
      }),
    }),
    getService: builder.query({
      query: (serviceId) => `/services/${serviceId}`,
    }),
    makeContact: builder.mutation({
      query: (body) => ({
        url: '/contact',
        method: 'POST',
        body,
      }),
    }),
    getDogs: builder.query({
      query: () => '/dogs',
      transformResponse: (dogs) => {
        const allDogs = {};
        // calculate the age and size properties before saving
        for (const id in dogs) {
          const dog = dogs[id];
          allDogs[id] = {
            ...dog,
            size: getSize(dog.weight),
            age: getAge(dog.dob),
          };
        }
        return allDogs;
      },
      providesTags: ['Dogs']
    }),
    addDog: builder.mutation({
      query: (body) => ({
        url: '/dogs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Dogs']
    }),
    removeDog: builder.mutation({
      query: (id) => ({
        url: `/dogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Dogs'],
      // it updates the cache with the new data before the delete is complete
      onQueryStarted(id, { dispatch, queryFulfilled }) {
        const update = dispatch(
          api.util.updateQueryData('getDogs', undefined, (dogs) => {
            delete dogs[id];
          })
        );
        // revert the update if the request fails
        queryFulfilled.catch(() => {
          update.undo();
        });
      }
    }),
  }),
});

export const { 
  useAddDogMutation,
  useGetServicesQuery,
  useGetServiceQuery,
  useMakeContactMutation,
  useGetDogsQuery,
  useRemoveDogMutation,
} = api;

export function getSize(weight) {
  weight = parseInt(weight, 10);
  if (weight <= 10) return "teacup";
  if (weight <= 25) return "small";
  if (weight <= 50) return "medium";
  if (weight <= 80) return "large";
  if (weight <= 125) return "x-large";
  return "jumbo";
}

const YEAR = 3.156e10;
export function getAge(dob) {
  const date = +new Date(dob);
  return Math.floor((Date.now() - date) / YEAR);
}
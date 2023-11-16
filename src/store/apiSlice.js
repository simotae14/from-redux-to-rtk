import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  keepUnusedDataFor: 5, // in seconds
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => '/services',
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
      }
    }),
    addDog: builder.mutation({
      query: (body) => ({
        url: '/dogs',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { 
  useAddDogMutation,
  useGetServicesQuery,
  useGetServiceQuery,
  useMakeContactMutation,
  useGetDogsQuery,
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
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080',
    // baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Stats', 'Users', 'Posts', 'Reports', 'Team', 'Settings'],
  endpoints: (builder) => ({
    getAnalytics: builder.query<any, void>({
      query: () => '/admin/graph',
      transformResponse: (response: any) => response.data,
    }),
    getStats: builder.query<any, void>({
      query: () => '/admin/stats',
      transformResponse: (response: any) => response.data,
      providesTags: ['Stats'],
    }),
    getUsers: builder.query<any, { limit?: number; skip?: number; search?: string }>({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ['Users'],
    }),
    getUserDetails: builder.query<any, string>({
      query: (id) => `/admin/users/${id}`,
      transformResponse: (response: any) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),
    getPosts: builder.query<any, { limit?: number; skip?: number; search?: string; type?: 'all' | 'posts' | 'replies' }>({
      query: (params) => ({
        url: '/admin/posts',
        params,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ['Posts'],
    }),
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'Stats'],
    }),
    updateUser: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
    deletePost: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Posts', 'Stats'],
    }),
    getHealth: builder.query<any, void>({
      query: () => '/admin/health',
      transformResponse: (response: any) => response.data,
      // Polling for real-time-ish feel
    }),
    getReports: builder.query<any, { limit?: number; skip?: number }>({
      query: (params) => ({
        url: '/admin/reports',
        params,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ['Reports'],
    }),
    getTeam: builder.query<any, void>({
      query: () => '/admin/team',
      transformResponse: (response: any) => response.data,
      providesTags: ['Team'],
    }),
    addTeamMember: builder.mutation<any, any>({
      query: (data) => ({
        url: '/admin/team',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Team'],
    }),
    removeTeamMember: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/team/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
    dismissReport: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/reports/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reports'],
    }),
    getSettings: builder.query<any, void>({
      query: () => '/admin/settings',
      transformResponse: (response: any) => response.data,
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<any, any>({
      query: (data) => ({
        url: '/admin/settings',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),
    sendBroadcast: builder.mutation<any, { content: string; link?: string; type?: string }>({
      query: (data) => ({
        url: '/admin/broadcast',
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/admin/signin',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetAnalyticsQuery,
  useGetStatsQuery,
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useGetPostsQuery,
  useGetReportsQuery,
  useGetTeamQuery,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useDeletePostMutation,
  useDismissReportMutation,
  useGetHealthQuery,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useSendBroadcastMutation,
  useLoginMutation,
} = dashboardApi;

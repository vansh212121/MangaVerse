import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../lib/apiService';
import { useAuthStore } from '../store/useAuthStore';

// =================================================================
// AUTHENTICATION MUTATIONS
// =================================================================

/**
 * Hook for handling user login.
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: api.loginUser,
  });
};

/**
 * Hook for handling new user signup.
 */
export const useSignup = () => {
  return useMutation({
    mutationFn: api.signupUser,
  });
};


// =================================================================
// USER QUERIES
// =================================================================

/**
 * Hook to fetch the currently authenticated user's profile data.
 */
export const useCurrentUser = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: api.fetchCurrentUser,
    // This query will only run if the user is authenticated.
    enabled: isAuthenticated,
  });
};

/**
 * Hook to fetch a specific user by their ID.
 * @param {number} userId - The ID of the user to fetch.
 */
export const useUserById = (userId) => {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: () => api.fetchUserById(userId),
        enabled: !!userId,
    });
};


// =================================================================
// USER COLLECTION QUERIES & MUTATIONS
// =================================================================

/**
 * Hook to fetch the current user's manga collection.
 */
export const useUserCollection = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ['userCollection'],
    queryFn: api.fetchUserCollection,
    // This query will only run if the user is authenticated.
    enabled: isAuthenticated,
  });
};

/**
 * Hook for adding a manga to the user's collection.
 */
export const useAddMangaToCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addMangaToCollection,
    onSuccess: () => {
      // When a manga is added, invalidate the collection query.
      // This tells TanStack Query to automatically refetch the user's collection.
      queryClient.invalidateQueries({ queryKey: ['userCollection'] });
    },
  });
};

/**
 * Hook for updating a manga's status in the user's collection.
 */
export const useUpdateMangaStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateMangaStatus,
    onSuccess: () => {
      // Also refetch the collection when a status is updated.
      queryClient.invalidateQueries({ queryKey: ['userCollection'] });
    },
  });
};

/**
 * Hook for removing a manga from the user's collection.
 */
export const useRemoveMangaFromCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.removeMangaFromCollection,
    onSuccess: () => {
      // Also refetch the collection when a manga is removed.
      queryClient.invalidateQueries({ queryKey: ['userCollection'] });
    },
  });
};

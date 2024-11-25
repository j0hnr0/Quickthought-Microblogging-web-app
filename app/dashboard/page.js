"use client";

import { useQuery } from "@tanstack/react-query";
import CreatePostModal from "@/components/create-post-modal";
import Posts from "@/components/posts";
import PostsSkeleton from "@/components/posts-skeleton";
import LogoutButton from "@/form-components/logout-button";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();

  const {
    data: posts = [], // Provide default empty array
    isLoading,
    isFetching,
    error,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch("/api/posts");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch posts");
      }

      return data;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {isModalOpen && <CreatePostModal onClose={() => setIsModalOpen(false)} />}

      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight truncate">
              Welcome, {session?.user?.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Share your thoughts with the community
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isFetching}
              className="group relative w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                text-white font-medium rounded-lg shadow-sm hover:shadow-md active:shadow-inner
                transform hover:-translate-y-0.5 active:translate-y-0
                transition-all duration-200 ease-in-out
                flex items-center justify-center gap-3
                disabled:opacity-70 disabled:hover:bg-blue-600 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {isFetching ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transform transition-transform duration-200 group-hover:rotate-90"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Create a new post
                </>
              )}
            </button>
            <LogoutButton />
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
          {isFetching && !isLoading && (
            <div className="mt-6">
              <PostsSkeleton />
            </div>
          )}

          {isError && (
            <div className="mx-auto max-w-2xl mt-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-center shadow-sm">
              <p className="font-medium">
                {error.message || "Failed to load posts"}
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="mt-6">
              <PostsSkeleton />
            </div>
          ) : posts.length === 0 ? (
            <div className="mt-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No posts yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first post
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <Posts posts={posts} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

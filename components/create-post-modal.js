"use client";

import Button from "@/form-components/button";
import Textarea from "@/form-components/text-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function CreatePostModal({ onClose }) {
  const [isShowing, setIsShowing] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    defaultValues: {
      content: "",
    },
  });

  const contentMutation = useMutation({
    mutationFn: async (content) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create post");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      handleClose();
    },
    onError: (error) => {
      setError("content", {
        type: "manual",
        message: error.message || "An unexpected error occurred",
      });
    },
  });

  const onSubmit = (data) => {
    contentMutation.mutate(data);
  };

  useEffect(() => {
    setIsShowing(true);
  }, []);

  const handleClose = () => {
    reset();
    setIsShowing(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      onClick={
        isSubmitting || contentMutation.isPending ? undefined : handleClose
      }
      className={`fixed inset-0 flex justify-center items-center bg-gray-900/60 backdrop-blur-sm z-50
        transition-opacity duration-300 
        ${isShowing ? "opacity-100" : "opacity-0"}
        ${
          isSubmitting || contentMutation.isPending
            ? "cursor-not-allowed"
            : "cursor-pointer"
        }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-[90%] max-w-[500px] rounded-2xl bg-white shadow-2xl
          transition-all duration-300 cursor-default
          ${
            isShowing
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-95 translate-y-4 opacity-0"
          }`}
      >
        <div className="p-6 sm:p-8">
          <button
            onClick={handleClose}
            disabled={isSubmitting || contentMutation.isPending}
            className={`absolute right-4 top-4 p-2 rounded-full text-gray-400
              transition-all duration-200
              ${
                isSubmitting || contentMutation.isPending
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100 hover:text-gray-600 active:bg-gray-200"
              }`}
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-2xl font-semibold text-center text-gray-800">
              Create a new post
            </h1>
            <p className="mt-1 text-center text-gray-500 text-sm">
              Share your thoughts with the community
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Textarea
                error={errors.content}
                id="content"
                placeholder="What's on your mind?"
                aria-invalid={!!errors.content}
                className="min-h-[120px] resize-y w-full text-black p-[10px]"
                registration={register("content", {
                  required: "Post content is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Post content is required",
                })}
              />
              {errors.content && (
                <p
                  className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  role="alert"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" />
                  </svg>
                  {errors.content.message}
                </p>
              )}
            </div>

            <div className="flex justify-end items-center gap-3 pt-2">
              <Button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting || contentMutation.isPending}
                className={`px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg
                  transition-all duration-200 
                  ${
                    isSubmitting || contentMutation.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100"
                  }`}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || contentMutation.isPending}
                className={`px-4 py-2 text-white rounded-lg flex items-center gap-2
                  transition-all duration-200
                  ${
                    isSubmitting || contentMutation.isPending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                  }`}
              >
                {isSubmitting || contentMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Create post
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

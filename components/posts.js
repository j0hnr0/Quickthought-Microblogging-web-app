import { Trash2, PenSquare } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import DeleteConfirmationModal from "./delete-confirmation-modal";
import UpdatePostModal from "./update-post-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Posts({ posts }) {
  const { data: session } = useSession();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const queryClient = useQueryClient();

  // Delete mutation (existing code...)
  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete post");
      }

      return data;
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);
      queryClient.setQueryData(["posts"], (old) =>
        old?.filter((post) => post.id !== postId)
      );
      return { previousPosts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsDeleteModalOpen(false);
      setSelectedPost(null);
    },
    onError: (error, _, context) => {
      console.error("Error deleting post:", error);
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, content }) => {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update post");
      }

      return data;
    },
    onMutate: async ({ id, content }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (old) =>
        old?.map((post) => (post.id === id ? { ...post, content } : post))
      );

      return { previousPosts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsUpdateModalOpen(false);
      setSelectedPost(null);
    },
    onError: (error, _, context) => {
      console.error("Error updating post:", error);
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },
  });

  const handleUpdateClick = (post) => {
    setSelectedPost(post);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (post) => {
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  const handleUpdate = (content) => {
    if (!selectedPost) return;
    updateMutation.mutate({ id: selectedPost.id, content });
  };

  const handleCloseUpdateModal = () => {
    if (updateMutation.isPending) return;
    setIsUpdateModalOpen(false);
    setSelectedPost(null);
    updateMutation.reset();
  };

  const handleCloseDeleteModal = () => {
    if (deleteMutation.isPending) return;
    setIsDeleteModalOpen(false);
    setSelectedPost(null);
    deleteMutation.reset();
  };

  return (
    <>
      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group max-w-[1140px] mx-auto bg-white rounded-xl shadow-sm hover:shadow-lg 
              transition-all duration-200 relative overflow-hidden
              border border-gray-100 hover:border-gray-200"
          >
            <div className="p-6">
              {session?.user?.email === post.author.email && (
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateClick(post)}
                    disabled={updateMutation.isPending}
                    className={`p-2 rounded-lg hover:bg-gray-100 transition-colors
                      ${
                        updateMutation.isPending
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-100 active:bg-gray-200"
                      }`}
                    aria-label="Edit post"
                  >
                    <PenSquare
                      size={18}
                      className={`transition-colors duration-200
                        ${
                          updateMutation.isPending
                            ? "text-gray-300"
                            : "text-gray-500 group-hover:text-blue-500"
                        }`}
                    />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(post)}
                    disabled={deleteMutation.isPending}
                    className={`p-2 rounded-lg transition-colors
                      ${
                        deleteMutation.isPending
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-red-50 active:bg-red-100"
                      }`}
                    aria-label="Delete post"
                  >
                    <Trash2
                      size={18}
                      className={`transition-colors duration-200
                        ${
                          deleteMutation.isPending
                            ? "text-gray-300"
                            : "text-gray-500 group-hover:text-red-500"
                        }`}
                    />
                  </button>
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div
                  className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 
                  flex items-center justify-center shadow-inner"
                >
                  <span className="text-blue-600 font-semibold text-lg">
                    {post.author.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {post.author.name}
                  </p>
                  <time
                    className="text-sm text-gray-500"
                    dateTime={post.createdAt}
                  >
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              </div>

              <div className="mt-4 text-gray-700 whitespace-pre-wrap break-words">
                {post.content}
              </div>
            </div>
          </article>
        ))}
      </div>

      <UpdatePostModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onUpdate={handleUpdate}
        initialContent={selectedPost?.content}
        error={updateMutation.error?.message}
        isPending={updateMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={() => deleteMutation.mutate(selectedPost?.id)}
        error={deleteMutation.error?.message}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}

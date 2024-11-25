import { useState, useEffect } from "react";
import Textarea from "@/form-components/text-area";
import { useForm } from "react-hook-form";

export default function UpdatePostModal({
  isOpen,
  onClose,
  onUpdate,
  initialContent,
  error,
  isPending,
}) {
  const [isShowing, setIsShowing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: initialContent,
    },
  });

  useEffect(() => {
    if (isOpen) {
      setIsShowing(true);
      reset({ content: initialContent });
    }
  }, [isOpen, initialContent, reset]);

  const handleClose = () => {
    if (isPending) return;
    setIsShowing(false);
    setTimeout(() => {
      onClose();
      reset();
    }, 300);
  };

  const onSubmit = (data) => {
    onUpdate(data.content);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={isPending ? undefined : handleClose}
      className={`fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50
        transition-opacity duration-200
        ${isShowing ? "opacity-100" : "opacity-0"}
        ${isPending ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-[90%] max-w-[500px] rounded-xl bg-white shadow-xl
          transition-all duration-300 cursor-default
          ${
            isShowing
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-95 translate-y-4 opacity-0"
          }`}
      >
        <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Update Post</h3>
            <p className="mt-1 text-sm text-gray-500">
              Edit your post content below
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isPending}
            className={`p-2 rounded-full text-gray-400
              transition-all duration-200
              ${
                isPending
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
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <Textarea
              error={errors.content}
              id="content"
              rows={6}
              placeholder="What's on your mind?"
              aria-invalid={!!errors.content}
              className="min-h-[160px] resize-y focus:ring-2 focus:ring-blue-500/20 w-full text-black p-[10px]"
              registration={register("content", {
                required: "Content is required",
                validate: (value) =>
                  value.trim().length > 0 || "Content cannot be empty",
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

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100">
              <p
                className="text-sm text-red-600 flex items-center justify-center gap-2"
                role="alert"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <div className="flex justify-end items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg
                transition-all duration-200
                ${
                  isPending
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100"
                }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg
                transition-all duration-200 flex items-center gap-2
                ${
                  isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                }`}
            >
              {isPending ? (
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
                  Updating...
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
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Update
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

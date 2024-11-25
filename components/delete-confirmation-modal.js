export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  error,
  isPending,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50
      animate-in fade-in duration-200"
    >
      <div
        className="bg-white w-[90%] max-w-md rounded-xl shadow-xl
        transform transition-all duration-200 scale-100
        animate-in slide-in-from-bottom-4"
      >
        <div className="p-6 pb-4">
          <div className="flex items-center justify-center">
            <div
              className="h-14 w-14 rounded-full bg-red-100/80 flex items-center justify-center
              shadow-inner animate-bounce-small"
            >
              <svg
                className="h-7 w-7 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
          </div>
          <div className="mt-5 text-center">
            <h3 className="text-xl font-semibold text-gray-900">
              Delete Post?
            </h3>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Are you sure you want to delete this post? This action cannot be
              undone and the post will be permanently removed.
            </p>
          </div>
        </div>

        {error && (
          <div className="px-6 py-3 bg-red-50 border-y border-red-100">
            <p className="text-sm text-red-600 flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" />
              </svg>
              {error}
            </p>
          </div>
        )}

        <div className="p-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className={`px-4 py-2 text-sm font-medium rounded-lg
              transition-all duration-200
              ${
                isPending
                  ? "text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100"
              }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg
              transition-all duration-200 flex items-center gap-2
              ${
                isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 active:bg-red-800"
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
                Deleting...
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

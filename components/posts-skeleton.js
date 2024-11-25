export default function PostsSkeleton() {
  return (
    <div
      className="max-w-[1140px] mx-auto mb-6 bg-white rounded-xl shadow-sm p-6 
      border border-gray-100 overflow-hidden relative"
    >
      {/* Shimmer effect overlay */}
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]
        bg-gradient-to-r from-transparent via-gray-50/50 to-transparent"
      />

      <div className="flex items-start space-x-4">
        {/* Avatar skeleton */}
        <div
          className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 
          shadow-inner animate-pulse"
        />

        {/* Author info skeleton */}
        <div className="flex-1">
          <div className="h-5 w-32 bg-gradient-to-r from-gray-200 to-gray-100 rounded-md animate-pulse" />
          <div className="h-4 w-40 bg-gradient-to-r from-gray-200 to-gray-100 rounded-md mt-2 animate-pulse" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mt-6 space-y-3">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-md animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-md animate-pulse w-[95%]" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-md animate-pulse w-[90%]" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-md animate-pulse w-[85%]" />
      </div>
    </div>
  );
}

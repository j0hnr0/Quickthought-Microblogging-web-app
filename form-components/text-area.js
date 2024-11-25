export default function Textarea({ error, registration, ...props }) {
  return (
    <textarea
      className={`w-full text-black p-3 mt-1 rounded-lg border resize-none
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
      {...props}
      {...registration}
    />
  );
}

export default function Input({ error, registration, ...props }) {
  return (
    <input
      className={`w-full text-black p-[10px] mt-[5px] rounded-[8px] border ${
        error ? "border-red-500" : "border-black"
      }`}
      {...props}
      {...registration}
    />
  );
}

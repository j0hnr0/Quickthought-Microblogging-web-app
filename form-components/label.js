export default function Label({ htmlFor, children }) {
    return (
        <label htmlFor={htmlFor} className="text-black">
        {children}
        </label>
    );
}
export default function Spinner({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300"></div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
      {label ? (
        <p className="mt-3 text-gray-500 text-sm text-center">{label}</p>
      ) : null}
    </div>
  );
}
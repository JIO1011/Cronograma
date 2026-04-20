export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#5b4cfa] rounded-full animate-spin"></div>
        <p className="text-[#1e233a] font-medium text-lg">Cargando Sistema UPS...</p>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center font-sans p-8 text-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-red-100 flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">¡Algo salió mal!</h2>
        <p className="text-gray-500 text-sm">
          No pudimos cargar la información de horarios. Por favor, intenta de nuevo.
        </p>
        <button
          onClick={() => reset()}
          className="mt-4 px-6 py-2.5 w-full bg-[#5b4cfa] hover:bg-[#4a3ce0] text-white rounded-lg transition-colors font-medium shadow-sm"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

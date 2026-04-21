'use client';

import { useState, useTransition } from 'react';
import Papa from 'papaparse';
import { Save } from 'lucide-react';
import { addDayScheduleAction } from '../actions';
import { useRouter } from 'next/navigation';
import { DayOfWeek } from '../types';

interface AdminCSVUploaderProps {
  selectedDay: DayOfWeek;
  csvText: string;
  onChangeCsv: (text: string) => void;
}

export function AdminCSVUploader({ selectedDay, csvText, onChangeCsv }: AdminCSVUploaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = () => {
    setError('');
    setSuccess('');
    if (!csvText.trim()) {
      setError('Por favor ingresa datos CSV.');
      return;
    }

    Papa.parse(csvText, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data as string[][];
        const formattedData = parsedData.map(row => ({
          materia: row[0]?.trim() || '',
          profesor: row[1]?.trim() || '',
          laboratorio: row[2]?.trim() || '',
          hora: row[3]?.trim() || '',
          encargado: row[4]?.trim() || '',
        }));

        startTransition(async () => {
          try {
            const res = await addDayScheduleAction(selectedDay, formattedData);
            if (res && 'error' in res) {
              setError(res.error as string);
            } else {
              setSuccess(`Horarios guardados exitosamente para el día ${selectedDay}.`);
              onChangeCsv('');
              router.refresh();
            }
          } catch (e: any) {
            setError(e.message || 'Error guardando datos al conectar con el servidor');
          }
        });
      },
      error: (err: any) => {
        setError('Error al parsear CSV: ' + err.message);
      }
    });
  };

  const handleClearForm = () => {
    onChangeCsv('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
          Ingresar Datos (CSV) - {selectedDay}
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Formato: Materia, Profesor, Laboratorio, Hora, Encargado
        </p>
      </div>
      <textarea
        value={csvText}
        onChange={(e) => onChangeCsv(e.target.value)}
        className="flex-1 min-h-[150px] w-full border border-gray-300 rounded-lg p-4 font-mono text-[13px] focus:ring-2 focus:ring-[#5b4cfa] focus:border-[#5b4cfa] outline-none resize-none shadow-sm disabled:opacity-50"
        placeholder="Anatomía 1,Biomedicina - Kerly Bolaños,ANATOMÍA,07:00,FERNANDO VELASCO..."
        disabled={isPending}
      />
      {error && <p className="text-red-500 text-sm mt-2 font-medium shrink-0">{error}</p>}
      {success && <p className="text-[#10b981] text-sm mt-2 font-medium shrink-0">{success}</p>}
      
      <div className="mt-6 flex gap-3 shrink-0">
        <button
          onClick={handleClearForm}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50"
          disabled={isPending}
        >
          Limpiar
        </button>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex-[2] flex items-center justify-center gap-2 py-3 bg-[#5b4cfa] hover:bg-[#4a3ce0] text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Guardando...' : (
            <>
              <Save size={18} /> Guardar y publicar
            </>
          )}
        </button>
      </div>
    </div>
  );
}

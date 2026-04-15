'use client';

import { useState, useEffect } from 'react';
import { useSchedule } from '@/hooks/useSchedule';
import { DayOfWeek } from '@/lib/types';
import Papa from 'papaparse';
import { Save, Trash2, ArrowLeft } from 'lucide-react';

const DAYS: DayOfWeek[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];

export default function AdminPage() {
  const { schedule, isLoaded, addDaySchedule, clearSchedule } = useSchedule();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Lunes');
  const [csvText, setCsvText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Default to today
  useEffect(() => {
    const today = new Date().getDay();
    const daysMap: DayOfWeek[] = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    // If weekend, default to Monday
    if (today === 0 || today === 6) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedDay('Lunes');
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedDay(daysMap[today]);
    }
  }, []);

  // Clear messages when day changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCsvText('');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError('');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSuccess('');
  }, [selectedDay]);

  if (!isLoaded) return <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center">Cargando...</div>;

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

        addDaySchedule(selectedDay, formattedData);
        setSuccess(`Horarios guardados exitosamente para el día ${selectedDay}.`);
        setCsvText('');
      },
      error: (err: any) => {
        setError('Error al parsear CSV: ' + err.message);
      }
    });
  };

  const currentDaySchedule = schedule.filter(s => s.dia === selectedDay);

  return (
    <div className="min-h-screen bg-[#f4f5f7] p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#232845] p-6 text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold">Administración de Horarios</h1>
          <button onClick={() => window.close()} className="text-gray-300 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft size={18} /> Cerrar Pestaña
          </button>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Selecciona el Día</h2>
            <div className="flex flex-wrap gap-3">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedDay === day 
                      ? 'bg-[#5b4cfa] text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Input */}
            <div>
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                Ingresar Datos (CSV) - {selectedDay}
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Formato: Materia, Profesor, Laboratorio, Hora, Encargado
              </p>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-4 h-64 font-mono text-sm focus:ring-2 focus:ring-[#5b4cfa] focus:border-[#5b4cfa] outline-none resize-none shadow-sm"
                placeholder="Anatomía 1,Biomedicina - Kerly Bolaños,ANATOMÍA,07:00,FERNANDO VELASCO..."
              />
              {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
              {success && <p className="text-[#10b981] text-sm mt-2 font-medium">{success}</p>}
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setCsvText('');
                    setError('');
                    setSuccess('');
                  }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium shadow-sm"
                >
                  Limpiar todo
                </button>
                <button
                  onClick={handleSave}
                  className="flex-[2] flex items-center justify-center gap-2 py-3 bg-[#5b4cfa] hover:bg-[#4a3ce0] text-white rounded-lg transition-colors font-medium shadow-sm"
                >
                  <Save size={18} />
                  Guardar y publicar
                </button>
              </div>
            </div>

            {/* Right: Preview */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Horarios Actuales - {selectedDay}
                </h2>
                <button
                  onClick={() => {
                    if (confirm('¿Estás seguro de borrar TODOS los horarios de TODA LA SEMANA? Esta acción no se puede deshacer.')) {
                      clearSchedule();
                    }
                  }}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 font-medium transition-colors"
                >
                  <Trash2 size={16} /> Borrar Toda la Semana
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden flex-1 min-h-[300px] bg-gray-50 shadow-sm">
                {currentDaySchedule.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    No hay datos guardados para {selectedDay}
                  </div>
                ) : (
                  <div className="overflow-y-auto h-full max-h-[400px]">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-100 text-gray-600 sticky top-0 shadow-sm">
                        <tr>
                          <th className="px-4 py-3 font-medium">Hora</th>
                          <th className="px-4 py-3 font-medium">Materia</th>
                          <th className="px-4 py-3 font-medium">Laboratorio</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {currentDaySchedule.sort((a,b) => a.hora.localeCompare(b.hora)).map(item => (
                          <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-[#1e233a]">{item.hora}</td>
                            <td className="px-4 py-3 text-gray-700">{item.materia}</td>
                            <td className="px-4 py-3 text-gray-700">{item.laboratorio}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

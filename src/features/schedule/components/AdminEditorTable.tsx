'use client';

import { useState, useTransition } from 'react';
import { ScheduleItem } from '../types';
import { clearScheduleAction, deleteScheduleItemAction, updateScheduleItemAction } from '../actions';
import { useRouter } from 'next/navigation';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import { DayOfWeek } from '../types';

interface AdminEditorTableProps {
  currentDaySchedule: ScheduleItem[];
  selectedDay: DayOfWeek;
}

export function AdminEditorTable({ currentDaySchedule, selectedDay }: AdminEditorTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ScheduleItem>>({});
  const [error, setError] = useState('');

  const handleClear = () => {
    if (confirm('¿Estás seguro de borrar TODOS los horarios de TODA LA SEMANA? Esta acción no se puede deshacer.')) {
      startTransition(async () => {
        try {
          const res = await clearScheduleAction();
          if (res && 'error' in res) {
            setError(res.error as string);
          } else {
            router.refresh();
          }
        } catch (e: any) {
          setError(e.message || 'Error limpiando datos');
        }
      });
    }
  };

  const handleEditClick = (item: ScheduleItem) => {
    setEditingId(item.id!);
    setError('');
    setEditFormData({
      hora: item.hora,
      materia: item.materia,
      laboratorio: item.laboratorio,
      profesor: item.profesor,
      encargado: item.encargado,
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditFormData({});
    setError('');
  };

  const handleEditSave = (id: string) => {
    startTransition(async () => {
      try {
        const res = await updateScheduleItemAction(id, editFormData);
        if (res && 'error' in res) {
          setError(res.error as string);
        } else {
          setEditingId(null);
          setError('');
          router.refresh();
        }
      } catch (e: any) {
        setError(e.message || 'Error al actualizar');
      }
    });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta clase específica?')) {
      startTransition(async () => {
        try {
          const res = await deleteScheduleItemAction(id);
          if (res && 'error' in res) {
            setError(res.error as string);
          } else {
            setError('');
            router.refresh();
          }
        } catch (e: any) {
          setError(e.message || 'Error al eliminar');
        }
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          Horarios Actuales - {selectedDay}
        </h2>
        <button
          onClick={handleClear}
          disabled={isPending}
          className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 size={16} /> Borrar Toda la Semana
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-2 font-medium">{error}</p>}
      
      <div className="border border-gray-200 rounded-lg overflow-hidden flex-1 min-h-[300px] bg-gray-50 shadow-sm relative">
        {currentDaySchedule.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            No hay datos guardados para {selectedDay}
          </div>
        ) : (
          <div className={`overflow-y-auto h-full max-h-[400px] ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
            <table className="w-full text-sm text-left relative">
              <thead className="bg-gray-100 text-gray-600 sticky top-0 shadow-sm z-10 w-full">
                <tr>
                  <th className="px-4 py-3 font-medium">Hora</th>
                  <th className="px-4 py-3 font-medium">Materia</th>
                  <th className="px-4 py-3 font-medium">Laboratorio</th>
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentDaySchedule.sort((a, b) => a.hora.localeCompare(b.hora)).map(item => (
                  <tr key={item.id} className="bg-white hover:bg-gray-50 transition-colors">
                    {editingId === item.id ? (
                      <>
                        <td className="px-2 py-2">
                          <input 
                            className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white focus:ring-1 focus:ring-[#5b4cfa] outline-none" 
                            value={editFormData.hora || ''} 
                            onChange={e => setEditFormData({...editFormData, hora: e.target.value})} 
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input 
                            className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white focus:ring-1 focus:ring-[#5b4cfa] outline-none" 
                            value={editFormData.materia || ''} 
                            onChange={e => setEditFormData({...editFormData, materia: e.target.value})} 
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input 
                            className="w-full border border-gray-300 rounded p-1.5 text-sm bg-white focus:ring-1 focus:ring-[#5b4cfa] outline-none" 
                            value={editFormData.laboratorio || ''} 
                            onChange={e => setEditFormData({...editFormData, laboratorio: e.target.value})} 
                          />
                        </td>
                        <td className="px-2 py-2 text-right whitespace-nowrap">
                          <button onClick={() => handleEditSave(item.id!)} className="text-[#10b981] hover:text-[#059669] p-1.5 mx-1 transition-colors"><Check size={18}/></button>
                          <button onClick={handleEditCancel} className="text-gray-500 hover:text-gray-700 p-1.5 transition-colors"><X size={18}/></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-medium text-[#1e233a] whitespace-nowrap">{item.hora}</td>
                        <td className="px-4 py-3 text-gray-700 line-clamp-1">{item.materia}</td>
                        <td className="px-4 py-3 text-gray-700">{item.laboratorio}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button onClick={() => handleEditClick(item)} className="text-blue-500 hover:text-blue-700 mx-1 transition-colors"><Pencil size={16} /></button>
                          <button onClick={() => handleDeleteItem(item.id!)} className="text-red-500 hover:text-red-700 transition-colors ml-1"><Trash2 size={16} /></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

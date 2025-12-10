import React, { useState } from 'react';
import { Reservation } from '../types';
import Button from './Button';
import PasswordModal from './PasswordModal';

interface ReservationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  reservations: Reservation[];
  onCancelReservation: (id: string) => Promise<void>;
}

const ReservationDetailsModal: React.FC<ReservationDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  date, 
  reservations,
  onCancelReservation
}) => {
  const [selectedIdToCancel, setSelectedIdToCancel] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCancelClick = (id: string) => {
    setSelectedIdToCancel(id);
  };

  const confirmCancel = async () => {
    if (selectedIdToCancel) {
      await onCancelReservation(selectedIdToCancel);
      setSelectedIdToCancel(null);
    }
  };

  // Sort by start time
  const sortedReservations = [...reservations].sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Format date for display
  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times text-xl"></i>
          </button>

          <h3 className="text-xl font-bold text-gray-800 mb-1 capitalize">
            {formattedDate}
          </h3>
          <p className="text-sm text-gray-500 mb-6">Lista de reservas para este dia.</p>

          {sortedReservations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              Nenhuma reserva encontrada para este dia.
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {sortedReservations.map(res => (
                <div key={res.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wide mb-2 bg-blue-100 text-blue-700">
                        <i className="far fa-clock mr-1"></i> {res.startTime} - {res.endTime}
                      </span>
                      <h4 className="font-bold text-gray-800">{res.equipmentName}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        <i className="fas fa-user mr-1 text-gray-400"></i> {res.userName}
                      </p>
                      {res.observation && (
                        <p className="text-xs text-gray-500 mt-2 italic border-l-2 border-gray-300 pl-2">
                          "{res.observation}"
                        </p>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handleCancelClick(res.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      title="Cancelar reserva (Requer senha)"
                    >
                      <i className="fas fa-trash-alt mr-1"></i> Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </div>

      <PasswordModal 
        isOpen={!!selectedIdToCancel}
        onClose={() => setSelectedIdToCancel(null)}
        onConfirm={confirmCancel}
        title="Confirmar Cancelamento"
      />
    </>
  );
};

export default ReservationDetailsModal;
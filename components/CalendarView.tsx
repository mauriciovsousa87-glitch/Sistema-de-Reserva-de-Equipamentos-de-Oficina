import React, { useState, useMemo } from 'react';
import { Reservation, Equipment } from '../types';
import { WEEK_DAYS, MONTHS } from '../constants';
import { Select } from './Input';
import ReservationDetailsModal from './ReservationDetailsModal';

interface CalendarViewProps {
  reservations: Reservation[];
  equipments: Equipment[];
  onCancelReservation: (id: string) => Promise<void>;
}

const CalendarView: React.FC<CalendarViewProps> = ({ reservations, equipments, onCancelReservation }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('all');
  const [selectedDayModal, setSelectedDayModal] = useState<string | null>(null);

  // Helper to get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper to get day of week for 1st of month (0-6)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayStr = new Date().toISOString().split('T')[0];

  // Logic to change month
  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(year, month + delta, 1));
  };

  // Filter reservations based on view
  const filteredReservations = useMemo(() => {
    const res = reservations.filter(r => 
      selectedEquipmentId === 'all' || r.equipmentId === selectedEquipmentId
    );
    // Sort by time within the filtered list isn't strictly necessary for month view, 
    // but good for consistency if we used it.
    return res;
  }, [reservations, selectedEquipmentId]);

  // Generate calendar grid
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="bg-gray-50/50"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = dateStr < todayStr;
      
      const dayReservations = filteredReservations
        .filter(r => r.date === dateStr)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)); // Sort by start time

      const hasReservation = dayReservations.length > 0;
      
      days.push(
        <div 
          key={dateStr}
          onClick={() => setSelectedDayModal(dateStr)}
          className={`
            relative min-h-[100px] border border-gray-200 bg-white p-2 transition-all cursor-pointer hover:bg-blue-50 hover:shadow-inner
            ${isPast ? 'bg-gray-100 text-gray-400' : ''}
            ${dateStr === todayStr ? 'ring-2 ring-blue-500 ring-inset z-10' : ''}
          `}
        >
          <div className="flex justify-between items-start">
            <span className={`font-semibold text-sm ${dateStr === todayStr ? 'text-blue-600' : 'text-gray-700'}`}>
              {day}
            </span>
            {hasReservation && (
               <span className="flex h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </div>

          <div className="mt-2 space-y-1">
            {dayReservations.slice(0, 3).map((res, idx) => (
              <div key={res.id} className="text-[10px] truncate rounded px-1 py-0.5 bg-blue-100 text-blue-800 border border-blue-200">
                {selectedEquipmentId === 'all' 
                  ? res.equipmentName.split(' ')[0].substring(0, 8) + '..' 
                  : `${res.startTime}-${res.endTime}`
                }
              </div>
            ))}
            {dayReservations.length > 3 && (
              <div className="text-[10px] text-gray-500 pl-1">
                + {dayReservations.length - 3} mais
              </div>
            )}
          </div>
        </div>
      );
    }
    return days;
  };

  const getDayReservationsForModal = () => {
    if (!selectedDayModal) return [];
    return reservations.filter(r => 
        r.date === selectedDayModal && 
        (selectedEquipmentId === 'all' || r.equipmentId === selectedEquipmentId)
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Calendar Header Controls */}
      <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <h2 className="text-xl font-bold text-gray-800 min-w-[180px] text-center">
            {MONTHS[month]} {year}
          </h2>
          <button 
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="w-full md:w-64">
           <Select 
             value={selectedEquipmentId} 
             onChange={(e) => setSelectedEquipmentId(e.target.value)}
             className="bg-white shadow-sm"
           >
             <option value="all">Todos os Equipamentos</option>
             {equipments.map(eq => (
               <option key={eq.id} value={eq.id}>{eq.name}</option>
             ))}
           </Select>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {WEEK_DAYS.map(day => (
          <div key={day} className="py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 bg-gray-200 gap-px border-b border-gray-200">
        {renderCalendarDays()}
      </div>

      {/* Details Modal */}
      <ReservationDetailsModal 
        isOpen={!!selectedDayModal}
        onClose={() => setSelectedDayModal(null)}
        date={selectedDayModal || ''}
        reservations={getDayReservationsForModal()}
        onCancelReservation={async (id) => {
          await onCancelReservation(id);
        }}
      />
    </div>
  );
};

export default CalendarView;
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import ReservationForm from './components/ReservationForm';
import CalendarView from './components/CalendarView';
import Reports from './components/Reports';
import { reservationService } from './services/reservationService';
import { Equipment, Reservation } from './types';

// Navbar Component internal to App for simplicity in structure
const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => 
    location.pathname === path ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white";

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-tools text-white"></i>
            </div>
            <span className="font-bold text-xl tracking-tight">Oficina<span className="text-blue-400">Reserva</span></span>
          </div>
          <div className="flex gap-4">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')}`}>
              <i className="fas fa-home mr-2"></i> Início
            </Link>
            <Link to="/relatorios" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/relatorios')}`}>
              <i className="fas fa-chart-line mr-2"></i> Relatórios
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Dashboard = ({ 
  equipments, 
  reservations, 
  onRefresh,
  onCancel 
}: { 
  equipments: Equipment[], 
  reservations: Reservation[], 
  onRefresh: () => void,
  onCancel: (id: string) => Promise<void>
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <ReservationForm onSuccess={onRefresh} equipments={equipments} />
      </section>
      <section>
        <div className="flex items-center gap-2 mb-4">
           <i className="fas fa-calendar-alt text-blue-600 text-xl"></i>
           <h2 className="text-xl font-bold text-gray-800">Calendário de Reservas</h2>
        </div>
        <p className="text-gray-500 mb-4 text-sm">
          Clique em um dia para ver detalhes ou cancelar reservas (Requer senha de Gerente).
        </p>
        <CalendarView 
          reservations={reservations} 
          equipments={equipments}
          onCancelReservation={onCancel}
        />
      </section>
    </div>
  );
};

const App: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const eqs = await reservationService.getEquipments();
      const res = await reservationService.getReservations();
      setEquipments(eqs);
      setReservations(res);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelReservation = async (id: string) => {
    try {
      await reservationService.deleteReservation(id);
      // Refresh local state
      await fetchData();
      alert("Reserva cancelada com sucesso!");
    } catch (error) {
      alert("Erro ao cancelar reserva.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <i className="fas fa-circle-notch fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-gray-600">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 pb-12 font-sans">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  equipments={equipments} 
                  reservations={reservations} 
                  onRefresh={fetchData} 
                  onCancel={handleCancelReservation}
                />
              } 
            />
            <Route 
              path="/relatorios" 
              element={
                <Reports 
                  reservations={reservations} 
                  equipments={equipments} 
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;

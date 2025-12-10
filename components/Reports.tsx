import React, { useState, useMemo } from 'react';
import { Reservation, Equipment } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Input } from './Input';
import Button from './Button';

interface ReportsProps {
  reservations: Reservation[];
  equipments: Equipment[];
}

const Reports: React.FC<ReportsProps> = ({ reservations, equipments }) => {
  // Default to current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  const stats = useMemo(() => {
    // Filter by date range
    const filtered = reservations.filter(r => r.date >= startDate && r.date <= endDate);

    // Group by equipment
    const data = equipments.map(eq => {
      const count = filtered.filter(r => r.equipmentId === eq.id).length;
      return {
        name: eq.name,
        reservas: count
      };
    });

    return { data, total: filtered.length };
  }, [reservations, startDate, endDate, equipments]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-chart-bar text-indigo-600"></i> Relatório de Ocupação
        </h2>

        <div className="flex flex-col md:flex-row gap-4 mb-8 items-end">
          <Input 
            type="date" 
            label="Data Inicial" 
            value={startDate} 
            onChange={e => setStartDate(e.target.value)}
          />
          <Input 
            type="date" 
            label="Data Final" 
            value={endDate} 
            onChange={e => setEndDate(e.target.value)}
          />
          <div className="pb-2 text-sm text-gray-500">
            Total no período: <span className="font-bold text-gray-900">{stats.total}</span>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} />
              <YAxis allowDecimals={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f1f5f9' }}
              />
              <Legend />
              <Bar dataKey="reservas" fill="#3b82f6" name="Qtd. Reservas" radius={[4, 4, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Simple Table View */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Detalhes por Equipamento</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-800 border-b">
              <tr>
                <th className="p-3">Equipamento</th>
                <th className="p-3 text-right">Total de Reservas</th>
                <th className="p-3 text-right">% do Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.data.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3 text-right">{item.reservas}</td>
                  <td className="p-3 text-right">
                    {stats.total > 0 ? ((item.reservas / stats.total) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;

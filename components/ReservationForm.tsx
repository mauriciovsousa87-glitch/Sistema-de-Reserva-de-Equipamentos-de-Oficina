import React, { useState, useEffect } from 'react';
import { Equipment } from '../types';
import { reservationService } from '../services/reservationService';
import { HOURS } from '../constants';
import Button from './Button';
import { Input, Select } from './Input';

interface ReservationFormProps {
  onSuccess: () => void;
  equipments: Equipment[];
}

const ReservationForm: React.FC<ReservationFormProps> = ({ onSuccess, equipments }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    equipmentId: '',
    date: '',
    startTime: '',
    endTime: '',
    userName: '',
    observation: ''
  });

  // Reset messages after 5 seconds
  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
        setErrorMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  // Reset end time if start time becomes >= end time
  useEffect(() => {
      if (formData.startTime && formData.endTime) {
          if (formData.endTime <= formData.startTime) {
              setFormData(prev => ({ ...prev, endTime: '' }));
          }
      }
  }, [formData.startTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Basic Validation
    if (!formData.equipmentId || !formData.date || !formData.startTime || !formData.endTime || !formData.userName) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (formData.endTime <= formData.startTime) {
        setErrorMsg("A hora final deve ser maior que a hora inicial.");
        return;
    }

    // Date Validation (No past dates)
    const today = new Date().toISOString().split('T')[0];
    if (formData.date < today) {
      setErrorMsg("Não é possível reservar em datas passadas.");
      return;
    }

    setLoading(true);
    try {
      await reservationService.createReservation({
        equipmentId: formData.equipmentId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        userName: formData.userName,
        observation: formData.observation
      });

      setSuccessMsg("Reserva realizada com sucesso!");
      setFormData({
        equipmentId: '',
        date: '',
        startTime: '',
        endTime: '',
        userName: '',
        observation: ''
      });
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao realizar reserva.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Filter available end times based on start time
  const getEndTimes = () => {
      if (!formData.startTime) return HOURS;
      const startIndex = HOURS.indexOf(formData.startTime);
      return HOURS.slice(startIndex + 1);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <i className="fas fa-calendar-plus text-blue-600"></i> Nova Reserva
      </h2>

      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-200 flex items-center gap-2">
          <i className="fas fa-exclamation-circle"></i> {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm border border-green-200 flex items-center gap-2">
          <i className="fas fa-check-circle"></i> {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Select 
          label="Equipamento *" 
          value={formData.equipmentId} 
          onChange={(e) => handleChange('equipmentId', e.target.value)}
        >
          <option value="">Selecione...</option>
          {equipments.map(eq => (
            <option key={eq.id} value={eq.id}>{eq.name}</option>
          ))}
        </Select>

        <Input 
          type="date" 
          label="Data *" 
          value={formData.date}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => handleChange('date', e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2">
            <Select 
            label="Início *" 
            value={formData.startTime}
            onChange={(e) => handleChange('startTime', e.target.value)}
            >
            <option value="">--:--</option>
            {HOURS.map(h => (
                <option key={`start-${h}`} value={h}>{h}</option>
            ))}
            </Select>

            <Select 
            label="Fim *" 
            value={formData.endTime}
            onChange={(e) => handleChange('endTime', e.target.value)}
            disabled={!formData.startTime}
            >
            <option value="">--:--</option>
            {getEndTimes().map(h => (
                <option key={`end-${h}`} value={h}>{h}</option>
            ))}
            </Select>
        </div>

        <Input 
          type="text" 
          label="Nome do Solicitante *" 
          placeholder="Ex: João Silva"
          value={formData.userName}
          onChange={(e) => handleChange('userName', e.target.value)}
        />

        <Input 
          type="text" 
          label="Observações (Opcional)" 
          placeholder="Ex: Manutenção preventiva"
          className="md:col-span-2 lg:col-span-1"
          value={formData.observation}
          onChange={(e) => handleChange('observation', e.target.value)}
        />

        <div className="flex items-end">
          <Button type="submit" isLoading={loading} className="w-full">
            Reservar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;
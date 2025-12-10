
import { Reservation, Equipment } from '../types';
import { INITIAL_EQUIPMENT } from '../constants';
import { supabase } from '../supabaseClient';

const TABLE_RESERVATIONS = 'reservations';

class ReservationService {
  
  async getEquipments(): Promise<Equipment[]> {
    return INITIAL_EQUIPMENT; 
  }

  async getReservations(): Promise<Reservation[]> {
    try {
      // Select all columns from reservations table
      const { data, error } = await supabase
        .from(TABLE_RESERVATIONS)
        .select('*');

      if (error) throw error;
      
      if (!data) return [];

      // Map Supabase data to our Type
      return data.map((item: any) => ({
        id: item.id.toString(), // Ensure ID is string
        equipmentId: item.equipmentId,
        equipmentName: item.equipmentName,
        date: item.date,
        startTime: item.startTime,
        endTime: item.endTime,
        userName: item.userName,
        observation: item.observation,
        createdAt: item.createdAt
      }));

    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      return [];
    }
  }

  async createReservation(reservation: Omit<Reservation, 'id' | 'createdAt' | 'equipmentName'>): Promise<Reservation> {
    
    // 1. Check conflicts locally (simpler than writing complex DB function for prototype)
    const currentReservations = await this.getReservations();
    
    const exists = currentReservations.some(r => {
      if (r.equipmentId !== reservation.equipmentId) return false;
      if (r.date !== reservation.date) return false;

      // Overlap logic: (StartA < EndB) and (EndA > StartB)
      return (reservation.startTime < r.endTime && reservation.endTime > r.startTime);
    });

    if (exists) {
      throw new Error('Este equipamento já está reservado neste horário (atualize a página para ver).');
    }

    const equipments = await this.getEquipments();
    const eq = equipments.find(e => e.id === reservation.equipmentId);
    const equipmentName = eq ? eq.name : 'Desconhecido';
    const createdAt = Date.now();

    const newReservationData = {
      equipmentId: reservation.equipmentId,
      equipmentName: equipmentName,
      date: reservation.date,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      userName: reservation.userName,
      observation: reservation.observation || '',
      createdAt: createdAt
    };

    // Insert into Supabase
    const { data, error } = await supabase
      .from(TABLE_RESERVATIONS)
      .insert([newReservationData])
      .select();

    if (error) {
      console.error(error);
      throw new Error("Erro ao salvar no banco de dados.");
    }

    return {
      ...newReservationData,
      id: data[0].id.toString(),
      observation: reservation.observation // ensure undefined is handled
    };
  }

  async deleteReservation(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLE_RESERVATIONS)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao deletar reserva:", error);
      throw new Error("Não foi possível cancelar a reserva.");
    }
  }
}

export const reservationService = new ReservationService();

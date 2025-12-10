import { Reservation, Equipment } from '../types';
import { INITIAL_EQUIPMENT } from '../constants';

const STORAGE_KEY_RESERVATIONS = 'oficina_reservations_v1';
const STORAGE_KEY_EQUIPMENT = 'oficina_equipment_v1';

// Simulate network delay for realism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ReservationService {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(STORAGE_KEY_EQUIPMENT)) {
      localStorage.setItem(STORAGE_KEY_EQUIPMENT, JSON.stringify(INITIAL_EQUIPMENT));
    }
  }

  // --- Equipment Methods ---

  async getEquipments(): Promise<Equipment[]> {
    await delay(200);
    const data = localStorage.getItem(STORAGE_KEY_EQUIPMENT);
    return data ? JSON.parse(data) : INITIAL_EQUIPMENT;
  }

  // --- Reservation Methods ---

  async getReservations(): Promise<Reservation[]> {
    await delay(300);
    const data = localStorage.getItem(STORAGE_KEY_RESERVATIONS);
    return data ? JSON.parse(data) : [];
  }

  async createReservation(reservation: Omit<Reservation, 'id' | 'createdAt' | 'equipmentName'>): Promise<Reservation> {
    await delay(400);
    const reservations = await this.getReservations();
    
    // Logic: Check existing reservation (Time Range Overlap)
    // Overlap exists if: (StartA < EndB) and (EndA > StartB)
    const exists = reservations.some(r => {
      if (r.equipmentId !== reservation.equipmentId) return false;
      if (r.date !== reservation.date) return false;

      // String comparison works for "HH:00" format (e.g. "08:00" < "09:00")
      return (reservation.startTime < r.endTime && reservation.endTime > r.startTime);
    });

    if (exists) {
      throw new Error('Este equipamento já está reservado neste horário.');
    }

    // Logic: User limit rule (Optional: limit 1 per user per equipment per day)
    // We relaxed this slightly for hourly bookings, but let's keep it to prevent spamming
    // or maybe remove it since a user might book morning AND afternoon hours separately.
    // Let's REMOVE strict 1-per-day limit for hourly system to allow booking 08-09 then 14-15.
    // But we can check if they are booking the EXACT same slot again (already covered by collision check).
    
    // Let's implement a rule: A user cannot overlap with THEMSELVES (already covered)
    // Let's skip the "1 reservation per day" rule for hourly mode to be more flexible.

    const equipments = await this.getEquipments();
    const eq = equipments.find(e => e.id === reservation.equipmentId);

    const newReservation: Reservation = {
      ...reservation,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      equipmentName: eq ? eq.name : 'Desconhecido'
    };

    reservations.push(newReservation);
    localStorage.setItem(STORAGE_KEY_RESERVATIONS, JSON.stringify(reservations));
    
    return newReservation;
  }

  async deleteReservation(id: string): Promise<void> {
    await delay(300);
    const reservations = await this.getReservations();
    const filtered = reservations.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY_RESERVATIONS, JSON.stringify(filtered));
  }
}

export const reservationService = new ReservationService();
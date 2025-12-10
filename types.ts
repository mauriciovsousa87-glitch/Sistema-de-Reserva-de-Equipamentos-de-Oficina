export interface Equipment {
  id: string;
  name: string;
  color: string; // Tailwind color class or hex for border/bg
}

export interface Reservation {
  id: string;
  equipmentId: string;
  equipmentName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:00
  endTime: string; // HH:00
  userName: string;
  observation?: string;
  createdAt: number;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface Stats {
  equipmentName: string;
  count: number;
}
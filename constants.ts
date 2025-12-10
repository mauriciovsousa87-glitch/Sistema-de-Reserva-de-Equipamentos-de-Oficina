import { Equipment } from './types';

export const INITIAL_EQUIPMENT: Equipment[] = [
  { id: 'eq-1', name: 'Plataforma Pantográfica 1', color: 'blue' },
  { id: 'eq-2', name: 'Plataforma Pantográfica 2', color: 'indigo' },
  { id: 'eq-3', name: 'Furadeira de Coluna', color: 'emerald' },
];

// Generate hours from 07:00 to 19:00
export const HOURS: string[] = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export const MANAGER_PASSWORD = '1234';

export const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export type UserRole = 'patient' | 'doctor' | 'staff';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Patient extends User {
  role: 'patient';
  phone?: string;
  dateOfBirth?: string;
  address?: string;
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  availability?: AvailabilitySlot[];
}

export interface Staff extends User {
  role: 'staff';
  department: string;
}

export interface AvailabilitySlot {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // format: HH:mm
  endTime: string; // format: HH:mm
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'missed';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  date: string; // ISO date string
  reason: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface Bill {
  id: string;
  appointmentId: string;
  patientId: string;
  amount: number;
  services: BillService[];
  status: 'unpaid' | 'paid' | 'partially_paid';
  dueDate: string; // ISO date string
  dateIssued: string; // ISO date string
  datePaid?: string; // ISO date string
  notes?: string;
}

export interface BillService {
  id: string;
  name: string;
  description?: string;
  cost: number;
}

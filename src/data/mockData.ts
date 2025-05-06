
import { Appointment, Bill, Doctor, Patient, Staff } from "@/types";

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    name: "John Doe",
    role: "patient",
    phone: "555-123-4567",
    dateOfBirth: "1985-05-15",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: "2",
    email: "sarah.smith@example.com",
    name: "Sarah Smith",
    role: "patient",
    phone: "555-987-6543",
    dateOfBirth: "1990-11-23",
    address: "456 Oak Ave, Somewhere, USA",
  },
  {
    id: "3",
    email: "robert.johnson@example.com",
    name: "Robert Johnson",
    role: "patient",
    phone: "555-456-7890",
    dateOfBirth: "1978-03-10",
    address: "789 Pine St, Elsewhere, USA",
  },
];

// Mock Doctors
export const mockDoctors: Doctor[] = [
  {
    id: "1",
    email: "dr.williams@example.com",
    name: "Dr. Emily Williams",
    role: "doctor",
    specialization: "Cardiology",
  },
  {
    id: "2",
    email: "dr.chen@example.com",
    name: "Dr. Michael Chen",
    role: "doctor",
    specialization: "Pediatrics",
  },
  {
    id: "3",
    email: "dr.patel@example.com",
    name: "Dr. Priya Patel",
    role: "doctor",
    specialization: "Dermatology",
  },
];

// Mock Staff
export const mockStaff: Staff[] = [
  {
    id: "1",
    email: "lisa.admin@example.com",
    name: "Lisa Thompson",
    role: "staff",
    department: "Administration",
  },
  {
    id: "2",
    email: "james.billing@example.com",
    name: "James Wilson",
    role: "staff",
    department: "Billing",
  },
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    doctorId: "1",
    date: "2025-05-10",
    time: "09:00",
    duration: 30,
    reason: "Annual checkup",
    status: "confirmed",
  },
  {
    id: "2",
    patientId: "2",
    doctorId: "2",
    date: "2025-05-10",
    time: "10:30",
    duration: 45,
    reason: "Flu symptoms",
    status: "pending",
  },
  {
    id: "3",
    patientId: "3",
    doctorId: "3",
    date: "2025-05-09",
    time: "14:00",
    duration: 30,
    reason: "Skin rash consultation",
    status: "completed",
    notes: "Prescribed antihistamine cream. Follow up in 2 weeks.",
  },
  {
    id: "4",
    patientId: "1",
    doctorId: "2",
    date: "2025-05-08",
    time: "11:00",
    duration: 30,
    reason: "Vaccination",
    status: "completed",
    notes: "Administered flu vaccine.",
  },
  {
    id: "5",
    patientId: "2",
    doctorId: "1",
    date: "2025-05-12",
    time: "16:00",
    duration: 45,
    reason: "Heart palpitations",
    status: "confirmed",
  },
  {
    id: "6",
    patientId: "3",
    doctorId: "3",
    date: "2025-05-07",
    time: "09:30",
    duration: 30,
    reason: "Acne treatment follow-up",
    status: "missed",
  },
];

// Mock Bills
export const mockBills: Bill[] = [
  {
    id: "1",
    appointmentId: "3",
    patientId: "3",
    amount: 150,
    services: [
      {
        id: "s1",
        name: "Dermatology Consultation",
        description: "Initial consultation",
        cost: 100,
      },
      {
        id: "s2",
        name: "Prescription",
        description: "Antihistamine cream",
        cost: 50,
      },
    ],
    status: "paid",
    dueDate: "2025-05-23",
    dateIssued: "2025-05-09",
    datePaid: "2025-05-10",
  },
  {
    id: "2",
    appointmentId: "4",
    patientId: "1",
    amount: 75,
    services: [
      {
        id: "s3",
        name: "Vaccination",
        description: "Flu vaccine",
        cost: 75,
      },
    ],
    status: "unpaid",
    dueDate: "2025-05-22",
    dateIssued: "2025-05-08",
  },
];

// Helper function to get patient name by ID
export const getPatientNameById = (id: string): string => {
  const patient = mockPatients.find(p => p.id === id);
  return patient ? patient.name : "Unknown Patient";
};

// Helper function to get doctor name by ID
export const getDoctorNameById = (id: string): string => {
  const doctor = mockDoctors.find(d => d.id === id);
  return doctor ? doctor.name : "Unknown Doctor";
};

// Helper function to get appointment by ID
export const getAppointmentById = (id: string): Appointment | undefined => {
  return mockAppointments.find(a => a.id === id);
};

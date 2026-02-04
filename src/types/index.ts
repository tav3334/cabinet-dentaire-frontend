// User types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

// Patient types
export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string | null;
  phone: string;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'other' | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  medical_history: string | null;
  allergies: string | null;
  notes: string | null;
  age?: number | null;
  created_at: string;
  updated_at: string;
  appointments?: Appointment[];
  treatments?: Treatment[];
  consultations?: Consultation[];
}

export interface PatientFormData {
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  postal_code?: string;
  medical_history?: string;
  allergies?: string;
  notes?: string;
}

// Service types
export interface Service {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceFormData {
  title: string;
  description?: string;
  image?: string;
}

// Appointment types
export type AppointmentStatus = 'pending' | 'confirmed' | 'canceled' | 'completed';

export interface Appointment {
  id: number;
  patient_id: number | null;
  service_id: number;
  name: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  duration: number | null;
  message: string | null;
  status: AppointmentStatus;
  status_label?: string;
  status_badge?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  patient?: Patient;
  service?: Service;
}

export interface AppointmentFormData {
  patient_id?: number;
  service_id: number;
  name?: string;
  phone?: string;
  appointment_date: string;
  appointment_time: string;
  duration?: number;
  message?: string;
  status?: AppointmentStatus;
}

// Treatment types
export type TreatmentStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
export type TreatmentCategory =
  | 'consultation'
  | 'preventive'
  | 'restorative'
  | 'endodontic'
  | 'periodontic'
  | 'surgery'
  | 'prosthetic'
  | 'orthodontic'
  | 'cosmetic'
  | 'emergency';

export interface Treatment {
  id: number;
  patient_id: number;
  appointment_id: number | null;
  title: string;
  description: string | null;
  tooth_number: string | null;
  category: TreatmentCategory;
  status: TreatmentStatus;
  status_label?: string;
  category_label?: string;
  estimated_cost: number | null;
  actual_cost: number | null;
  planned_date: string | null;
  completed_date: string | null;
  sessions_required: number | null;
  sessions_completed: number | null;
  progress_percentage?: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  appointment?: Appointment;
}

export interface TreatmentFormData {
  patient_id: number;
  appointment_id?: number;
  title: string;
  description?: string;
  tooth_number?: string;
  category: TreatmentCategory;
  status?: TreatmentStatus;
  estimated_cost?: number;
  actual_cost?: number;
  planned_date?: string;
  completed_date?: string;
  sessions_required?: number;
  sessions_completed?: number;
  notes?: string;
}

// Consultation types
export type ConsultationType = 'first_visit' | 'follow_up' | 'emergency' | 'control' | 'treatment';

export interface Consultation {
  id: number;
  patient_id: number;
  appointment_id: number | null;
  consultation_date: string;
  consultation_time: string | null;
  type: ConsultationType;
  type_label?: string;
  chief_complaint: string | null;
  clinical_examination: string | null;
  oral_hygiene: string | null;
  periodontal_status: string | null;
  dental_chart: Record<string, unknown> | null;
  diagnosis: string | null;
  treatment_plan: string | null;
  prescriptions: string | null;
  recommendations: string | null;
  next_appointment_date: string | null;
  notes: string | null;
  practitioner_id: number | null;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  appointment?: Appointment;
  practitioner?: User;
}

export interface ConsultationFormData {
  patient_id: number;
  appointment_id?: number;
  consultation_date: string;
  consultation_time?: string;
  type: ConsultationType;
  chief_complaint?: string;
  clinical_examination?: string;
  oral_hygiene?: string;
  periodontal_status?: string;
  dental_chart?: Record<string, unknown>;
  diagnosis?: string;
  treatment_plan?: string;
  prescriptions?: string;
  recommendations?: string;
  next_appointment_date?: string;
  notes?: string;
  practitioner_id?: number;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

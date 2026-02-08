import { z } from 'zod';

// ============================================
// Patient Validation Schema
// ============================================
export const patientSchema = z.object({
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z
    .string()
    .min(8, 'Le téléphone doit contenir au moins 8 caractères')
    .regex(/^[0-9+\s()-]+$/, 'Format de téléphone invalide'),
  date_of_birth: z.string().optional().or(z.literal('')),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  postal_code: z.string().optional().or(z.literal('')),
  medical_history: z.string().optional().or(z.literal('')),
  allergies: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

export type PatientFormSchema = z.infer<typeof patientSchema>;

// ============================================
// Appointment Validation Schema
// ============================================
export const appointmentSchema = z.object({
  patient_id: z.number().optional(),
  service_id: z.number({ error: 'Le service est requis' }).min(1, 'Le service est requis'),
  name: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  appointment_date: z.string().min(1, 'La date est requise'),
  appointment_time: z.string().min(1, "L'heure est requise"),
  duration: z.number().min(15, 'La durée minimum est de 15 minutes').optional(),
  message: z.string().optional().or(z.literal('')),
  status: z.enum(['pending', 'confirmed', 'canceled', 'completed']).optional(),
}).refine(
  (data) => {
    if (!data.patient_id) {
      return !!data.name && data.name.length >= 2;
    }
    return true;
  },
  { message: 'Le nom est requis pour un nouveau patient', path: ['name'] }
).refine(
  (data) => {
    if (!data.patient_id) {
      return !!data.phone && data.phone.length >= 8;
    }
    return true;
  },
  { message: 'Le téléphone est requis pour un nouveau patient', path: ['phone'] }
);

export type AppointmentFormSchema = z.infer<typeof appointmentSchema>;

// ============================================
// Treatment Validation Schema
// ============================================
export const treatmentSchema = z.object({
  patient_id: z.number({ error: 'Le patient est requis' }).min(1, 'Le patient est requis'),
  appointment_id: z.number().optional(),
  title: z.string().min(2, 'Le titre doit contenir au moins 2 caractères'),
  description: z.string().optional().or(z.literal('')),
  tooth_number: z.string().optional().or(z.literal('')),
  category: z.enum([
    'consultation', 'preventive', 'restorative', 'endodontic',
    'periodontic', 'surgery', 'prosthetic', 'orthodontic',
    'cosmetic', 'emergency',
  ], { error: 'La catégorie est requise' }),
  status: z.enum(['planned', 'in_progress', 'completed', 'cancelled', 'on_hold']).optional(),
  estimated_cost: z.number().min(0, 'Le coût ne peut pas être négatif').optional().or(z.nan()),
  actual_cost: z.number().min(0, 'Le coût ne peut pas être négatif').optional().or(z.nan()),
  planned_date: z.string().optional().or(z.literal('')),
  completed_date: z.string().optional().or(z.literal('')),
  sessions_required: z.number().min(1, 'Minimum 1 séance').optional().or(z.nan()),
  sessions_completed: z.number().min(0, 'Valeur invalide').optional().or(z.nan()),
  notes: z.string().optional().or(z.literal('')),
});

export type TreatmentFormSchema = z.infer<typeof treatmentSchema>;

// ============================================
// Consultation Validation Schema
// ============================================
export const consultationSchema = z.object({
  patient_id: z.number({ error: 'Le patient est requis' }).min(1, 'Le patient est requis'),
  appointment_id: z.number().optional(),
  consultation_date: z.string().min(1, 'La date est requise'),
  consultation_time: z.string().optional().or(z.literal('')),
  type: z.enum(['first_visit', 'follow_up', 'emergency', 'control', 'treatment'], {
    error: 'Le type de consultation est requis',
  }),
  chief_complaint: z.string().optional().or(z.literal('')),
  clinical_examination: z.string().optional().or(z.literal('')),
  oral_hygiene: z.string().optional().or(z.literal('')),
  periodontal_status: z.string().optional().or(z.literal('')),
  dental_chart: z.record(z.string(), z.unknown()).optional(),
  diagnosis: z.string().optional().or(z.literal('')),
  treatment_plan: z.string().optional().or(z.literal('')),
  prescriptions: z.string().optional().or(z.literal('')),
  recommendations: z.string().optional().or(z.literal('')),
  next_appointment_date: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  practitioner_id: z.number().optional(),
});

export type ConsultationFormSchema = z.infer<typeof consultationSchema>;

// ============================================
// Auth Validation Schemas
// ============================================
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export type LoginFormSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['password_confirmation'],
});

export type RegisterFormSchema = z.infer<typeof registerSchema>;

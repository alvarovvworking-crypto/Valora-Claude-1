export type Client = {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  company: string | null;
  notes: string | null;
  created_at: string;
};

export type Sale = {
  id: string;
  user_id: string;
  client_id: string | null;
  client_name: string;
  project_name: string;
  service_type: string;
  hours: number;
  base_rate: number;
  final_rate: number;
  total: number;
  status: "borrador" | "enviado" | "aceptado" | "rechazado" | "cobrado";
  created_at: string;
};

export type Settings = {
  user_id: string;
  full_name: string | null;
  business_name: string | null;
  currency: string;
  default_rates: Record<string, number> | null;
};

export interface User {
    id: number;
    username: string;
    email: string;
    encrypted_password: string;
    created_at: Date;
    updated_at: Date;
  }
  
export interface Squad {
  id: number;
  squad_name: string;
  squad_description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Membership {
  id: number;
  created_at: Date;
  updated_at: Date;
  user_id: number;
  squad_id: number;
}

export interface Visit {
  id: number;
  visit_date: Date;
  user_id: number;
}
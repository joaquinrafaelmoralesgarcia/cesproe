export type Screen = 
  | 'landing'
  | 'onboarding'
  | 'tier-selection'
  | 'dashboard'
  | 'booking'
  | 'fleet'
  | 'operations'
  | 'admin';

export interface Vehicle {
  id: string;
  name: string;
  category: string;
  description: string;
  armor: string;
  capacity?: string;
  units?: number;
  price: number;
  eta: number;
  image: string;
  icon: string;
}

export interface Tier {
  id: string;
  name: string;
  price: string;
  tag: string;
  features: string[];
  mostRequested?: boolean;
}

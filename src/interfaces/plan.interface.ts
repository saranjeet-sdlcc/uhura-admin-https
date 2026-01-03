export interface PlanFeature {
  type: string; 
}

export interface CreatePlanRequest {
  name: string;
  slug: string;
  price: number;
  currency?: string;
  frequency: 'Monthly' | 'Yearly' | 'Lifetime';
  features: string[]; 
}

export interface UpdatePlanRequest {
  name?: string;
  price?: number;
  isActive?: boolean;
  features?: string[];
}

export interface PlanResponse {
  _id: string;
  planId: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  frequency: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
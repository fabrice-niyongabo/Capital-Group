import { IPlan } from "./plan";

export interface IInvestmentUserDetails {
  id: number;
  email: string;
  firstName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastName: string;
  created_at: string;
  updated_at: string;
}

export interface IAgentPhone {
  id: number;
  isdeleted: boolean;
  name: string;
  phone: string;
  created_at: string;
  updated_at: string;
}
export interface IInvestment {
  id: number;
  agent_phone: IAgentPhone;
  amount: number;
  created_at: string;
  deposit_phone_number: string;
  earning_end_date: string;
  earning_start_date: string;
  earning_status: string;
  payment_proof: string;
  payment_status: string;
  plan: IPlan;
  updated_at: string;
  user: IInvestmentUserDetails;
}

export interface IInvestmentResponse {
  items: IInvestment[];
  page: number;
  pages: number;
  per_page: number;
  total: number;
}

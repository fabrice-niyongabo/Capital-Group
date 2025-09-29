export interface IWithdrawal {
  id: number;
  userId: number;
  amount: string;
  status: string;
  withdrawal_phone_number: string;
  approval_comment: string;
  transaction_type: string;
  created_at: string;
  updated_at: string;
}

export interface IWithdrawalResponse {
  items: IWithdrawal[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

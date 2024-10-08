export interface BillInstanceType {
  id: number;
  bill_id: number;
  name: string;
  month: Date;
  due_date: Date;
  amount: number;
  is_paid: boolean;
  description: string;
}
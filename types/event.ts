export interface EventType {
  id: number;
  month: Date;
  dueDate: Date;
  billName: string;
  profileName: string;
  amount: number;
  isPaid: boolean;
}
export interface BookingTimeline {
  label: string;
  date: string;
  state: 'completed' | 'current' | 'pending';
}

export interface Booking {
  _id?: string;
  id?: number;
  bookingCode: string;
  type: 'rental' | 'purchase';
  title: string;
  image: string | null;
  dates: string;
  startDate?: string;
  endDate?: string;
  price: number;
  totalDays?: number;
  status: 'active' | 'processing' | 'completed' | 'cancelled';
  statusNote?: string;
  timeline: BookingTimeline[];
  car?: any;
  createdAt?: string;
}

export interface BookingApiResponse {
  success: boolean;
  data?: Booking | Booking[];
  message?: string;
}

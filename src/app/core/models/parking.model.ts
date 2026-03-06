export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  price: number;
  currency: string;
  available: boolean;
  imageUrl?: string;
  rating?: number;
  distance?: string;
}

export interface Booking {
  id: string;
  spotId: string;
  userId: string;
  startTime: string;
  endTime: string;
  duration: string;
  totalPrice: number;
  status: 'active' | 'completed' | 'cancelled';
}

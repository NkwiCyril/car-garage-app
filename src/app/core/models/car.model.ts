export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: string;
  condition?: 'new' | 'like-new' | 'used';
  color?: string;
  imageUrl?: string;
  description?: string;
  sellerId?: string;
}

export interface RentalCar extends Car {
  pricePerDay: number;
  available: boolean;
}

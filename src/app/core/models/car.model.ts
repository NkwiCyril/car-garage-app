export interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  price: number;
  rentalPrice?: number;
  condition?: 'new' | 'like-new' | 'used';
  transmission?: 'automatic' | 'manual';
  mileage?: string;
  color?: string;
  forSale?: boolean;
  forRent?: boolean;
  inGarage?: boolean;
  status?: 'available' | 'parked' | 'rented' | 'sold';
  images?: string[];
  description?: string;
  ownerId?: string;
  location?: string;
  isAvailable?: boolean;
  createdAt?: string;
}

export interface RentalCar extends Car {
  rentalPrice: number;
  available: boolean;
}

export interface CreateCarRequest {
  make: string;
  model: string;
  year: number;
  vin: string;
  price: number;
  rentalPrice?: number;
  forSale?: boolean;
  forRent?: boolean;
  inGarage?: boolean;
  status?: 'available' | 'parked' | 'rented' | 'sold';
  description?: string;
}

export interface SellCarRequest {
  price: number;
}

export interface RentListRequest {
  rentalPrice: number;
}

export interface CarApiResponse {
  success: boolean;
  message?: string;
  data?: Car | Car[];
}

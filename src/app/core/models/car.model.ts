export interface CarOwner {
  _id: string;
  name: string;
  phone?: string;
}

export interface Car {
  _id: string;
  owner?: CarOwner;
  ownerId?: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  price: number;
  rentalPrice?: number;
  condition?: 'new' | 'like-new' | 'used';
  transmission?: 'automatic' | 'manual';
  mileage?: number | string;
  color?: string;
  bodyType?: string;
  forSale?: boolean;
  forRent?: boolean;
  inGarage?: boolean;
  status?: 'available' | 'parked' | 'rented' | 'sold';
  images?: string[];
  description?: string;
  location?: string;
  isAvailable?: boolean;
  isVerified?: boolean;
  verified?: 'verified' | 'unverified';
  fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  dealerName?: string;
  responseTime?: string;
  carteGrise?: string | null;
  customerDocument?: string | null;
  salesCertificate?: string | null;
  idCardFront?: string | null;
  idCardBack?: string | null;
  createdAt?: string;
  updatedAt?: string;
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

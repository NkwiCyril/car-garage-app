export interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  rentalPrice?: number;
  mileage?: string;
  listingType?: 'sale' | 'rent' | 'garage' | 'normal';
  forSale?: boolean;
  forRent?: boolean;
  condition?: 'new' | 'like-new' | 'used';
  color?: string;
  images?: string[];
  description?: string;
  ownerId?: string;
  location?: string;
  transmission?: 'automatic' | 'manual';
  isAvailable?: boolean;
  status?: string;
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
  price: number;
  description?: string;
  color?: string;
  mileage?: string;
  condition?: string;
  transmission?: string;
  listingType?: string;
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

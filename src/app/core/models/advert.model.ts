export interface Advert {
  _id: string;
  title: string;
  description?: string;
  car?: string;
  make?: string;
  model?: string;
  year?: number;
  price?: number;
  contactPhone?: string;
  priority?: number;
  priorityUntil?: string;
  startsAt?: string;
  expiresAt?: string;
  status: 'draft' | 'active' | 'paused' | 'expired';
  images: string[];
  viewCount?: number;
  clickCount?: number;
  createdAt?: string;
}

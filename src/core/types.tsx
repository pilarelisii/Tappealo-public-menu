export type Venue = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  enabled: boolean;
  created_at: string;
  
}

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  enabled: boolean;
  quantity: number;
  imageUrl: string | null;
  venueId: string;
  createdAt?: any;
  updatedAt?: any;
};

export type PublicPromotion = {
  id: string;
  venue_id: string | null;
  name: string | null;
  image_url: string | null;
  price: number;
  discount: number;
  start_date: any;
  end_date: any;
  enabled: boolean;
  items: { product_id: string; quantity: number }[];
};

const ORDER_STATUSES = ["entrante", "preparacion", "retirar", "falta-pagar", "terminadas"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
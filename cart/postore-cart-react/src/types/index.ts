export interface Product {
  id: number;
  name: string;
  categoryId: number;
  price: number;
  imageUrl: string;
  description: string;
  stockQuantity?: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface GlobalState {
  Email: string;
  Phone: string;
  Address: string;
  MapLocation: string;
  BusinessName: string;
  cart: CartItem[];
  wishlist: WishlistItem[];
  darkMode?: boolean;
}

export interface SupportTicket {
  from_name: string;
  from_email: string;
  order_number?: string;
  issue_type: string;
  subject: string;
  message: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
} 
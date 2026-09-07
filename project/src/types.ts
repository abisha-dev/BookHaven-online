// ═══════════════════════════════════════════════════════════
// BookHaven — Type Definitions
//═══════════════════════════════════════════════════════════

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  authors: string[];
  coverId?: number;
  coverUrl: string;
  description: string;
  category: string;
  publisher?: string;
  publishDate?: string;
  pageCount: number;
  isbn: string;
  price: number;
  rating: number;
  subject?: string[];
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface OrderItem {
  title: string;
  author: string;
  coverUrl: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  customer: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  createdAt: string;
}

export type CategoryKey =
  | 'story'
  | 'motivational'
  | 'educational';

export interface Category {
  key: CategoryKey;
  label: string;
  subject: string;
  description: string;
  icon: string;
}

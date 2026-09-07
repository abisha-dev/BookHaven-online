import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Types ──────────────────────────────────────────────────

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  stock: number;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  submitted_at: string;
}

export interface BookFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export type BookInput = Omit<Book, 'id' | 'created_at'>;

// ── Book API ───────────────────────────────────────────────

export async function fetchBooks(filters: BookFilters = {}): Promise<Book[]> {
  let query = supabase.from('books').select('*');

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,author.ilike.%${filters.search}%`
    );
  }
  if (filters.category && filters.category !== 'All') {
    query = query.eq('category', filters.category);
  }
  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters.minRating !== undefined) {
    query = query.gte('rating', filters.minRating);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as Book[];
}

export async function fetchBookById(id: string): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Book not found');
  return data as Book;
}

export async function createBook(book: BookInput): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .insert(book)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Book;
}

export async function updateBook(id: string, book: Partial<BookInput>): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .update(book)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Book;
}

export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase.from('books').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Contact API ────────────────────────────────────────────

export async function submitContact(
  name: string,
  email: string,
  message: string
): Promise<void> {
  const { error } = await supabase
    .from('contacts')
    .insert({ name, email, message });
  if (error) throw new Error(error.message);
}

export async function fetchContacts(): Promise<ContactSubmission[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('submitted_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as ContactSubmission[];
}

// ── Auth API ───────────────────────────────────────────────

export async function fetchCurrentProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Profile;
}

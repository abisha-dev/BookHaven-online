import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Book } from '../types';

interface WishlistContextValue {
  items: Book[];
  toggleWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = 'bookhaven_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Book[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const toggleWishlist = useCallback((book: Book) => {
    setItems((prev) => {
      const exists = prev.some((b) => b.id === book.id);
      if (exists) {
        return prev.filter((b) => b.id !== book.id);
      }
      return [...prev, book];
    });
  }, []);

  const removeFromWishlist = useCallback((bookId: string) => {
    setItems((prev) => prev.filter((b) => b.id !== bookId));
  }, []);

  const isInWishlist = useCallback(
    (bookId: string) => items.some((b) => b.id === bookId),
    [items]
  );

  return (
    <WishlistContext.Provider
      value={{ items, toggleWishlist, removeFromWishlist, isInWishlist, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import type { Category, Book } from '../types';
import { fetchBooksByCategory } from '../services/openLibraryApi';
import BookCard from './BookCard';
import { BookGridSkeleton } from './BookSkeleton';

interface Props {
  category: Category;
  limit?: number;
  preview?: boolean;
}

export default function CategorySection({ category, limit = 12, preview = false }: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchBooksByCategory(category);
      setBooks(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [category, limit]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section id={preview ? `preview-${category.key}` : undefined} className="py-12">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6 pb-4 border-b border-navy-600" data-aos="fade-up">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl text-white mb-1">{category.label}</h2>
            <p className="text-white/50 text-sm max-w-2xl">{category.description}</p>
          </div>
          {preview && (
            <Link
              to={`/category/${category.key}`}
              className="flex items-center gap-1.5 text-gold text-sm font-medium hover:gap-2.5 transition-all"
            >
              View All <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <BookGridSkeleton count={Math.min(limit, 10)} />
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
            <p className="text-white/60 mb-4">Failed to load {category.label.toLowerCase()}.</p>
            <button onClick={load} className="btn-outline-gold">
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        ) : books.length === 0 ? (
          <p className="text-center text-white/50 py-12">No books found in this category.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {books.map((book, i) => (
              <div key={book.id} data-aos="fade-up" data-aos-delay={Math.min(i * 50, 300)}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

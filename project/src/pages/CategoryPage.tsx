import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { getCategoryByKey, fetchBooksByCategory } from '../services/openLibraryApi';
import type { Book } from '../types';
import BookCard from '../components/BookCard';
import { BookGridSkeleton } from '../components/BookSkeleton';
import LocationMap from '../components/LocationMap';
import Feedback from '../components/Feedback';
import Footer from '../components/Footer';

export default function CategoryPage() {
  const { categoryKey } = useParams<{ categoryKey: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const category = categoryKey ? getCategoryByKey(categoryKey) : null;

  const load = useCallback(async () => {
    if (!category) return;
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
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  if (!category) {
    return (
      <div className="pt-20 text-center py-20 min-h-screen bg-navy-900">
        <p className="text-white/60">Category not found.</p>
        <Link to="/" className="btn-gold mt-4">Back Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-navy-900 border-b border-navy-600">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center gap-1.5 text-sm">
            <Link to="/" className="text-white/50 hover:text-gold transition-colors">Home</Link>
            <ChevronRight size={14} className="text-white/30" />
            <span className="text-gold">{category.label}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-navy-800 border-b border-navy-600">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <h1 className="font-heading text-3xl md:text-4xl text-white mb-2">{category.label}</h1>
          <p className="text-white/50 max-w-2xl">{category.description}</p>
        </div>
      </div>

      {/* Books */}
      <div className="bg-navy-900 py-10 min-h-[50vh]">
        <div className="container mx-auto px-4 lg-px-6">
          {loading ? (
            <BookGridSkeleton count={10} />
          ) : error ? (
            <div className="text-center py-16">
              <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
              <p className="text-white/60 mb-4">Failed to load books. Please try again.</p>
              <button onClick={load} className="btn-outline-gold">
                <RefreshCw size={16} /> Retry
              </button>
            </div>
          ) : books.length === 0 ? (
            <p className="text-center text-white/50 py-16">No books found in this category.</p>
          ) : (
            <>
              <p className="text-white/50 text-sm mb-6">
                Showing {books.length} books in {category.label}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <LocationMap />
      <Feedback />
      <Footer />
    </div>
  );
}

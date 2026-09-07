import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { searchBooks } from '../services/openLibraryApi';
import type { Book } from '../types';
import BookCard from '../components/BookCard';
import { BookGridSkeleton } from '../components/BookSkeleton';
import Footer from '../components/Footer';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (!query.trim()) {
      setBooks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const data = await searchBooks(query);
      setBooks(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    load();
    window.scrollTo(0, 0);
  }, [load]);

  return (
    <div className="pt-16 min-h-screen bg-navy-900">
      {/* Breadcrumb */}
      <div className="bg-navy-800 border-b border-navy-600">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center gap-1.5 text-sm">
            <Link to="/" className="text-white/50 hover:text-gold transition-colors">Home</Link>
            <ChevronRight size={14} className="text-white/30" />
            <span className="text-gold">Search</span>
          </div>
        </div>
      </div>

      <div className="bg-navy-800 border-b border-navy-600">
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <h1 className="font-heading text-2xl md:text-3xl text-white mb-2 flex items-center gap-2">
            <SearchIcon size={24} className="text-gold" /> Search Results
          </h1>
          <p className="text-white/50 text-sm">Results for "{query}"</p>
        </div>
      </div>

      <div className="bg-navy-900 py-10 min-h-[50vh]">
        <div className="container mx-auto px-4 lg:px-6">
          {loading ? (
            <BookGridSkeleton count={12} />
          ) : error ? (
            <div className="text-center py-16">
              <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
              <p className="text-white/60 mb-4">Search failed. Please try again.</p>
              <button onClick={load} className="btn-outline-gold">
                <RefreshCw size={16} /> Retry
              </button>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/50 text-lg mb-2">No books found for "{query}"</p>
              <p className="text-white/30 text-sm">Try a different search term.</p>
            </div>
          ) : (
            <>
              <p className="text-white/50 text-sm mb-6">Found {books.length} books</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

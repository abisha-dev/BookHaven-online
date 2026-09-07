import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Heart, ShoppingCart, ChevronRight, BookOpen, User, Building2,
  Calendar, FileText, Hash, DollarSign, AlertCircle, RefreshCw, ArrowLeft,
} from 'lucide-react';
import type { Book } from '../types';
import { fetchBookByWorkId, CATEGORIES } from '../services/openLibraryApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { BookDetailSkeleton } from '../components/BookSkeleton';
import Footer from '../components/Footer';

export default function BookDetail() {
  const { bookId } = useParams<{ bookId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryLabel = searchParams.get('category') || 'Story Books';

  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const load = useCallback(async () => {
    if (!bookId) return;
    setLoading(true);
    setError(false);
    try {
      const data = await fetchBookByWorkId(bookId, categoryLabel);
      if (!data) {
        setError(true);
        return;
      }
      setBook(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [bookId, categoryLabel]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [bookId]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-navy-900">
        <BookDetailSkeleton />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="pt-16 min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <p className="text-white/60 mb-4">Failed to load book details.</p>
          <button onClick={load} className="btn-outline-gold mr-2">
            <RefreshCw size={16} /> Retry
          </button>
          <Link to="/" className="btn-gold">Back Home</Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(book.id);
  const inCart = isInCart(book.id);

  const handleAddToCart = () => {
    addToCart(book, quantity);
    showToast(`"${book.title}" added to cart`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(book, quantity);
    navigate('/cart');
  };

  const handleWishlist = () => {
    toggleWishlist(book);
    showToast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', inWishlist ? 'info' : 'success');
  };

  // Determine category key for back link
  const categoryKey = (() => {
    const cat = CATEGORIES.find((c) => c.label === book.category);
    return cat?.key || 'story';
  })();

  return (
    <div className="pt-16 min-h-screen bg-navy-900">
      {/* Breadcrumb */}
      <div className="bg-navy-800 border-b border-navy-600">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center gap-1.5 text-sm flex-wrap">
            <Link to="/" className="text-white/50 hover:text-gold transition-colors">Home</Link>
            <ChevronRight size={14} className="text-white/30" />
            <Link to={`/category/${categoryKey}`} className="text-white/50 hover:text-gold transition-colors">{book.category}</Link>
            <ChevronRight size={14} className="text-white/30" />
            <span className="text-gold truncate">{book.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-white/50 hover:text-gold text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Cover */}
          <div className="md:col-span-1">
            <div className="relative rounded-xl overflow-hidden border border-navy-600 shadow-xl sticky top-24">
              <img
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://covers.openlibrary.org/b/id/10522250-L.jpg';
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="badge-category">{book.category}</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2">
            <h1 className="font-heading text-3xl md:text-4xl text-white mb-2">{book.title}</h1>
            {book.subtitle && (
              <p className="text-white/60 text-lg mb-3">{book.subtitle}</p>
            )}

            <p className="text-gold text-sm mb-4 flex items-center gap-1.5">
              <User size={15} /> by {book.author}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={18}
                    fill={book.rating >= n ? '#f5a623' : 'none'}
                    stroke={book.rating >= n ? '#f5a623' : '#3a3a6e'}
                  />
                ))}
              </div>
              <span className="text-white text-sm font-semibold">{book.rating.toFixed(1)}</span>
              <span className="text-white/40 text-xs">/ 5.0</span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen size={14} /> Description
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {book.description || 'No description available for this title. Explore the pages to discover what lies within.'}
              </p>
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {[
                { icon: <DollarSign size={14} />, label: 'Price', value: `$${book.price.toFixed(2)}`, highlight: true },
                { icon: <Building2 size={14} />, label: 'Publisher', value: book.publisher || 'N/A' },
                { icon: <Calendar size={14} />, label: 'Published', value: book.publishDate || 'N/A' },
                { icon: <FileText size={14} />, label: 'Pages', value: book.pageCount ? `${book.pageCount}` : 'N/A' },
                { icon: <Hash size={14} />, label: 'ISBN', value: book.isbn || 'N/A' },
                { icon: <Star size={14} />, label: 'Rating', value: `${book.rating.toFixed(1)} / 5.0` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-navy-800 border border-navy-600 rounded-lg p-3"
                >
                  <div className="flex items-center gap-1 text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    {item.icon} {item.label}
                  </div>
                  <div className={`font-heading text-sm ${item.highlight ? 'text-gold font-bold' : 'text-white'}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Subjects */}
            {book.subject && book.subject.length > 0 && (
              <div className="mb-8">
                <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {book.subject.slice(0, 6).map((s, i) => (
                    <span key={i} className="text-xs text-white/60 bg-navy-700 border border-navy-600 px-3 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart controls */}
            <div className="bg-navy-800 border border-navy-600 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading text-3xl text-gold font-bold">${book.price.toFixed(2)}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg bg-navy-700 border border-navy-600 text-white hover:border-gold transition-colors"
                  >
                    −
                  </button>
                  <span className="text-white font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 rounded-lg bg-navy-700 border border-navy-600 text-white hover:border-gold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleAddToCart} className="btn-gold flex-1">
                  <ShoppingCart size={18} />
                  {inCart ? 'Add More to Cart' : 'Add to Cart'}
                </button>
                <button onClick={handleBuyNow} className="btn-outline-gold flex-1">
                  Buy Now
                </button>
                <button
                  onClick={handleWishlist}
                  className={`w-12 h-11 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${
                    inWishlist
                      ? 'bg-gold text-navy-900 border-gold'
                      : 'border-navy-600 text-white/60 hover:text-gold hover:border-gold'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

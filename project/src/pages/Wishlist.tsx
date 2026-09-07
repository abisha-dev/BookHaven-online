import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Footer from '../components/Footer';

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (bookId: string) => {
    const book = items.find((b) => b.id === bookId);
    if (book) {
      addToCart(book);
      showToast(`"${book.title}" added to cart`, 'success');
    }
  };

  const handleRemove = (bookId: string, title: string) => {
    removeFromWishlist(bookId);
    showToast(`"${title}" removed from wishlist`, 'info');
  };

  if (items.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center">
            <Heart size={32} className="text-white/30" />
          </div>
          <h2 className="font-heading text-2xl text-white mb-2">Your wishlist is empty</h2>
          <p className="text-white/50 text-sm mb-6">Save books you love and find them here later.</p>
          <Link to="/" className="btn-gold">
            Discover Books <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-navy-900">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <Link to="/" className="flex items-center gap-1.5 text-white/50 hover:text-gold text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Continue Shopping
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl md:text-3xl text-white">My Wishlist</h1>
          <span className="text-white/50 text-sm">{items.length} book{items.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((book) => (
            <div key={book.id} className="bg-navy-800 border border-navy-600 rounded-xl p-4 flex gap-4">
              <Link to={`/book/${book.id}?category=${encodeURIComponent(book.category)}`} className="flex-shrink-0">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-16 h-24 object-cover rounded-lg border border-navy-600"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://covers.openlibrary.org/b/id/10522250-L.jpg'; }}
                />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col">
                <Link to={`/book/${book.id}?category=${encodeURIComponent(book.category)}`}>
                  <h3 className="font-heading text-sm text-white hover:text-gold transition-colors line-clamp-2">{book.title}</h3>
                </Link>
                <p className="text-white/50 text-xs mb-2">by {book.author}</p>
                <span className="font-heading text-lg text-gold font-bold mb-auto">${book.price.toFixed(2)}</span>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleAddToCart(book.id)} className="btn-gold-sm flex-1">
                    <ShoppingCart size={13} /> Add
                  </button>
                  <button
                    onClick={() => handleRemove(book.id, book.title)}
                    className="w-8 h-8 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center flex-shrink-0"
                    aria-label="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

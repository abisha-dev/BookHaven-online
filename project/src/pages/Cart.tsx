import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Footer from '../components/Footer';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal, tax, total, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRemove = (bookId: string, title: string) => {
    removeFromCart(bookId);
    showToast(`"${title}" removed from cart`, 'info');
  };

  const handleClear = () => {
    clearCart();
    showToast('Cart cleared', 'info');
  };

  if (items.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center">
            <ShoppingCart size={32} className="text-white/30" />
          </div>
          <h2 className="font-heading text-2xl text-white mb-2">Your cart is empty</h2>
          <p className="text-white/50 text-sm mb-6">Browse our collection and find your next great read.</p>
          <Link to="/" className="btn-gold">
            Browse Books <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-navy-900">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white/50 hover:text-gold text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Continue Shopping
        </button>

        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <h1 className="font-heading text-2xl md:text-3xl text-white">Shopping Cart</h1>
          <button onClick={handleClear} className="text-sm text-red-400/70 hover:text-red-400 transition-colors">
            Clear cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.book.id} className="bg-navy-800 border border-navy-600 rounded-xl p-4 flex gap-4">
                {/* Cover */}
                <Link to={`/book/${item.book.id}?category=${encodeURIComponent(item.book.category)}`} className="flex-shrink-0">
                  <img
                    src={item.book.coverUrl}
                    alt={item.book.title}
                    className="w-16 h-24 object-cover rounded-lg border border-navy-600"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://covers.openlibrary.org/b/id/10522250-L.jpg'; }}
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link to={`/book/${item.book.id}?category=${encodeURIComponent(item.book.category)}`}>
                    <h3 className="font-heading text-base text-white hover:text-gold transition-colors line-clamp-1">{item.book.title}</h3>
                  </Link>
                  <p className="text-white/50 text-xs mb-2">by {item.book.author}</p>
                  <span className="badge-category text-[10px]">{item.book.category}</span>

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-md bg-navy-700 border border-navy-600 text-white hover:border-gold transition-colors flex items-center justify-center"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-white text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-md bg-navy-700 border border-navy-600 text-white hover:border-gold transition-colors flex items-center justify-center"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Price + Remove */}
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-lg text-gold font-bold">${(item.book.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => handleRemove(item.book.id, item.book.title)}
                        className="w-8 h-8 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center"
                        aria-label="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-navy-800 border border-navy-600 rounded-xl p-5 sticky top-24">
              <h2 className="font-heading text-xl text-white mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-white/60">
                  <span>Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-navy-600 pt-3 flex justify-between text-white font-semibold text-base">
                  <span>Total</span>
                  <span className="text-gold">${total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn-gold w-full mb-2">
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <Link to="/" className="block text-center text-sm text-white/50 hover:text-gold transition-colors py-2">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

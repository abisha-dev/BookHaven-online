import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import type { Order } from '../types';
import Footer from '../components/Footer';

export default function OrderConfirmation() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('bookhaven_last_order');
    if (stored) {
      setOrder(JSON.parse(stored));
    }
    window.scrollTo(0, 0);
  }, []);

  if (!order) {
    return (
      <div className="pt-16 min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="font-heading text-2xl text-white mb-2">No recent order found</h2>
          <Link to="/" className="btn-gold mt-4">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-navy-900">
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success icon */}
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center animate-pulse-gold"
              style={{ background: 'rgba(76,175,125,0.12)', border: '2px solid rgba(76,175,125,0.3)' }}
            >
              <CheckCircle size={40} className="text-green-400" />
            </div>
            <h1 className="font-heading text-3xl text-white mb-2">Order Confirmed!</h1>
            <p className="text-white/60 text-sm">Thank you for your purchase. A confirmation email has been sent to {order.customer.email}.</p>
          </div>

          {/* Order info */}
          <div className="bg-navy-800 border border-navy-600 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-4 border-b border-navy-600">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider">Order ID</p>
                <p className="font-heading text-lg text-gold">{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-xs uppercase tracking-wider">Order Date</p>
                <p className="text-white text-sm">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Items */}
            <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Package size={14} /> Items
            </h3>
            <div className="space-y-3 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <img src={item.coverUrl} alt={item.title} className="w-10 h-14 object-cover rounded flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm line-clamp-1">{item.title}</p>
                    <p className="text-white/40 text-xs">by {item.author}</p>
                  </div>
                  <span className="text-white/60 text-xs">×{item.quantity}</span>
                  <span className="text-gold text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-navy-600 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-white/60"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-white/60"><span>Tax (8%)</span><span>${order.tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-white font-semibold text-base border-t border-navy-600 pt-2"><span>Total Paid</span><span className="text-gold">${order.total.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Shipping info */}
          <div className="bg-navy-800 border border-navy-600 rounded-xl p-6 mb-6">
            <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">Shipping Address</h3>
            <div className="text-white/70 text-sm space-y-0.5">
              <p>{order.customer.fullName}</p>
              <p>{order.customer.address}</p>
              <p>{order.customer.city}, {order.customer.zip}</p>
              <p>{order.customer.country}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-gold">
              <Home size={16} /> Back to Home
            </Link>
            <Link to="/category/story" className="btn-outline-gold">
              Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

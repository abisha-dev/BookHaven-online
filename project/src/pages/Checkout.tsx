import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import type { Order } from '../types';
import Footer from '../components/Footer';

export default function Checkout() {
  const { items, subtotal, tax, total, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', email: '', address: '', city: '', zip: '', country: 'United States',
    cardNumber: '', expiry: '', cvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="font-heading text-2xl text-white mb-2">Your cart is empty</h2>
          <p className="text-white/50 text-sm mb-6">Add some books before checking out.</p>
          <Link to="/" className="btn-gold">Browse Books</Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.zip.trim()) e.zip = 'Required';
    if (!form.cardNumber.trim()) e.cardNumber = 'Required';
    else if (form.cardNumber.replace(/\s/g, '').length < 12) e.cardNumber = 'Invalid card number';
    if (!form.expiry.trim()) e.expiry = 'Required';
    else if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = 'MM/YY format';
    if (!form.cvv.trim()) e.cvv = 'Required';
    else if (form.cvv.length < 3) e.cvv = '3 digits';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('Please fix the errors in the form.', 'error');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const order: Order = {
        id: 'BH-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase(),
        items: items.map((i) => ({
          title: i.book.title,
          author: i.book.author,
          coverUrl: i.book.coverUrl,
          price: i.book.price,
          quantity: i.quantity,
        })),
        subtotal, tax, total,
        customer: { ...form },
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('bookhaven_last_order', JSON.stringify(order));
      clearCart();
      setSubmitting(false);
      showToast('Order placed successfully!', 'success');
      navigate('/order-confirmation');
    }, 1500);
  };

  const set = (key: string, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
  };

  const formatCardNumber = (v: string) => v.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  return (
    <div className="pt-16 min-h-screen bg-navy-900">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <Link to="/cart" className="flex items-center gap-1.5 text-white/50 hover:text-gold text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <h1 className="font-heading text-2xl md:text-3xl text-white mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
              <h2 className="font-heading text-lg text-white mb-4 flex items-center gap-2">
                <Truck size={18} className="text-gold" /> Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-white/60 text-xs font-medium mb-1.5">Full Name</label>
                  <input className={`input-dark ${errors.fullName ? 'border-red-500' : ''}`} value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="John Doe" />
                  {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-white/60 text-xs font-medium mb-1.5">Email Address</label>
                  <input className={`input-dark ${errors.email ? 'border-red-500' : ''}`} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="john@example.com" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-white/60 text-xs font-medium mb-1.5">Shipping Address</label>
                  <input className={`input-dark ${errors.address ? 'border-red-500' : ''}`} value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="123 Main Street, Apt 4B" />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-1.5">City</label>
                  <input className={`input-dark ${errors.city ? 'border-red-500' : ''}`} value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="New York" />
                  {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-1.5">ZIP Code</label>
                  <input className={`input-dark ${errors.zip ? 'border-red-500' : ''}`} value={form.zip} onChange={(e) => set('zip', e.target.value)} placeholder="10001" />
                  {errors.zip && <p className="text-red-400 text-xs mt-1">{errors.zip}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-white/60 text-xs font-medium mb-1.5">Country</label>
                  <select className="input-dark" value={form.country} onChange={(e) => set('country', e.target.value)}>
                    {['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'India', 'Other'].map((c) => (
                      <option key={c} value={c} className="bg-navy-700">{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-navy-800 border border-navy-600 rounded-xl p-6">
              <h2 className="font-heading text-lg text-white mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-gold" /> Payment Details
              </h2>
              <p className="text-white/40 text-xs mb-4">This is a demo — no real payment will be processed.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-white/60 text-xs font-medium mb-1.5">Card Number</label>
                  <input
                    className={`input-dark ${errors.cardNumber ? 'border-red-500' : ''}`}
                    value={form.cardNumber}
                    onChange={(e) => set('cardNumber', formatCardNumber(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                  />
                  {errors.cardNumber && <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>}
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-1.5">Expiry (MM/YY)</label>
                  <input
                    className={`input-dark ${errors.expiry ? 'border-red-500' : ''}`}
                    value={form.expiry}
                    onChange={(e) => set('expiry', formatExpiry(e.target.value))}
                    placeholder="12/28"
                    inputMode="numeric"
                  />
                  {errors.expiry && <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-1.5">CVV</label>
                  <input
                    className={`input-dark ${errors.cvv ? 'border-red-500' : ''}`}
                    value={form.cvv}
                    onChange={(e) => set('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    inputMode="numeric"
                    type="password"
                  />
                  {errors.cvv && <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-navy-800 border border-navy-600 rounded-xl p-5 sticky top-24">
              <h2 className="font-heading text-lg text-white mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.book.id} className="flex gap-2 items-center">
                    <img src={item.book.coverUrl} alt={item.book.title} className="w-10 h-14 object-cover rounded flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-xs line-clamp-1">{item.book.title}</p>
                      <p className="text-white/40 text-xs">Qty: {item.quantity} × ${item.book.price.toFixed(2)}</p>
                    </div>
                    <span className="text-gold text-xs font-semibold flex-shrink-0">${(item.book.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t border-navy-600 pt-3">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-navy-600 pt-2 flex justify-between text-white font-semibold text-base">
                  <span>Total</span><span className="text-gold">${total.toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" disabled={submitting} className="btn-gold w-full mt-4">
                {submitting ? (
                  <><span className="spinner-border spinner-border-sm" /> Processing…</>
                ) : (
                  <><CheckCircle size={16} /> Place Order <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

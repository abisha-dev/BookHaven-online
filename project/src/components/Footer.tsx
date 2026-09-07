import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Twitter, Instagram, Facebook, Github, Mail, Send } from 'lucide-react';
import { CATEGORIES } from '../services/openLibraryApi';

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-navy-900 border-t border-navy-600 pt-16 pb-6">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={22} className="text-gold" />
              <span className="font-heading text-xl font-bold text-gold">BookHaven</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              A sanctuary for book lovers. Discover stories that inspire, challenge, and transform your world — one page at a time.
            </p>
            <div className="flex gap-2">
              {[
                { icon: <Twitter size={15} />, label: 'Twitter' },
                { icon: <Instagram size={15} />, label: 'Instagram' },
                { icon: <Facebook size={15} />, label: 'Facebook' },
                { icon: <Github size={15} />, label: 'GitHub' },
                { icon: <Mail size={15} />, label: 'Email' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center bg-navy-700 border border-navy-600 rounded-full text-white/50 hover:bg-gold hover:text-navy-900 hover:border-gold transition-all hover:-translate-y-0.5"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h6 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Categories</h6>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                to={`/category/${cat.key}`}
                className="block text-white/50 text-sm py-1 hover:text-gold transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Quick Links</h6>
            <Link to="/" className="block text-white/50 text-sm py-1 hover:text-gold transition-colors">Home</Link>
            <Link to="/cart" className="block text-white/50 text-sm py-1 hover:text-gold transition-colors">Shopping Cart</Link>
            <Link to="/wishlist" className="block text-white/50 text-sm py-1 hover:text-gold transition-colors">Wishlist</Link>
            <a href="/#location" className="block text-white/50 text-sm py-1 hover:text-gold transition-colors">Location</a>
            <a href="/#feedback" className="block text-white/50 text-sm py-1 hover:text-gold transition-colors">Feedback</a>
          </div>

          {/* Newsletter */}
          <div>
            <h6 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Newsletter</h6>
            <p className="text-white/50 text-sm mb-3">Get notified about new arrivals and exclusive deals.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="input-dark text-sm"
              />
              <button type="submit" className="btn-gold-sm flex-shrink-0" aria-label="Subscribe">
                <Send size={14} />
              </button>
            </form>
            {subscribed && (
              <p className="text-green-400 text-xs mt-2 animate-fade-in">Subscribed! Thank you.</p>
            )}
          </div>
        </div>

        <div className="border-t border-navy-600 pt-5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-white/40 text-xs">&copy; {year} BookHaven. All rights reserved.</span>
          <span className="text-white/30 text-xs">Made with passion for readers everywhere.</span>
        </div>
      </div>
    </footer>
  );
}

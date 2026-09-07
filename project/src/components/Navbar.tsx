import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, ShoppingCart, Heart, Search, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../services/openLibraryApi';
import { searchBooks } from '../services/openLibraryApi';
import type { Book } from '../types';

export default function Navbar() {
  const { cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!value.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    setSearchOpen(true);
    setSearchLoading(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const results = await searchBooks(value);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy-900/98 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-navy-900/90 backdrop-blur-sm'}`} style={{ borderBottom: '1px solid rgba(58,58,110,0.3)' }}>
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <BookOpen size={24} className="text-gold" />
            <span className="font-heading text-xl font-bold text-gold tracking-wide">BookHaven</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-sm text-white/80 hover:text-gold transition-colors rounded-md">Home</Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                to={`/category/${cat.key}`}
                className="px-3 py-2 text-sm text-white/80 hover:text-gold transition-colors rounded-md"
              >
                {cat.label}
              </Link>
            ))}
            <a href="/#location" className="px-3 py-2 text-sm text-white/80 hover:text-gold transition-colors rounded-md">Location</a>
            <a href="/#feedback" className="px-3 py-2 text-sm text-white/80 hover:text-gold transition-colors rounded-md">Feedback</a>
          </div>

          {/* Search bar (desktop) */}
          <div ref={searchRef} className="hidden md:block relative flex-1 max-w-xs">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery && setSearchOpen(true)}
                  placeholder="Search books…"
                  className="w-full bg-navy-700 border border-navy-600 text-white text-sm rounded-lg pl-9 pr-3 py-2 placeholder:text-white/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
                />
              </div>
            </form>
            {searchOpen && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-navy-800 border border-navy-600 rounded-xl shadow-xl overflow-hidden max-h-96 overflow-y-auto">
                {searchLoading ? (
                  <div className="p-4 text-sm text-white/50 text-center">Searching…</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-sm text-white/50 text-center">No results found</div>
                ) : (
                  searchResults.map((book) => (
                    <Link
                      key={book.id}
                      to={`/book/${book.id}`}
                      className="flex items-center gap-3 p-2.5 hover:bg-navy-700 transition-colors border-b border-navy-700 last:border-0"
                    >
                      <img src={book.coverUrl} alt={book.title} className="w-10 h-14 object-cover rounded flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white font-medium truncate">{book.title}</p>
                        <p className="text-xs text-white/50 truncate">{book.author}</p>
                      </div>
                      <span className="text-gold text-sm font-semibold flex-shrink-0">${book.price}</span>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 text-white/80 hover:text-gold transition-colors" aria-label="Wishlist">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold text-navy-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-white/80 hover:text-gold transition-colors" aria-label="Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold text-navy-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse-gold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="hidden md:block relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-700 border border-navy-600 text-white/80 hover:border-gold/50 transition-colors">
                  <User size={14} className="text-gold" />
                  <span className="text-sm max-w-[100px] truncate">{profile?.name || user.email?.split('@')[0]}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-navy-800 border border-navy-600 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:text-gold hover:bg-navy-700 transition-colors rounded-t-xl">
                      <LayoutDashboard size={14} /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:text-gold hover:bg-navy-700 transition-colors rounded-b-xl">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-sm text-white/80 hover:text-gold transition-colors px-3 py-1.5">Login</Link>
                <Link to="/register" className="btn-gold-sm">Register</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-white/80 hover:text-gold transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 animate-slide-down">
            <form onSubmit={handleSearchSubmit} className="mb-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search books…"
                  className="w-full bg-navy-700 border border-navy-600 text-white text-sm rounded-lg pl-9 pr-3 py-2.5 placeholder:text-white/30 focus:outline-none focus:border-gold"
                />
              </div>
            </form>
            <Link to="/" className="block px-3 py-2.5 text-sm text-white/80 hover:text-gold hover:bg-navy-700 rounded-lg transition-colors">Home</Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                to={`/category/${cat.key}`}
                className="block px-3 py-2.5 text-sm text-white/80 hover:text-gold hover:bg-navy-700 rounded-lg transition-colors"
              >
                {cat.label}
              </Link>
            ))}
            <a href="/#location" className="block px-3 py-2.5 text-sm text-white/80 hover:text-gold hover:bg-navy-700 rounded-lg transition-colors">Location</a>
            <a href="/#feedback" className="block px-3 py-2.5 text-sm text-white/80 hover:text-gold hover:bg-navy-700 rounded-lg transition-colors">Feedback</a>
            <div className="mt-3 pt-3 border-t border-navy-600">
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="block px-3 py-2.5 text-sm text-white/80 hover:text-gold hover:bg-navy-700 rounded-lg transition-colors">Admin Dashboard</Link>
                  )}
                  <button onClick={logout} className="w-full text-left px-3 py-2.5 text-sm text-white/80 hover:text-gold hover:bg-navy-700 rounded-lg transition-colors">Logout</button>
                </>
              ) : (
                <div className="flex gap-2 px-3">
                  <Link to="/login" className="flex-1 text-center text-sm text-gold border border-gold rounded-lg py-2">Login</Link>
                  <Link to="/register" className="flex-1 text-center text-sm bg-gold text-navy-900 rounded-lg py-2 font-semibold">Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

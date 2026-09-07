import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import type { Book } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const googleCoverCache = new Map<string, string>();

function buildPlaceholderCover(title: string, author: string) {
  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeAuthor = author.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="600" height="900" fill="url(#bg)"/>
      <rect x="95" y="70" width="410" height="760" rx="18" fill="rgba(245,166,35,0.16)" stroke="rgba(245,166,35,0.55)"/>
      <rect x="123" y="118" width="355" height="110" rx="10" fill="rgba(245,166,35,0.18)"/>
      <g transform="translate(300 360)">
        <rect x="-30" y="-76" width="60" height="60" rx="12" fill="#f5a623" opacity="0.95"/>
        <path d="M-10 -56 L0 -18 L10 -56 L24 -56 L24 18 L0 36 L-24 18 L-24 -56 Z" fill="#fff" opacity="0.9"/>
      </g>
      <text x="300" y="510" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700" fill="#f8fafc">${safeTitle}</text>
      <text x="300" y="565" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#cbd5e1">by ${safeAuthor}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

async function fetchGoogleBookCover(title: string, author: string): Promise<string | null> {
  const key = `${title.toLowerCase().trim()}|${author.toLowerCase().trim()}`;
  if (googleCoverCache.has(key)) return googleCoverCache.get(key) ?? null;

  try {
    const query = encodeURIComponent(`intitle:${title} inauthor:${author}`);
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);
    if (!response.ok) return null;

    const data = await response.json();
    const thumbnail = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
    if (!thumbnail) return null;

    googleCoverCache.set(key, thumbnail);
    return thumbnail;
  } catch {
    return null;
  }
}

interface Props {
  book: Book;
  showAddToCart?: boolean;
}

export default function BookCard({ book, showAddToCart = true }: Props) {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [coverSrc, setCoverSrc] = useState(book.coverUrl || buildPlaceholderCover(book.title, book.author));
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    let active = true;

    const resolveCover = async () => {
      if (!book.coverUrl) {
        try {
          const googleCover = await fetchGoogleBookCover(book.title, book.author);
          if (!active) return;

          if (googleCover) {
            setCoverSrc(googleCover);
            setIsFallback(false);
            return;
          }

          const fallbackCover = buildPlaceholderCover(book.title, book.author);
          setCoverSrc(fallbackCover);
          setIsFallback(true);
        } catch {
          if (!active) return;
          const fallbackCover = buildPlaceholderCover(book.title, book.author);
          setCoverSrc(fallbackCover);
          setIsFallback(true);
        }
        return;
      }

      if (!active) return;
      setCoverSrc(book.coverUrl);
      setIsFallback(false);
    };

    resolveCover();
    return () => {
      active = false;
    };
  }, [book.coverUrl, book.title, book.author]);

  const inWishlist = isInWishlist(book.id);
  const inCart = isInCart(book.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
    showToast(`"${book.title}" added to cart`, 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(book);
    showToast(
      inWishlist ? `Removed from wishlist` : `"${book.title}" added to wishlist`,
      inWishlist ? 'info' : 'success'
    );
  };

  return (
    <Link
      to={`/book/${book.id}?category=${encodeURIComponent(book.category)}`}
      className="book-card-hover group block bg-navy-800 border border-navy-600 rounded-xl overflow-hidden h-full"
    >
      {/* Cover */}
      <div className="relative overflow-hidden h-56 flex-shrink-0">
        <img
          src={coverSrc}
          alt={`Cover of ${book.title}`}
          className="book-cover-zoom w-full h-full object-cover"
          loading="lazy"
          onError={async (e) => {
            const img = e.target as HTMLImageElement;

            if (book.coverUrl && img.src !== book.coverUrl) {
              img.src = book.coverUrl;
              setIsFallback(false);
              return;
            }

            const googleCover = await fetchGoogleBookCover(book.title, book.author);
            if (googleCover && img.src !== googleCover) {
              img.src = googleCover;
              setIsFallback(false);
              return;
            }

            const fallback = buildPlaceholderCover(book.title, book.author);
            if (img.src !== fallback) {
              img.src = fallback;
              setIsFallback(true);
            }
          }}
          style={isFallback ? { background: '#0f172a' } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />

        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-sm ${
            inWishlist
              ? 'bg-gold text-navy-900'
              : 'bg-navy-900/60 text-white/70 hover:text-gold hover:bg-navy-900/80'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>

        {/* Category badge */}
        <span className="absolute top-3 left-3 badge-category backdrop-blur-sm">
          {book.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-heading text-base text-white leading-snug mb-1 line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {book.title}
        </h3>
        <p className="text-white/50 text-xs mb-2 line-clamp-1">by {book.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star size={13} fill="#f5a623" stroke="#f5a623" />
          <span className="text-gold text-xs font-semibold">{book.rating.toFixed(1)}</span>
        </div>

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-navy-700">
          <span className="font-heading text-lg text-gold font-bold">${book.price.toFixed(2)}</span>
          {showAddToCart && (
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                inCart
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-navy-900'
              }`}
            >
              <ShoppingCart size={13} />
              {inCart ? 'Added' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

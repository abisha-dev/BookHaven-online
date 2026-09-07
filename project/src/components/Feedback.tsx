import { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, Send, Quote, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { supabase } from '../services/api';

interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  created_at: string;
}

export default function Feedback() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [form, setForm] = useState({ name: '', rating: 0, message: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('id, name, rating, message, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews((data as Review[]) || []);
    } catch {
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim() || form.rating === 0) {
      showToast('Please fill in all fields and select a rating.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          name: form.name.trim(),
          rating: form.rating,
          message: form.message.trim(),
        })
        .select('id, name, rating, message, created_at')
        .single();

      if (error) throw error;

      setReviews((prev) => [data as Review, ...prev]);
      setForm({ name: '', rating: 0, message: '' });
      showToast('Thank you for your feedback!', 'success');
    } catch {
      showToast('Failed to submit feedback. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const renderStars = (
    rating: number,
    interactive: boolean,
    onHover?: (n: number) => void,
    onPick?: (n: number) => void,
  ) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={interactive ? 24 : 16}
          fill={rating >= n ? '#f5a623' : 'none'}
          stroke={rating >= n ? '#f5a623' : '#3a3a6e'}
          className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}
          onMouseEnter={interactive && onHover ? () => onHover(n) : undefined}
          onMouseLeave={interactive && onHover ? () => onHover(0) : undefined}
          onClick={interactive && onPick ? () => onPick(n) : undefined}
        />
      ))}
    </div>
  );

  return (
    <section id="feedback" className="py-16 bg-navy-900 border-t border-navy-600">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-10" data-aos="fade-up">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Your Voice Matters</p>
          <h2 className="font-heading text-3xl md:text-4xl text-white mb-3">Share Your Feedback</h2>
          <div className="w-16 h-0.5 bg-gold/60 mx-auto mb-3" />
          <p className="text-white/50 text-sm max-w-2xl mx-auto">
            Loved a book? Have a suggestion? We would love to hear from you. Share your experience and help us improve.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reviews list */}
          <div data-aos="fade-right">
            <h3 className="font-heading text-xl text-white mb-4 flex items-center gap-2">
              <MessageSquare size={20} className="text-gold" /> Recent Reviews
              <span className="text-white/40 text-sm font-body font-normal">({reviews.length})</span>
            </h3>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
              {loadingReviews ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-navy-800 border border-navy-600 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="skeleton w-10 h-10 rounded-full" />
                        <div className="flex-1 space-y-1">
                          <div className="skeleton h-4 w-32 rounded" />
                          <div className="skeleton h-3 w-20 rounded" />
                        </div>
                      </div>
                      <div className="skeleton h-3 w-full rounded mb-1" />
                      <div className="skeleton h-3 w-4/5 rounded" />
                    </div>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-navy-800 border border-navy-600 rounded-xl p-8 text-center">
                  <AlertCircle size={32} className="text-white/30 mx-auto mb-2" />
                  <p className="text-white/50 text-sm">No reviews yet. Be the first to share your feedback!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-navy-800 border border-navy-600 rounded-xl p-5"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center flex-shrink-0 text-gold font-heading font-bold text-sm">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-semibold">{review.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {renderStars(review.rating, false)}
                          <span className="text-white/30 text-xs">{formatDate(review.created_at)}</span>
                        </div>
                      </div>
                      <Quote size={18} className="text-navy-600 flex-shrink-0" />
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed mt-2">{review.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Feedback form */}
          <div data-aos="fade-left" data-aos-delay="150">
            <div className="bg-navy-800 border border-navy-600 rounded-xl p-6 lg:sticky lg:top-24">
              <h3 className="font-heading text-xl text-white mb-4">Write a Review</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-1.5">Your Name</label>
                  <input
                    type="text"
                    className="input-dark"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    maxLength={100}
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-1.5">Your Rating</label>
                  <div className="bg-navy-700 border border-navy-600 rounded-lg px-4 py-3">
                    {renderStars(hoverRating || form.rating, true, setHoverRating, (n) => setForm({ ...form, rating: n }))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-1.5">Your Review</label>
                  <textarea
                    rows={5}
                    className="input-dark resize-none"
                    placeholder="Share your thoughts, suggestions, or experience with BookHaven…"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    maxLength={1000}
                  />
                </div>

                <button type="submit" disabled={submitting} className="btn-gold w-full">
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm" /> Submitting…</>
                  ) : (
                    <><Send size={16} /> Submit Review</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

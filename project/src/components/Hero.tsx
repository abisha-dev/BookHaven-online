import { Link } from 'react-router-dom';

export default function Hero() {
  const scrollToCategories = () => {
    document.getElementById('featured-categories')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ paddingTop: '4rem' }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          transition: 'transform 8s ease',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(15,15,26,0.6) 0%, rgba(15,15,26,0.8) 60%, rgba(26,26,46,0.97) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto py-20">
        <p className="animate-fade-up delay-1 text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-4 flex items-center justify-center gap-3">
          <span className="w-10 h-px bg-gold/60" />
          Premium Book Collection
          <span className="w-10 h-px bg-gold/60" />
        </p>

        <h1 className="animate-fade-up delay-2 font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
          Where Stories<br />
          <span className="text-gold">Meet Souls.</span>
        </h1>

        <p className="animate-fade-up delay-3 text-white/80 text-base md:text-lg max-w-xl mx-auto mb-8 font-light leading-relaxed">
          Discover timeless books that inspire, comfort, and stay with you forever. Your next great adventure is just a page turn away.
        </p>

        <div className="animate-fade-up delay-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={scrollToCategories} className="btn-gold px-8 py-3 text-base">
            Browse Collection
          </button>
          <Link to="/category/story" className="btn-outline-light px-8 py-3 text-base">
            Explore Story Books
          </Link>
        </div>
      </div>
    </section>
  );
}

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import LocationMap from '../components/LocationMap';
import Feedback from '../components/Feedback';
import Footer from '../components/Footer';
import { CATEGORIES } from '../services/openLibraryApi';

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic', offset: 60 });
  }, []);

  // Story + Motivational featured prominently, Educational after
  const featured = CATEGORIES.filter((c) => c.key === 'story' || c.key === 'motivational');
  const others = CATEGORIES.filter((c) => c.key === 'educational');

  return (
    <>
      <Hero />

      <div id="featured-categories" className="bg-navy-800">
        {featured.map((cat) => (
          <CategorySection key={cat.key} category={cat} limit={10} preview />
        ))}
      </div>

      <div className="bg-navy-900">
        {others.map((cat) => (
          <CategorySection key={cat.key} category={cat} limit={10} preview />
        ))}
      </div>

      <LocationMap />
      <Feedback />
      <Footer />
    </>
  );
}

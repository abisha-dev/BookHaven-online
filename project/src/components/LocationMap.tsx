import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';

export default function LocationMap() {
  const infos = [
    { icon: <MapPin size={18} />, label: 'Address', value: 'Mount Zion College of Engineering and Technology, Kollam, Kerala, India' },
    { icon: <Phone size={18} />, label: 'Phone', value: '+91 474 273 0200' },
    { icon: <Mail size={18} />, label: 'Email', value: 'hello@bookhaven.store' },
    { icon: <Clock size={18} />, label: 'Hours', value: 'Mon–Sat: 9:00 AM – 9:00 PM · Sun: 10:00 AM – 6:00 PM' },
  ];

  return (
    <section id="location" className="py-16 bg-navy-800 border-t border-navy-600">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-10" data-aos="fade-up">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Find Us</p>
          <h2 className="font-heading text-3xl md:text-4xl text-white mb-3">Visit Our Bookstore</h2>
          <div className="w-16 h-0.5 bg-gold/60 mx-auto mb-3" />
          <p className="text-white/50 text-sm max-w-2xl mx-auto">
            Come explore our shelves in person. We are located at Mount Zion College of Engineering and Technology, with easy parking and cozy reading nooks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* Google Map embed */}
          <div className="lg:col-span-3" data-aos="fade-right">
            <div className="rounded-xl overflow-hidden border border-navy-600 shadow-xl h-full min-h-[400px] relative">
              <iframe
                title="BookHaven Store Location — Mount Zion College of Engineering and Technology"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.591159953192!2d78.76186567481093!3d10.294488089826457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b007b9be3b6b9c1%3A0x7dc82f4a20569695!2sMount%20Zion%20College%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1783756167536!5m2!1sen!2sin"
                className="w-full h-full min-h-[400px] border-0"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>

          {/* Contact info */}
          <div className="lg:col-span-2 flex flex-col gap-4" data-aos="fade-left" data-aos-delay="150">
            {infos.map((info) => (
              <div
                key={info.label}
                className="bg-navy-700 border border-navy-600 rounded-xl p-5 flex items-start gap-4 hover:border-gold/30 transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 text-gold">
                  {info.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">{info.label}</p>
                  <p className="text-white/80 text-sm leading-relaxed">{info.value}</p>
                </div>
              </div>
            ))}

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Mount+Zion+College+of+Engineering+and+Technology+Kollam+Kerala"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full mt-auto"
            >
              <Navigation size={16} /> Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

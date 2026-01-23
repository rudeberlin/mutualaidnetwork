import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  image: string;
  rating: number;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    name: "Ama Kwame",
    role: "Community Member",
    content: "The Mutual Aid Network has transformed how I help and get help. The platform is secure, transparent, and truly makes a difference in our community.",
    image: "/owner-profile-1.svg",
    rating: 5
  },
  {
    name: "Kwesi Mensah",
    role: "Active Member",
    content: "I've been able to provide help to 5+ members while earning returns. The verification system is thorough and the payments are always on time.",
    image: "/owner-profile-2.svg",
    rating: 5
  },
  {
    name: "Efua Boateng",
    role: "Verified Member",
    content: "Outstanding platform! Quick verification, flexible payment methods, and a genuine community of people who care about each other's success.",
    image: "/owner-profile-3.svg",
    rating: 5
  }
];

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials = defaultTestimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay, testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlay(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlay(false);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slate-900/50 to-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">What Members Say</h2>
          <p className="text-slate-400 text-lg">Join thousands of satisfied community members</p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Visible Cards - Horizontal Scroll */}
          <div className="overflow-hidden">
            <div className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / Math.max(1, testimonials.length))}%)`,
                width: `${testimonials.length * 100}%`
              }}
            >
              {testimonials.map((testimonial, idx) => (
                <div 
                  key={idx} 
                  className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-3"
                >
                  <div className="group h-full p-6 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-slate-300 mb-6 text-sm leading-relaxed italic">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full border border-emerald-500/30"
                      />
                      <div>
                        <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-emerald-400 text-xs">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/3 -translate-y-1/2 -ml-6 md:-ml-8 p-2 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/40 transition-all z-10"
            title="Previous"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/3 -translate-y-1/2 -mr-6 md:-mr-8 p-2 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/40 transition-all z-10"
            title="Next"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsAutoPlay(false);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-emerald-400 w-8'
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

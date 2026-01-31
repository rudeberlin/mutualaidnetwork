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
    image: "/owner-profile-1.jpg",
    rating: 5
  },
  {
    name: "Kwesi Mensah",
    role: "Active Member",
    content: "I've been able to provide help to 5+ members while earning returns. The verification system is thorough and the payments are always on time.",
    image: "/owner-profile-2.jpg",
    rating: 5
  },
  {
    name: "Efua Boateng",
    role: "Verified Member",
    content: "Outstanding platform! Quick verification, flexible payment methods, and a genuine community of people who care about each other's success.",
    image: "/owner-profile-3.jpg",
    rating: 5
  },
  {
    name: "Kofi Asante",
    role: "Premium Member",
    content: "I started with the Basic Help package and now I'm on Elite! The earnings are real and the community support is incredible. Best decision I made this year.",
    image: "/owner-profile-1.jpg",
    rating: 5
  },
  {
    name: "Abena Osei",
    role: "Verified Helper",
    content: "As a single mother, this platform has been a blessing. I've helped others while securing my family's future. The admin team is professional and responsive.",
    image: "/owner-profile-2.jpg",
    rating: 5
  },
  {
    name: "Yaw Adomako",
    role: "Elite Member",
    content: "I was skeptical at first, but after seeing my first maturity payout, I'm convinced. The system is transparent, secure, and genuinely helps people.",
    image: "/owner-profile-3.jpg",
    rating: 5
  },
  {
    name: "Akosua Darko",
    role: "Active Supporter",
    content: "The verification process gave me confidence. I've successfully completed 8 packages and helped 12 members. This is mutual aid done right!",
    image: "/owner-profile-1.jpg",
    rating: 5
  },
  {
    name: "Kwame Ofori",
    role: "Standard Member",
    content: "Fast matching, secure payments, and genuine returns. I've recommended this platform to all my friends and family. Worth every cedi!",
    image: "/owner-profile-2.jpg",
    rating: 5
  },
  {
    name: "Adwoa Agyeman",
    role: "Community Leader",
    content: "This platform embodies true community spirit. I've seen members grow from Basic to Elite packages. The transparency and trust here are unmatched.",
    image: "/owner-profile-3.jpg",
    rating: 5
  },
  {
    name: "Samuel Appiah",
    role: "Verified Giver",
    content: "I love being able to help others while earning returns. The 6-hour matching system is efficient and the admin verification process ensures safety.",
    image: "/owner-profile-1.jpg",
    rating: 5
  },
  {
    name: "Maame Serwaa",
    role: "Premium Helper",
    content: "Joined 3 months ago with Basic Help, now I'm on my second Premium package! The maturity payouts are always on time. Highly recommend!",
    image: "/owner-profile-2.jpg",
    rating: 5
  },
  {
    name: "Nana Owusu",
    role: "Elite Supporter",
    content: "The Elite package has been life-changing. Professional platform, excellent support, and the community is genuinely supportive. Five stars!",
    image: "/owner-profile-3.jpg",
    rating: 5
  },
  {
    name: "Adjoa Boateng",
    role: "Active Member",
    content: "I was looking for a trustworthy platform and found it here. Clear terms, fast processing, and real results. My family is grateful!",
    image: "/owner-profile-1.jpg",
    rating: 5
  },
  {
    name: "Kojo Mensah",
    role: "Verified Member",
    content: "The payment matching system is genius! I've never waited more than a few hours to be matched. This is how community support should work.",
    image: "/owner-profile-2.jpg",
    rating: 5
  },
  {
    name: "Esi Annan",
    role: "Standard Helper",
    content: "Started small with ₵250 and now I'm confidently helping others with bigger packages. The platform grows with you. Absolutely love it!",
    image: "/owner-profile-3.jpg",
    rating: 5
  },
  {
    name: "Fiifi Cobbinah",
    role: "Premium Member",
    content: "Security, transparency, and real returns - this platform delivers on all fronts. The admin panel is professional and the support is top-notch.",
    image: "/owner-profile-1.jpg",
    rating: 5
  },
  {
    name: "Akua Danso",
    role: "Community Member",
    content: "I've completed 5 packages successfully. Each time the process was smooth and payouts were accurate. This is the real deal!",
    image: "/owner-profile-2.jpg",
    rating: 5
  },
  {
    name: "Yaa Nkrumah",
    role: "Elite Member",
    content: "From Basic to Elite in 4 months! The platform is legit, the community is supportive, and the earnings are consistent. Can't ask for more!",
    image: "/owner-profile-3.jpg",
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
                transform: `translateX(-${currentIndex * 33.33}%)`
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

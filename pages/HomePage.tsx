
import React, { useState, useEffect } from 'react';
import HeroSection from '../components/sections/HeroSection';
import PortfolioGrid from '../components/sections/PortfolioGrid';
import ServicesPreview from '../components/sections/ServicesPreview';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../constants';
import { Quote, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Testimonial } from '../types';
import { useLoading } from '../context/LoadingContext';
import SEO from '../components/layout/SEO';

interface StatItem {
  label: string;
  value: string;
}

const HomePage: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Views Generated', value: '250M+' },
    { label: 'Subscribers Added', value: '5M+' },
    { label: 'Awards Won', value: '12' },
    { label: 'Projects Done', value: '1,200+' },
  ]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [isTestimonialsLoading, setIsTestimonialsLoading] = useState(true);
  const { registerItem, markLoaded } = useLoading();

  useEffect(() => {
    registerItem('stats-data');
    registerItem('testimonials-data');
    // Fetch statistics from Firestore path: sites/mostbooked/statistics/data
    const fetchStats = async () => {
      try {
        const docRef = doc(db, 'sites', 'mostbooked', 'statistics', 'data');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          const mapping = [
            { id: 'views_generated', label: 'Views Generated' },
            { id: 'subscribers_added', label: 'Subscribers Added' },
            { id: 'awards_won', label: 'Awards Won' },
            { id: 'projects_done', label: 'Projects Done' },
          ];

          const statsArray = mapping.map(item => {
            const rawValue = data[item.id];
            
            let displayValue = '0';
            let displayLabel = item.label;

            if (typeof rawValue === 'object' && rawValue !== null) {
              displayValue = rawValue.value || '0';
              displayLabel = rawValue.label || item.label;
            } else if (rawValue !== undefined) {
              displayValue = String(rawValue);
            }

            return {
              label: displayLabel,
              value: displayValue
            };
          });

          if (statsArray.length > 0) {
            setStats(statsArray);
          }
        }
        markLoaded('stats-data');
      } catch (err) {
        console.error("Error loading stats from Firestore:", err);
        markLoaded('stats-data');
      }
    };

    const fetchTestimonials = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'sites', 'mostbooked', 'reputation'));
        const fetchedTestimonials: Testimonial[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Anonymous',
            role: data.role || 'Client',
            content: data.content || '',
            avatar: data.avatar || `https://i.pravatar.cc/150?u=${doc.id}`
          };
        });
        
        if (fetchedTestimonials.length > 0) {
          setTestimonials(fetchedTestimonials);
        }
      } catch (err) {
        console.error("Error fetching testimonials from Firestore:", err);
      } finally {
        setIsTestimonialsLoading(false);
        markLoaded('testimonials-data');
      }
    };

    fetchStats();
    fetchTestimonials();
  }, []);

  return (
    <main>
      <SEO 
        title="Home | MOSTBOOKED" 
        description="Premium video production and YouTube growth strategy in Lagos. We help you become the most booked creator in your niche."
      />
      <HeroSection />
      
      {/* Stats Counter Section */}
      <section className="py-20 bg-primary border-y border-ui/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-4xl md:text-5xl font-hero text-accent mb-2">{stat.value}</h3>
              <p className="text-ui/40 text-xs uppercase tracking-[0.2em] font-subheading">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <PortfolioGrid collectionPath="sites/mostbooked/global_content/data/videos" />

      <ServicesPreview />

      {/* Testimonials */}
      <section className="py-24 bg-primary overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <h2 className="text-ui font-hero text-5xl text-center uppercase tracking-tight">Client Voice</h2>
          <div className="w-20 h-1 bg-accent mx-auto mt-4" />
        </div>

        {isTestimonialsLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <Loader2 className="animate-spin text-accent mb-4" size={40} strokeWidth={1} />
             <p className="text-ui/20 font-heading text-xs uppercase tracking-widest">Collecting feedback...</p>
          </div>
        ) : (
          <div className="flex space-x-8 animate-scroll whitespace-nowrap overflow-x-auto no-scrollbar mask-gradient py-12 px-6">
            {(testimonials.length > 0 ? [...testimonials, ...testimonials] : []).map((t, idx) => (
              <div key={`${t.id}-${idx}`} className="inline-block min-w-[350px] md:min-w-[450px] bg-secondary p-10 rounded-3xl border border-ui/5">
                <Quote className="text-accent mb-6 opacity-40" size={40} />
                <p className="text-ui/80 font-accent italic text-xl mb-8 leading-relaxed whitespace-normal">
                  "{t.content}"
                </p>
                <div className="flex items-center space-x-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border border-accent/30 object-cover" />
                  <div>
                    <h4 className="text-ui font-heading text-lg uppercase">{t.name}</h4>
                    <p className="text-ui/40 text-[10px] uppercase tracking-widest font-bold">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Final */}
      <section className="py-32 bg-accent relative overflow-hidden group">
        <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           whileInView={{ scale: 1, opacity: 1 }}
           className="max-w-4xl mx-auto px-6 text-center relative z-10"
        >
          <h2 className="text-white font-hero text-6xl md:text-8xl mb-8 leading-none">READY TO BE THE <span className="text-primary">MOSTBOOKED</span>?</h2>
          <button className="px-12 py-5 bg-primary text-white font-hero text-2xl tracking-[0.2em] hover:bg-white hover:text-primary transition-all duration-500 shadow-2xl">
            START YOUR JOURNEY
          </button>
        </motion.div>
        {/* Floating Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      </section>
    </main>
  );
};

export default HomePage;

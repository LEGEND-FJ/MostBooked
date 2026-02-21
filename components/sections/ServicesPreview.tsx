import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Youtube, Mic, ChevronDown, Check, Briefcase, Video, Settings, Star, Loader2 } from 'lucide-react';
import PrimaryButton from '../ui/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Service } from '../../types';
import { useLoading } from '../../context/LoadingContext';

const IconMap: Record<string, React.ReactNode> = {
  camera: <Camera className="text-accent" size={32} />,
  youtube: <Youtube className="text-accent" size={32} />,
  mic: <Mic className="text-accent" size={32} />,
  briefcase: <Briefcase className="text-accent" size={32} />,
  video: <Video className="text-accent" size={32} />,
  settings: <Settings className="text-accent" size={32} />,
  star: <Star className="text-accent" size={32} />,
};

const ServicesPreview: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { registerItem, markLoaded } = useLoading();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        registerItem('services-data');
        const querySnapshot = await getDocs(collection(db, 'sites', 'mostbooked', 'services'));
        const fetchedServices: Service[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          

          const featuresMap = data.features || {};
          
          return {
            id: doc.id,
            title: featuresMap.title || data.title || 'Untitled Service',
            icon: featuresMap.icon || data.icon || 'camera',
            description: data.description || '',
            price: featuresMap.price || data.price || 'Contact for Quote',

            features: Array.isArray(data.featuresList) ? data.featuresList : (data.featuresList ? [data.featuresList] : [])
          };
        });
        setServices(fetchedServices);
      } catch (err) {
        console.error("Error fetching services from Firestore:", err);
      } finally {
        setIsLoading(false);
        markLoaded('services-data');
      }
    };

    fetchServices();
  }, []);

  const formatPrice = (price: string) => {
    if (!isNaN(Number(price))) {
      return `Starting from ₦${price}`;
    }
    return price;
  };

  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-ui font-hero text-5xl md:text-6xl mb-4 uppercase">Core Expertise</h2>
            <div className="w-20 h-1 bg-accent mx-auto mb-6" />
            <p className="text-ui/60 font-body max-w-xl mx-auto">
              From single camera setups to multi-city documentary productions, we scale to your needs.
            </p>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-accent mb-4" size={40} strokeWidth={1} />
            <p className="text-ui/30 font-heading text-xs uppercase tracking-widest">Loading solutions...</p>
          </div>
        ) : services.length > 0 ? (
          <div className="space-y-6">
            {services.map((service) => (
              <div 
                key={service.id}
                className={`border border-ui/10 transition-all duration-500 rounded-2xl overflow-hidden ${expandedId === service.id ? 'bg-primary border-accent/30 shadow-2xl shadow-accent/5' : 'bg-primary/50 hover:bg-primary'}`}
              >
                <button
                  onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
                  className="w-full flex items-center justify-between p-8 md:p-12 text-left group"
                >
                  <div className="flex items-center space-x-8">
                    <div className="p-4 bg-secondary rounded-xl group-hover:bg-accent/10 transition-colors">
                      {IconMap[service.icon.toLowerCase()] || IconMap['camera']}
                    </div>
                    <div>
                      <h3 className="text-ui font-heading text-2xl md:text-3xl mb-1 uppercase tracking-tight">{service.title}</h3>
                      <p className="text-ui/40 text-[10px] font-subheading uppercase tracking-[0.2em] font-bold">{formatPrice(service.price)}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedId === service.id ? 180 : 0 }}
                    className="text-ui/30 group-hover:text-accent transition-colors"
                  >
                    <ChevronDown size={32} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedId === service.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="px-8 md:px-12 pb-12 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-ui/5 pt-8 mt-4 mx-8">
                        <div>
                          <p className="text-ui/70 text-lg font-body leading-relaxed mb-8">
                            {service.description}
                          </p>
                          {service.features.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {service.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center space-x-3 text-ui/60">
                                  <Check size={18} className="text-accent" />
                                  <span className="text-sm font-body">{feature}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center items-start md:items-end">
                          <div className="p-10 bg-secondary rounded-3xl w-full md:w-auto text-center md:text-right border border-ui/5 shadow-inner">
                            <p className="text-[10px] uppercase tracking-widest text-ui/40 mb-3 font-black">Service Package</p>
                            <p className="text-4xl font-heading text-ui mb-8">{formatPrice(service.price)}</p>
                            <PrimaryButton onClick={() => navigate('/booking')} className="w-full">
                              Book This Service
                            </PrimaryButton>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-primary/20 rounded-3xl border border-dashed border-ui/10">
            <p className="text-ui/20 font-heading text-xl uppercase tracking-widest">No services found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesPreview;

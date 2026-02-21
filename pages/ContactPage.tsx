
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';
import PrimaryButton from '../components/ui/PrimaryButton';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const ContactPage: React.FC = () => {
  const [commData, setCommData] = useState({
    contactAddress: 'Lekki Phase 1, Lagos',
    contactEmail: 'hello@mostbooked.ng',
    contactPhone: '+234 810 000 0000',
    instagramUrl: '#',
    youtubeUrl: '#',
    twitterUrl: '#',
    linkedinUrl: '#',
  });

  useEffect(() => {
    const fetchCommData = async () => {
      try {
        const docRef = doc(db, 'sites', 'mostbooked', 'communication', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCommData({
            contactAddress: data.contactAddress || 'Lekki Phase 1, Lagos',
            contactEmail: data.contactEmail || 'hello@mostbooked.ng',
            contactPhone: data.contactPhone || '+234 810 000 0000',
            instagramUrl: data.instagramUrl || '#',
            youtubeUrl: data.youtubeUrl || '#',
            twitterUrl: data.twitterUrl || '#',
            linkedinUrl: data.linkedinUrl || '#',
          });
        }
      } catch (err) {
        console.error("Error loading communication data in contact page:", err);
      }
    };
    fetchCommData();
  }, []);

  return (
    <main className="pt-32 min-h-screen bg-primary">
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-accent font-heading tracking-[0.3em] text-sm uppercase mb-4 block">Connect</span>
              <h1 className="text-ui font-hero text-6xl md:text-8xl leading-none mb-8">
                LET'S MAKE <br/> <span className="text-accent">HISTORY</span>
              </h1>
              <p className="text-ui/60 font-body text-lg mb-12 max-w-md">
                Whether you have a fully-formed brief or just the spark of an idea, our team is ready to help you bring it to life.
              </p>

              <div className="space-y-8">
                <div className="flex items-center space-x-6">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-accent">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-ui/40 text-[10px] uppercase tracking-widest">Email Us</p>
                    <p className="text-ui font-heading text-xl">{commData.contactEmail}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-accent">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-ui/40 text-[10px] uppercase tracking-widest">Call Us</p>
                    <p className="text-ui font-heading text-xl">{commData.contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-accent">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-ui/40 text-[10px] uppercase tracking-widest">Visit Studio</p>
                    <p className="text-ui font-heading text-xl">{commData.contactAddress}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-12">
                <a href={commData.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-secondary rounded-lg text-ui/60 hover:text-accent transition-colors"><Instagram size={24} /></a>
                <a href={commData.youtubeUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-secondary rounded-lg text-ui/60 hover:text-accent transition-colors"><Youtube size={24} /></a>
                <a href={commData.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-secondary rounded-lg text-ui/60 hover:text-accent transition-colors"><Twitter size={24} /></a>
                <a href={commData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-secondary rounded-lg text-ui/60 hover:text-accent transition-colors"><Linkedin size={24} /></a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-secondary p-10 md:p-16 rounded-3xl border border-ui/5 shadow-2xl shadow-accent/5"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-ui/40 font-bold ml-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-primary border border-ui/10 p-5 rounded-xl text-ui focus:border-accent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-ui/40 font-bold ml-2">Work Email</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-primary border border-ui/10 p-5 rounded-xl text-ui focus:border-accent outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-ui/40 font-bold ml-2">Subject</label>
                <select className="w-full bg-primary border border-ui/10 p-5 rounded-xl text-ui focus:border-accent outline-none transition-all appearance-none">
                  <option>Video Production</option>
                  <option>YouTube Strategy</option>
                  <option>Podcast Booking</option>
                  <option>Academy Inquiry</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-ui/40 font-bold ml-2">Your Message</label>
                <textarea 
                  placeholder="Tell us about your project goals..."
                  rows={5}
                  className="w-full bg-primary border border-ui/10 p-5 rounded-xl text-ui focus:border-accent outline-none transition-all resize-none"
                />
              </div>
              <PrimaryButton className="w-full flex items-center justify-center space-x-3 !py-5">
                <span>Send Message</span>
                <Send size={18} />
              </PrimaryButton>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[400px] w-full bg-secondary overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-1000">
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-primary/80 backdrop-blur-md px-8 py-4 rounded-full border border-accent/30 text-ui font-heading tracking-widest text-sm uppercase">
            MOSTBOOKED STUDIOS HQ
          </div>
        </div>
        <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-30" alt="Map View" />
      </section>
    </main>
  );
};

export default ContactPage;

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import PrimaryButton from '../ui/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useLoading } from '../../context/LoadingContext';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [videoVisible, setVideoVisible] = useState(false);
  const fullText = "PREMIUM VIDEO PRODUCTION";
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { registerItem, markLoaded } = useLoading();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    registerItem('hero-video');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 100);

    const fetchData = async () => {
      try {
        const docRef = doc(db, 'sites', 'mostbooked', 'global_content', 'data');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.heroBgVideoUrl) setVideoUrl(data.heroBgVideoUrl);
          if (data.heroTitle) setHeroTitle(data.heroTitle);
          if (data.heroDescription) setHeroDescription(data.heroDescription);
        } else {
          setHeroTitle('STAR BOOKEDS');
          setVideoUrl("https://assets.mixkit.co/videos/preview/mixkit-urban-fashion-man-in-the-city-at-night-40291-large.mp4");
        }
      } catch (err) {
        console.error("Error loading Firestore data in hero:", err);
        setHeroTitle('STAR BOOKEDS');
        setVideoUrl("https://assets.mixkit.co/videos/preview/mixkit-urban-fashion-man-in-the-city-at-night-40291-large.mp4");
      }
    };

    fetchData();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (videoUrl && videoRef.current) {
      const video = videoRef.current;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      
      const playVideo = async () => {
        try {
          await video.play();
          setVideoVisible(true);
        } catch (error) {
          console.warn("Autoplay blocked or failed:", error);
        }
      };

      playVideo();
    }
  }, [videoUrl]);

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-primary"
    >
      <motion.div 
        style={{ scale: videoScale }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-primary"
      >
        <AnimatePresence>
          {videoUrl && (
            <motion.video
              ref={videoRef}
              key={videoUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: videoVisible ? 1 : 0 }}
              transition={{ duration: 1.5 }}
              src={videoUrl}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              onCanPlayThrough={() => {
                setVideoVisible(true);
                markLoaded('hero-video');
                if (videoRef.current) videoRef.current.play();
              }}
              className="w-full h-full object-cover grayscale contrast-125 brightness-50"
            />
          )}
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-cinema-gradient opacity-90" />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      <motion.div 
        style={{ y: textY, opacity: contentOpacity }}
        className="relative z-10 text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/services')}
              className="px-6 py-3 bg-primary/60 backdrop-blur-md border border-ui/10 rounded-xl text-ui font-hero text-xl tracking-[0.2em] hover:bg-secondary transition-all duration-300 group shadow-xl"
            >
              WHAT WE <span className="text-accent">DO</span>
            </motion.button>

            <motion.div
              className="relative group flex flex-col items-center"
            >
              <h2 className="text-accent font-heading font-bold tracking-[0.3em] text-sm md:text-lg mb-2">
                {displayText}<span className="animate-pulse">|</span>
              </h2>
              <div className="w-full h-[2px] bg-accent scale-x-100" />
            </motion.div>
          </div>
          
          <div className="relative inline-block mb-12">
            <h1 className="text-ui font-hero text-7xl md:text-[140px] lg:text-[180px] leading-none text-shadow-hero tracking-tighter uppercase font-bold transition-all duration-500">
              {heroTitle || 'STAR BOOKEDS'}<span className="text-accent">.</span>
            </h1>
          </div>
          
          <div className="max-w-5xl mx-auto mb-16">
            <p className="font-heading text-ui/60 text-lg md:text-xl lg:text-2xl uppercase tracking-[0.3em] font-medium leading-relaxed">
              {heroDescription}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
            <PrimaryButton onClick={() => navigate('/portfolio')}>
              View Portfolio
            </PrimaryButton>
            <button 
              onClick={() => navigate('/booking')}
              className="px-8 py-3 border border-ui/30 text-ui hover:border-accent hover:text-accent font-subheading font-bold uppercase tracking-widest text-sm transition-all duration-300"
            >
              Start Your Project
            </button>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        style={{ opacity: scrollIndicatorOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-[10px] uppercase tracking-widest text-ui/50 mb-2">Scroll to explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;

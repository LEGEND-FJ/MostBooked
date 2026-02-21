import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useLoading } from '../../context/LoadingContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [brandName, setBrandName] = useState('STAR BOOKEDS');
  const location = useLocation();

  const { registerItem, markLoaded } = useLoading();

  useEffect(() => {
    registerItem('brand-data');
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "public", currentUser.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().fullName);
        } else {
          setUserName(currentUser.displayName || 'Creator');
        }
      } else {
        setUserName(null);
      }
    });

    const fetchBrand = async () => {
      try {
        const docRef = doc(db, 'sites', 'mostbooked', 'global_content', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.heroTitle) setBrandName(data.heroTitle);
        }
        markLoaded('brand-data');
      } catch (err) {
        console.error("Error loading Firestore brand name in header:", err);
        markLoaded('brand-data');
      }
    };
    fetchBrand();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Services', path: '/services' },
    { name: 'Courses', path: '/courses' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-primary/95 backdrop-blur-lg py-4 border-b border-ui/5' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="group">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <span className="text-3xl font-hero tracking-tighter text-ui group-hover:text-accent transition-colors duration-300">
              {brandName}
            </span>
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          </motion.div>
        </Link>

        <nav className="hidden lg:flex items-center space-x-10">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="relative group">
              <span className={`font-subheading text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${location.pathname === item.path ? 'text-accent' : 'text-ui/80 hover:text-ui'}`}>
                {item.name}
              </span>
              <span className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          ))}
          
          <div className="flex items-center space-x-6">
            <Link to={user ? "/profile" : "/auth"} className="flex items-center space-x-2 text-ui/60 hover:text-accent transition-colors duration-300 group">
              <User size={16} className="group-hover:scale-110 transition-transform" />
              <span className="font-subheading text-[11px] uppercase tracking-widest truncate max-w-[120px]">
                {user ? userName || 'Profile' : 'Login'}
              </span>
            </Link>
            
            <Link to="/booking">
              <button className="px-6 py-2 border border-accent text-accent hover:bg-accent hover:text-white font-subheading text-[11px] uppercase tracking-widest transition-all duration-300">
                Book Now
              </button>
            </Link>
          </div>
        </nav>

        <div className="lg:hidden flex items-center space-x-4">
          <Link to={user ? "/profile" : "/auth"} className="text-ui/60 p-2">
            <User size={24} />
          </Link>
          <button className="text-ui p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 bg-primary z-40 flex flex-col items-center justify-center space-y-8"
          >
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => setIsOpen(false)}
                className="text-5xl font-hero text-ui hover:text-accent transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link 
              to={user ? "/profile" : "/auth"}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-subheading text-ui/40 uppercase tracking-widest hover:text-accent transition-colors"
            >
              {user ? userName || 'Account' : 'Login'}
            </Link>
            <Link 
              to="/booking" 
              onClick={() => setIsOpen(false)}
              className="mt-8 px-12 py-4 bg-accent text-white font-hero text-2xl tracking-widest"
            >
              BOOK NOW
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

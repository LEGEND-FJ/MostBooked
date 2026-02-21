import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import CoursesPage from './pages/CoursesPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import LoadingScreen from './components/ui/LoadingScreen';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './components/layout/SEO';
import VideoPreloader from './components/ui/VideoPreloader';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const { isLoading } = useLoading();

  return (
    <div className="min-h-screen bg-primary selection:bg-accent selection:text-white">
      <SEO />
      <VideoPreloader />
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>
      
      {!isAuthPage && <Header />}
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        </Routes>
      </AnimatePresence>
      {!isAuthPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <LoadingProvider>
        <Router>
          <AppContent />
        </Router>
      </LoadingProvider>
    </HelmetProvider>
  );
};

export default App;

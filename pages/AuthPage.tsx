
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Phone, Eye, EyeOff, MailCheck, AlertCircle } from 'lucide-react';
import PrimaryButton from '../components/ui/PrimaryButton';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        navigate('/');
      } else {
        // Validation
        if (formData.email !== formData.confirmEmail) {
          throw new Error("Emails do not match.");
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Save user data to Firestore 'public' collection
        await setDoc(doc(db, "public", user.uid), {
          uid: user.uid,
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          createdAt: serverTimestamp(),
          role: 'user'
        });

        navigate('/');
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // If it's a new user, you might want to create a document for them too
      // But for simplicity in a popup flow, we'll check if they exist or just overwrite/update
      await setDoc(doc(db, "public", user.uid), {
        uid: user.uid,
        fullName: user.displayName || 'Google User',
        email: user.email,
        lastLogin: serverTimestamp(),
        role: 'user'
      }, { merge: true });

      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLogin = (val: boolean) => {
    setIsLogin(val);
    setError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background Cinematic Video Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-primary">
        <div className="absolute inset-0 z-10 bg-primary/80 backdrop-blur-[2px]" />
        <div className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-screen min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 opacity-30 grayscale contrast-125">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/9oRWxopIQ9o?autoplay=1&mute=1&loop=1&playlist=9oRWxopIQ9o&controls=0&modestbranding=1&playsinline=1&rel=0"
            title="Auth Background"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] z-20" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/30 rounded-full blur-[120px] z-20" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-30 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <span className="text-4xl font-hero text-ui tracking-tighter">
              MOSTBOOKED<span className="text-accent">.</span>
            </span>
          </Link>
          <h1 className="text-ui font-hero text-3xl tracking-widest uppercase">
            {isLogin ? 'Welcome Back' : 'Join the Elite'}
          </h1>
          <p className="text-ui/40 font-subheading text-[10px] uppercase tracking-[0.2em] mt-2">
            {isLogin ? 'Access your creative dashboard' : 'Start your cinematic journey today'}
          </p>
        </div>

        <div className="bg-secondary/60 backdrop-blur-2xl border border-ui/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-xl flex items-start space-x-3 text-accent text-xs"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Tabs */}
          <div className="flex bg-primary/50 p-1 rounded-xl mb-8 border border-ui/5">
            <button 
              onClick={() => toggleLogin(true)}
              className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${isLogin ? 'bg-accent text-white shadow-lg' : 'text-ui/40 hover:text-ui/60'}`}
            >
              Login
            </button>
            <button 
              onClick={() => toggleLogin(false)}
              className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${!isLogin ? 'bg-accent text-white shadow-lg' : 'text-ui/40 hover:text-ui/60'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-ui/40 font-bold ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-ui/20" size={18} />
                      <input 
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        type="text" 
                        placeholder="Enter your name"
                        className="w-full bg-primary/50 border border-ui/10 pl-12 pr-4 py-3.5 rounded-xl text-ui focus:border-accent outline-none transition-all placeholder:text-ui/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-ui/40 font-bold ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-ui/20" size={18} />
                      <input 
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        type="tel" 
                        placeholder="+234 000 000 0000"
                        className="w-full bg-primary/50 border border-ui/10 pl-12 pr-4 py-3.5 rounded-xl text-ui focus:border-accent outline-none transition-all placeholder:text-ui/20"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-ui/40 font-bold ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ui/20" size={18} />
                <input 
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-primary/50 border border-ui/10 pl-12 pr-4 py-3.5 rounded-xl text-ui focus:border-accent outline-none transition-all placeholder:text-ui/20"
                />
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-[10px] uppercase tracking-widest text-ui/40 font-bold ml-1">Confirm Email</label>
                  <div className="relative">
                    <MailCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-ui/20" size={18} />
                    <input 
                      required
                      name="confirmEmail"
                      value={formData.confirmEmail}
                      onChange={handleChange}
                      type="email" 
                      placeholder="name@example.com"
                      className="w-full bg-primary/50 border border-ui/10 pl-12 pr-4 py-3.5 rounded-xl text-ui focus:border-accent outline-none transition-all placeholder:text-ui/20"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] uppercase tracking-widest text-ui/40 font-bold">Password</label>
                {isLogin && (
                  <button type="button" className="text-[9px] uppercase tracking-widest text-accent hover:text-accent-hover transition-colors font-bold">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ui/20" size={18} />
                <input 
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-primary/50 border border-ui/10 pl-12 pr-12 py-3.5 rounded-xl text-ui focus:border-accent outline-none transition-all placeholder:text-ui/20"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ui/20 hover:text-ui/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-[10px] uppercase tracking-widest text-ui/40 font-bold ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ui/20" size={18} />
                    <input 
                      required
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full bg-primary/50 border border-ui/10 pl-12 pr-12 py-3.5 rounded-xl text-ui focus:border-accent outline-none transition-all placeholder:text-ui/20"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ui/20 hover:text-ui/60 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <PrimaryButton 
              type="submit" 
              className="w-full !py-4 flex items-center justify-center space-x-2 mt-4"
            >
              <span>{isLoading ? 'Processing...' : (isLogin ? 'Enter Dashboard' : 'Create Account')}</span>
              {!isLoading && <ArrowRight size={18} />}
            </PrimaryButton>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ui/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="bg-secondary px-4 text-ui/20">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="flex items-center justify-center space-x-3 py-3 border border-ui/10 rounded-xl hover:bg-primary transition-all text-ui/60 hover:text-ui disabled:opacity-50"
            >
              <Chrome size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Google</span>
            </button>
            <button className="flex items-center justify-center space-x-3 py-3 border border-ui/10 rounded-xl hover:bg-primary transition-all text-ui/60 hover:text-ui disabled:opacity-50">
              <Github size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">GitHub</span>
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-ui/30 text-[10px] uppercase tracking-widest">
          {isLogin ? "Don't have an account?" : "Already a member?"}
          <button 
            onClick={() => toggleLogin(!isLogin)}
            className="ml-2 text-accent font-bold hover:underline"
          >
            {isLogin ? "Join Now" : "Login Here"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;

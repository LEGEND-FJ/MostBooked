
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Star, Sparkles, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

interface FirestoreCourse {
  id: string;
  title: string;
  image: string;
  decription: string; // Intentional misspelling as per user request
  catergory: string;  // Intentional misspelling as per user request
  price?: string;
  duration?: string;
}

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<FirestoreCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  const [pageDescription, setPageDescription] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const docRef = doc(db, 'sites', 'mostbooked', 'global_content', 'data');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Look for dynamic header content for the courses page
          if (data.coursesPageTitle) setPageTitle(data.coursesPageTitle);
          if (data.coursesPageDescription) setPageDescription(data.coursesPageDescription);
        }
      } catch (err) {
        console.error("Error fetching global content for courses page:", err);
      }
    };

    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'sites', 'mostbooked', 'courses'));
        const fetchedCourses: FirestoreCourse[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || 'Untitled Course',
            image: data.image || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800',
            decription: data.decription || data.description || '', // Prioritize user-requested 'decription' key
            catergory: data.catergory || data.category || 'Academy', // Prioritize user-requested 'catergory' key
            price: data.price || 'Contact for Price',
            duration: data.duration || 'Flexible'
          };
        });
        setCourses(fetchedCourses);
      } catch (err) {
        console.error("Error fetching courses from Firestore:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalData();
    fetchCourses();
  }, []);

  const formatPrice = (price?: string) => {
    if (!price) return 'Contact for Price';
    // If it's a numeric string, add the prefix and Naira sign
    if (!isNaN(Number(price))) {
      return `Starting from ₦${price}`;
    }
    return price;
  };

  return (
    <main className="pt-32 bg-primary min-h-screen">
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent font-heading tracking-[0.3em] text-sm uppercase mb-4 block">Academy</span>
            
            {/* 
              Header text removed as per user screenshot circles: 
              'LEARN FROM THE PROFESSIONALS' is gone.
              If coursesPageTitle exists in Firestore, it will display here.
            */}
            {pageTitle && (
              <h1 className="text-ui font-hero text-6xl md:text-8xl leading-none mb-8 uppercase">
                {pageTitle}
              </h1>
            )}

            <p className="text-ui/60 font-body text-lg">
              {pageDescription || "Master the skills that power the world's most successful creators and production houses. Hands-on, cinematic education tailored for the next generation of visual storytellers."}
            </p>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-accent mb-4" size={48} strokeWidth={1} />
            <p className="text-ui/40 font-heading tracking-widest text-sm uppercase">Loading Curriculum...</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-secondary border border-ui/5 rounded-3xl overflow-hidden group flex flex-col h-full"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-accent text-[10px] text-white uppercase tracking-widest font-bold rounded-full">
                    {course.catergory}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center space-x-2 text-accent mb-4">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <span className="text-[10px] text-ui/40 uppercase tracking-widest ml-2">Highly Rated</span>
                  </div>
                  <h3 className="text-ui font-heading text-2xl mb-4 group-hover:text-accent transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-ui/50 text-sm font-body mb-6 line-clamp-3">
                    {course.decription}
                  </p>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-ui/40 text-xs mb-8">
                      <div className="flex items-center space-x-2">
                        <BookOpen size={16} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} />
                        <span>Lifetime Access</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-heading text-ui">{formatPrice(course.price)}</span>
                      <button className="px-6 py-2 bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all duration-300 font-subheading text-[10px] uppercase tracking-widest font-bold rounded-lg border border-accent/20">
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-secondary/30 rounded-3xl border border-dashed border-ui/10">
            <p className="text-ui/40 font-heading text-xl uppercase tracking-widest">No courses available at the moment.</p>
            <p className="text-ui/20 text-sm mt-2">Check back soon for new masterclasses.</p>
          </div>
        )}
      </section>

      {/* Trust Section */}
      <section className="bg-primary py-24 border-t border-ui/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Sparkles className="text-accent mx-auto mb-8" size={48} />
          <h2 className="text-ui font-hero text-4xl md:text-5xl mb-12 uppercase">Transform your creative career</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Industry Experts', val: 'Taught by Pros' },
              { label: 'Real Projects', val: 'Case-based Learning' },
              { label: 'Community', val: 'Exclusive Discord' },
              { label: 'Certification', val: 'MostBooked Badge' }
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-secondary rounded-2xl border border-ui/5">
                <p className="text-accent font-heading text-xl mb-1">{stat.val}</p>
                <p className="text-ui/30 text-[10px] uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CoursesPage;

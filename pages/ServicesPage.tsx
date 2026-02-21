
import React from 'react';
import ServicesPreview from '../components/sections/ServicesPreview';
import { motion } from 'framer-motion';
import { Check, TrendingUp, Target, BarChart3 } from 'lucide-react';
import SEO from '../components/layout/SEO';

const ServicesPage: React.FC = () => {
  return (
    <main className="pt-32">
      <SEO 
        title="Our Services | MOSTBOOKED" 
        description="From high-end video production to YouTube growth ecosystems and podcast studio rentals in Lekki, Lagos."
      />
      <ServicesPreview />

      {/* Case Study Section / Results */}
      <section className="py-24 bg-primary px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-ui font-hero text-5xl mb-8 uppercase">Growth Ecosystem</h2>
              <div className="space-y-8">
                {[
                  { icon: Target, title: 'Strategic Planning', text: 'We map out your journey from first frame to final viral success.' },
                  { icon: TrendingUp, title: 'Viral Velocity', text: 'Our editing styles are optimized for retention and shareability.' },
                  { icon: BarChart3, title: 'Insight Reporting', text: 'Monthly audits to track growth and refine production strategy.' }
                ].map((item, i) => (
                  <div key={i} className="flex space-x-6">
                    <div className="shrink-0 w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-accent border border-ui/5">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-ui font-heading text-xl mb-2">{item.title}</h4>
                      <p className="text-ui/40 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-secondary rounded-3xl p-12 border border-ui/5">
              <div className="flex justify-between items-center mb-12">
                <span className="text-accent font-bold uppercase tracking-widest text-[10px]">YouTube Case Study</span>
                <span className="text-ui/40 text-[10px]">Client: TechBro NG</span>
              </div>
              <div className="space-y-12">
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="text-ui font-heading">Retention Rate</span>
                    <span className="text-accent font-heading">85%</span>
                  </div>
                  <div className="h-2 w-full bg-primary rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '85%' }}
                      className="h-full bg-accent"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="text-ui font-heading">CTR Optimization</span>
                    <span className="text-accent font-heading">14.2%</span>
                  </div>
                  <div className="h-2 w-full bg-primary rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '92%' }}
                      className="h-full bg-accent"
                    />
                  </div>
                </div>
                <p className="text-ui/40 text-xs italic">
                  *Based on Q3 2023 performance data compared to baseline before MOSTBOOKED engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;

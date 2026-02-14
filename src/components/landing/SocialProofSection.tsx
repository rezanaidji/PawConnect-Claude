import { motion, Variants } from 'framer-motion';
import { Container } from '../common/Container';
import { SectionWrapper } from '../common/SectionWrapper';
import { Button } from '../common/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const stats = [
  { id: 'dogs', value: '10,000+', label: 'Dogs Understood' },
  { id: 'satisfaction', value: '94%', label: 'Owner Satisfaction' },
  { id: 'meetups', value: '50,000+', label: 'Compatible Meetups Organized' },
  { id: 'uptime', value: '98%', label: 'System Uptime' },
];

const testimonial = {
  quote: "I'm an analytical person, and the ambiguity of dog ownership was killing me. PawConnect AI gave me the dashboard for my dog's soul I always wanted. It didn't just solve a problem; it gave me back my peace of mind and introduced me to a community of people who finally get it.",
  author: 'Alex M.',
  title: 'Senior Product Designer & PawConnect User',
  results: [
    { value: '80%', label: 'Reduction in Owner-Reported Anxiety' },
    { value: '5x', label: 'Increase in Positive Social Interactions' },
    { value: '100%', label: 'Deeper Bond Validated by Data' },
  ],
};

export function SocialProofSection() {
  const prefersReducedMotion = useReducedMotion();

  const counterVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <SectionWrapper id="social-proof" background="alt">
      <Container>
        {/* Stats Bar */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="stat-card"
              variants={counterVariants}
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-base-content/60">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonial */}
        <motion.div
          className="bg-base-100 rounded-3xl shadow-xl overflow-hidden"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Quote Section */}
            <div className="lg:col-span-3 p-8 md:p-12">
              <div className="text-6xl text-primary/20 font-serif mb-4">"</div>
              <blockquote className="text-xl md:text-2xl text-base-content leading-relaxed mb-8">
                {testimonial.quote}
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
                  AM
                </div>
                <div>
                  <div className="font-bold text-base-content">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-base-content/60">
                    {testimonial.title}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2 bg-gradient-to-br from-primary to-secondary p-8 md:p-12 text-white">
              <h3 className="text-lg font-medium opacity-90 mb-6">
                Alex's Results
              </h3>
              <div className="space-y-6">
                {testimonial.results.map((result) => (
                  <div key={result.label}>
                    <div className="text-3xl md:text-4xl font-bold mb-1">
                      {result.value}
                    </div>
                    <div className="text-sm opacity-80">{result.label}</div>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="mt-8 text-white border-white/30 hover:bg-white/10"
              >
                Read Alex's Full Story
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </SectionWrapper>
  );
}

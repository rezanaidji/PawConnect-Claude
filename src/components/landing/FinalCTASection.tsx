import { motion } from 'framer-motion';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function FinalCTASection() {
  const prefersReducedMotion = useReducedMotion();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="text-center text-white">
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Stop Guessing.{' '}
            <span className="opacity-90">Start Connecting.</span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl opacity-90 mb-10 max-w-3xl mx-auto"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Join the movement of tech-savvy dog owners who are using science to
            build the deepest, most confident relationship with their best friend.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => scrollToSection('#pricing')}
            >
              Get Your Clarity Kit Now
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-white border-white/30 hover:bg-white/10"
            >
              Schedule a 15-Minute Science Walkthrough
            </Button>
          </motion.div>

          {/* Trust Elements */}
          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-8 opacity-70"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <span>30-Day Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>Free Shipping</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

import { motion } from 'framer-motion';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 lg:pt-0 overflow-hidden bg-gradient-to-br from-base-100 via-base-100 to-primary/5">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 items-center">
          {/* Copy - 60% */}
          <motion.div
            className="lg:col-span-3 text-center lg:text-left"
            variants={containerVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
          >
            {/* Pre-headline */}
            <motion.p
              variants={itemVariants}
              className="text-sm font-medium text-primary uppercase tracking-wider mb-4"
            >
              Trusted by Leading Canine Behaviorists & Tech-Savvy Owners
            </motion.p>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-base-content leading-tight mb-6"
            >
              End the Guesswork.{' '}
              <span className="gradient-text">Decode Your Dog's Emotions</span>{' '}
              with Scientific AI.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-base-content/70 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              PawConnect AI transforms the anxious guessing game of pet ownership into a confident, data-informed experience. Gain real-time clarity on stress, joy, and fear to build the deepest bond possible.
            </motion.p>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8 opacity-60"
            >
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <span className="text-xl">🏆</span>
                <span>Veterinary Behavior Society</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <span className="text-xl">🔬</span>
                <span>Tech Innovation Award</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <span className="text-xl">📚</span>
                <span>Peer-Reviewed Research</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-4"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollToSection('#pricing')}
              >
                Get Your Clarity Kit
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection('#problem')}
              >
                See the Science
              </Button>
            </motion.div>

            {/* Micro-copy */}
            <motion.p
              variants={itemVariants}
              className="text-sm text-base-content/50"
            >
              30-Day Peace of Mind Guarantee • No credit card required for app preview
            </motion.p>
          </motion.div>

          {/* Visual - 40% */}
          <motion.div
            className="lg:col-span-2"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative">
              {/* AR Display Mock */}
              <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl p-8 shadow-2xl">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center relative overflow-hidden">
                  {/* Dog silhouette placeholder */}
                  <div className="text-9xl opacity-80">🐕</div>

                  {/* AR Overlay */}
                  <motion.div
                    className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center">
                        <span className="text-xl">😊</span>
                      </div>
                      <div className="text-white">
                        <div className="text-xs uppercase tracking-wider opacity-70">Emotional State</div>
                        <div className="font-bold text-secondary">JOY: 92%</div>
                        <div className="text-sm opacity-80">CALM: 98%</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Halo Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(0, 204, 255, 0.2) 0%, transparent 70%)',
                    }}
                    animate={prefersReducedMotion ? {} : {
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>

                {/* Device indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <div className="w-2 h-2 rounded-full bg-white/30" />
                  <div className="w-2 h-2 rounded-full bg-white/30" />
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -left-4 bg-success text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                animate={prefersReducedMotion ? {} : { y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                95% Accuracy
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

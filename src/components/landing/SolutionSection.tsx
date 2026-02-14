import { motion } from 'framer-motion';
import { Container } from '../common/Container';
import { SectionWrapper } from '../common/SectionWrapper';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function SolutionSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="solution" background="default">
      <Container size="lg">
        <div className="text-center">
          {/* Section Header */}
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-base-content mb-8"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Emotional Intelligence,{' '}
            <span className="gradient-text">Engineered for the Human-Animal Bond.</span>
          </motion.h2>

          {/* Solution Narrative */}
          <motion.p
            className="text-lg md:text-xl text-base-content/70 max-w-4xl mx-auto mb-12 leading-relaxed"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            The problem isn't your intuition; it's the lack of a reliable translator. PawConnect AI is the first ecosystem to merge peer-reviewed canine behavior science with real-time biometric data. We provide the objective truth you need to move from reactive guessing to proactive, confident intervention. This is not a gadget; it's a system designed to eliminate ambiguity and cultivate the deepest, most fulfilling relationship with your dog.
          </motion.p>

          {/* UVP Callout */}
          <motion.div
            className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-10 border border-primary/20"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-3xl">💡</span>
                </div>
              </div>

              {/* Content */}
              <div className="text-left">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-base-content mb-2">
                  The PawConnect Difference
                </h3>
                <p className="text-base-content/70 text-lg">
                  Unlike basic activity trackers, we provide{' '}
                  <strong className="text-primary">Emotional Matchmaking</strong>. Our AI analyzes temperament and emotional profiles to curate safe, compatible meetups, building community for both you and your dog.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Visual Indicators */}
          <motion.div
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🔬</div>
              <p className="text-sm text-base-content/60">Peer-Reviewed Science</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm text-base-content/60">Real-Time Data</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🤝</div>
              <p className="text-sm text-base-content/60">Community Focused</p>
            </div>
          </motion.div>
        </div>
      </Container>
    </SectionWrapper>
  );
}

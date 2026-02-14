import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Container } from '../common/Container';
import { SectionWrapper } from '../common/SectionWrapper';
import { Button } from '../common/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const features = [
  'Real-Time Emotional Decoding',
  'AR Smart Glasses Integration',
  'Emotional Matchmaking Network',
  'Biometric Health Tracking',
  'Full Data History & Analytics',
  '24/7 AI-Powered Insights',
  'Priority Community Access',
  'Dedicated Support',
];

export function PricingSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="pricing" background="default">
      <Container size="lg">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-base-content mb-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Invest in Clarity.{' '}
            <span className="gradient-text">Invest in Your Bond.</span>
          </motion.h2>
          <motion.p
            className="text-lg text-base-content/70"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Everything you need for complete emotional understanding
          </motion.p>
        </div>

        {/* Pricing Card */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-primary to-secondary p-1 rounded-3xl shadow-2xl">
            <div className="bg-base-100 rounded-3xl p-8 md:p-12">
              {/* Badge */}
              <div className="text-center mb-8">
                <span className="inline-block bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-4 py-2 rounded-full">
                  Premium Ecosystem
                </span>
              </div>

              {/* Pricing */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <div>
                    <span className="text-5xl md:text-6xl font-bold text-base-content">
                      $399
                    </span>
                    <span className="text-base-content/60 ml-2">one-time</span>
                  </div>
                  <div className="text-2xl text-base-content/40">+</div>
                  <div>
                    <span className="text-3xl md:text-4xl font-bold text-base-content">
                      $14.99
                    </span>
                    <span className="text-base-content/60">/mo</span>
                  </div>
                </div>
                <p className="text-sm text-base-content/60">
                  Hardware bundle + monthly subscription
                </p>
              </div>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-base-content">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button variant="primary" size="lg" fullWidth>
                Get Your Clarity Kit
              </Button>

              {/* Micro-copy */}
              <p className="text-center text-sm text-base-content/60 mt-4">
                30-Day Peace of Mind Guarantee
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <motion.p
            className="text-center text-sm text-base-content/60 mt-6"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            The $399 hardware bundle includes the IoT Collar and Smart Glasses.
            The monthly subscription unlocks the AI analysis, community features,
            and data storage.
          </motion.p>
        </motion.div>
      </Container>
    </SectionWrapper>
  );
}

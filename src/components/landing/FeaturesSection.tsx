import { motion } from 'framer-motion';
import { Container } from '../common/Container';
import { SectionWrapper } from '../common/SectionWrapper';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const features = [
  {
    id: 'collar',
    name: 'Real-Time Biometric Collar',
    title: 'Objective Data, Zero Ambiguity',
    description: "The IoT collar monitors heart rate variability, respiration, and movement patterns—the physiological markers of emotion. This raw, scientific data is the foundation of your new confidence, providing the objective truth about your dog's internal state, 24/7.",
    metric: 'Accuracy in Detecting Early Stress Signals',
    metricValue: '95%',
    icon: '📿',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'glasses',
    name: 'AR Smart Glasses',
    title: 'Instant Interpretation & Intervention',
    description: "The smart glasses overlay real-time emotional analysis onto your field of view. See a pulsing Amber Halo for stress or a Cool Blue for calm. This instant feedback loop allows you to intervene with a calming protocol before a situation escalates, turning potential failures into training successes.",
    metric: 'Reduction in Owner-Reported Anxiety',
    metricValue: '60%',
    icon: '👓',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'network',
    name: 'Emotional Matchmaking Network',
    title: 'Curated Community, Authentic Connection',
    description: "Stop risking chaotic dog parks. Our social network uses your dog's emotional profile and your shared values to suggest highly compatible dog-owner pairs nearby. Build genuine friendships and ensure every socialization experience is safe, structured, and positive.",
    metric: 'Higher Success Rate for Positive Social Interactions',
    metricValue: '5x',
    icon: '🌐',
    color: 'from-green-500 to-teal-500',
  },
];

export function FeaturesSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="features" background="alt">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            className="text-sm font-medium text-primary uppercase tracking-wider mb-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The Technology
          </motion.p>
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-base-content"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Three Pillars of{' '}
            <span className="gradient-text">Emotional Clarity</span>
          </motion.h2>
        </div>

        {/* Feature Cards */}
        <div className="space-y-16 lg:space-y-24">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Visual */}
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className={`bg-gradient-to-br ${feature.color} rounded-3xl p-1`}>
                  <div className="bg-base-100 rounded-3xl p-8 lg:p-12">
                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center">
                      <span className="text-8xl lg:text-9xl">{feature.icon}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
                  {feature.name}
                </p>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-base-content mb-6">
                  {feature.title}
                </h3>
                <p className="text-lg text-base-content/70 leading-relaxed mb-8">
                  {feature.description}
                </p>

                {/* Metric */}
                <div className="bg-base-200 rounded-xl p-6 inline-flex items-center gap-4">
                  <div className="text-4xl lg:text-5xl font-bold gradient-text">
                    {feature.metricValue}
                  </div>
                  <div className="text-base-content/70">
                    {feature.metric}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}

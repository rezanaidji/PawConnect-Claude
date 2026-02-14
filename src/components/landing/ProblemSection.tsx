import { motion } from 'framer-motion';
import { Container } from '../common/Container';
import { SectionWrapper } from '../common/SectionWrapper';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const problems = [
  {
    id: 'ambiguity',
    headline: 'Constant Second-Guessing',
    description: "Every yawn, every tail wag, every half-bark leaves you questioning: Is this stress? Fear? Or just a dog being a dog? The lack of objective data creates a persistent, low-grade anxiety.",
    statValue: '90%',
    statDescription: "of dog owners think they can detect fear, but only 16% can do so accurately.",
    icon: '🤔',
  },
  {
    id: 'guilt',
    headline: 'Unseen Distress',
    description: "You worry that despite your best efforts, you are missing critical signs of discomfort or anxiety, leading to behavioral issues and a profound sense of guilt that you are failing your best friend.",
    statValue: '80%',
    statDescription: "of dog owners report feeling guilt over leaving their pet alone.",
    icon: '😔',
  },
  {
    id: 'isolation',
    headline: 'Searching for Your Tribe',
    description: "You crave a community of like-minded owners who share your commitment to data-driven, optimal pet care, but struggle to find authentic connections beyond chaotic dog parks.",
    statValue: '75%',
    statDescription: "of dog owners wish they had a reliable way to find compatible playmates.",
    icon: '🔍',
  },
];

export function ProblemSection() {
  const prefersReducedMotion = useReducedMotion();

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
      },
    }),
  };

  return (
    <SectionWrapper id="problem" background="alt">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-base-content mb-6"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Are You Missing the Subtle Signals{' '}
            <span className="gradient-text">That Matter Most?</span>
          </motion.h2>
        </div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.id}
              className="bg-base-100 rounded-2xl p-8 shadow-lg card-hover"
              custom={index}
              variants={cardVariants}
              initial={prefersReducedMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Icon */}
              <div className="text-5xl mb-6">{problem.icon}</div>

              {/* Headline */}
              <h3 className="text-xl font-serif font-bold text-base-content mb-4">
                {problem.headline}
              </h3>

              {/* Description */}
              <p className="text-base-content/70 mb-6 leading-relaxed">
                {problem.description}
              </p>

              {/* Stat */}
              <div className="pt-6 border-t border-base-200">
                <div className="text-4xl font-bold gradient-text mb-2">
                  {problem.statValue}
                </div>
                <p className="text-sm text-base-content/60">
                  {problem.statDescription}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}

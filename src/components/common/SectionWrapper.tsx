import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'alt' | 'gradient' | 'dark';
}

const backgroundStyles = {
  default: 'bg-base-100',
  alt: 'bg-base-200',
  gradient: 'gradient-primary text-white',
  dark: 'bg-neutral-900 text-white',
};

export function SectionWrapper({
  children,
  className = '',
  id,
  background = 'default',
}: SectionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      id={id}
      className={`section-padding ${backgroundStyles[background]} ${className}`}
      initial={prefersReducedMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={sectionVariants}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
}

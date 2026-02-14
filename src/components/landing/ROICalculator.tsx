import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '../common/Container';
import { SectionWrapper } from '../common/SectionWrapper';
import { Button } from '../common/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { calculateEmotionalROI, formatCurrency } from '../../utils/roiCalculator';
import type { ROIInputs, ROIResults } from '../../types/landing';

const defaultInputs: ROIInputs = {
  worryHours: 5,
  failedSpend: 500,
  incidents: 2,
  researchHours: 3,
};

export function ROICalculator() {
  const prefersReducedMotion = useReducedMotion();
  const [inputs, setInputs] = useState<ROIInputs>(defaultInputs);
  const [results, setResults] = useState<ROIResults>(() =>
    calculateEmotionalROI(defaultInputs)
  );

  useEffect(() => {
    setResults(calculateEmotionalROI(inputs));
  }, [inputs]);

  const handleInputChange = (field: keyof ROIInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SectionWrapper id="calculator" background="default">
      <Container size="lg">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-base-content mb-4"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Calculate Your Annual Value of{' '}
            <span className="gradient-text">Peace of Mind</span>
          </motion.h2>
          <motion.p
            className="text-lg text-base-content/70"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            See how much clarity and confidence is worth to you
          </motion.p>
        </div>

        <motion.div
          className="bg-base-200 rounded-3xl p-6 md:p-8 lg:p-12"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Inputs */}
            <div className="space-y-8">
              {/* Worry Hours */}
              <div>
                <label className="block text-base-content font-medium mb-2">
                  Hours spent worrying about your dog's happiness per week
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={inputs.worryHours}
                    onChange={(e) =>
                      handleInputChange('worryHours', parseInt(e.target.value))
                    }
                    className="range range-primary flex-1"
                  />
                  <span className="text-xl font-bold text-primary w-12 text-right">
                    {inputs.worryHours}h
                  </span>
                </div>
              </div>

              {/* Failed Spend */}
              <div>
                <label className="block text-base-content font-medium mb-2">
                  Money spent on failed solutions per year (supplements, courses)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/60">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    step="100"
                    value={inputs.failedSpend}
                    onChange={(e) =>
                      handleInputChange('failedSpend', parseInt(e.target.value) || 0)
                    }
                    className="input input-bordered w-full pl-8"
                  />
                </div>
              </div>

              {/* Incidents */}
              <div>
                <label className="block text-base-content font-medium mb-2">
                  Stressful/negative socialization incidents per month
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={inputs.incidents}
                  onChange={(e) =>
                    handleInputChange('incidents', parseInt(e.target.value) || 0)
                  }
                  className="input input-bordered w-full"
                />
              </div>

              {/* Research Hours */}
              <div>
                <label className="block text-base-content font-medium mb-2">
                  Average time spent researching dog behavior per week
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={inputs.researchHours}
                    onChange={(e) =>
                      handleInputChange('researchHours', parseInt(e.target.value))
                    }
                    className="range range-primary flex-1"
                  />
                  <span className="text-xl font-bold text-primary w-12 text-right">
                    {inputs.researchHours}h
                  </span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white">
              <h3 className="text-lg font-medium opacity-90 mb-2">
                Your Annual Value of Peace of Mind
              </h3>
              <motion.div
                className="text-5xl md:text-6xl font-bold mb-8"
                key={results.totalValue}
                initial={prefersReducedMotion ? false : { scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {formatCurrency(results.totalValue)}
              </motion.div>

              {/* Breakdown */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <span className="opacity-80">Time Saved on Guesswork</span>
                  <span className="font-semibold">
                    {formatCurrency(results.timeSavedValue)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <span className="opacity-80">Avoided Failed Solutions</span>
                  <span className="font-semibold">
                    {formatCurrency(results.avoidedCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <span className="opacity-80">Avoided Incident Costs</span>
                  <span className="font-semibold">
                    {formatCurrency(results.avoidedIncidentCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="opacity-80">Hours Saved Annually</span>
                  <span className="font-semibold">{results.timeSavedHours} hrs</span>
                </div>
              </div>

              <Button
                variant="secondary"
                fullWidth
                className="bg-white text-primary hover:bg-white/90"
              >
                Get Your Custom Peace of Mind Report
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </SectionWrapper>
  );
}

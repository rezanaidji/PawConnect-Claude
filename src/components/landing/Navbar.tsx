import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Bot } from 'lucide-react';
import { Button } from '../common/Button';
import { useTheme } from '../../context/ThemeContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useSession } from '../../context/SessionContext';
import supabase from '../../supabase';
import ShinyText from '../ui/ShinyText';

const navLinks = [
  { label: 'The Science', href: '#problem', sectionId: 'problem' },
  { label: 'The Tech', href: '#features', sectionId: 'features' },
  { label: 'Community', href: '#social-proof', sectionId: 'social-proof' },
  { label: 'Pricing', href: '#pricing', sectionId: 'pricing' },
  { label: 'AI Chat', href: '/ai-chat', isRoute: true },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const { session } = useSession();
  const navRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Track active section
      const sections = navLinks
        .filter((l) => !l.isRoute && l.sectionId)
        .map((l) => l.sectionId!);

      let current = '';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <motion.nav
        className={`w-full max-w-6xl rounded-2xl transition-all duration-300 border border-secondary/20 ${
          isScrolled
            ? 'bg-base-100/90 backdrop-blur-lg shadow-xl shadow-primary/5'
            : 'bg-base-100/80 backdrop-blur-md shadow-lg shadow-primary/5'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* Gradient bottom border */}
        <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-transparent via-secondary to-transparent" />

        {/* Subtle glow on top border */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2 text-xl font-bold font-serif"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
              }}
            >
              <span className="text-2xl">🐾</span>
              <ShinyText
                text="PawConnect AI"
                color="#004D99"
                shineColor="#00CCFF"
                speed={3}
                className="text-xl font-bold font-serif"
              />
            </a>

            {/* Desktop Navigation */}
            <div ref={navRef} className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="relative flex items-center gap-1.5 text-base-content hover:text-primary transition-colors font-semibold px-4 py-2 rounded-lg hover:bg-base-200/50"
                  >
                    <Bot className="w-4 h-4" />
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className={`relative font-semibold px-4 py-2 rounded-lg transition-colors ${
                      activeSection === link.sectionId
                        ? 'text-primary bg-primary/10'
                        : 'text-base-content hover:text-primary hover:bg-base-200/50'
                    }`}
                  >
                    {link.label}
                    {/* Active indicator */}
                    {activeSection === link.sectionId && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-primary to-secondary"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </a>
                )
              )}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-base-200/50 transition-colors"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="text-base-content hover:text-primary transition-colors font-semibold px-3 py-2 rounded-lg hover:bg-base-200/50"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/auth/sign-in"
                  className="text-base-content hover:text-primary transition-colors font-semibold px-3 py-2 rounded-lg hover:bg-base-200/50"
                >
                  Sign In
                </Link>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => scrollToSection('#pricing')}
              >
                Get Your Clarity Kit
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-base-200/50 transition-colors"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-base-200/50 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden border-t border-base-200/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {navLinks.map((link) =>
                  link.isRoute ? (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="flex items-center gap-1.5 text-base-content hover:text-primary transition-colors font-semibold py-2 px-3 rounded-lg hover:bg-base-200/50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Bot className="w-4 h-4" />
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className={`font-semibold py-2 px-3 rounded-lg transition-colors ${
                        activeSection === link.sectionId
                          ? 'text-primary bg-primary/10'
                          : 'text-base-content hover:text-primary hover:bg-base-200/50'
                      }`}
                    >
                      {link.label}
                    </a>
                  )
                )}
                <hr className="border-base-200 my-2" />
                {session ? (
                  <button
                    onClick={handleSignOut}
                    className="text-base-content hover:text-primary transition-colors font-semibold py-2 px-3 text-left rounded-lg hover:bg-base-200/50"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    to="/auth/sign-in"
                    className="text-base-content hover:text-primary transition-colors font-semibold py-2 px-3 rounded-lg hover:bg-base-200/50"
                  >
                    Sign In
                  </Link>
                )}
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => scrollToSection('#pricing')}
                >
                  Get Your Clarity Kit
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

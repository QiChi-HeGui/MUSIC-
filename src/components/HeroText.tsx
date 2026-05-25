import { motion, AnimatePresence } from 'motion/react';
import { TypographyPreset, HeroContent } from '../types';
import { PlayCircle, ArrowUpRight, Sparkles } from 'lucide-react';

interface HeroTextProps {
  preset: TypographyPreset;
  content: HeroContent;
  accentColor: string;
  onCtaClick: () => void;
}

export default function HeroText({ preset, content, accentColor, onCtaClick }: HeroTextProps) {
  // Letter animation variants for the main Title
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        ease: [0.16, 1, 0.3, 1],
        duration: 0.8,
      },
    },
  };

  const elementVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ease: [0.16, 1, 0.3, 1], duration: 1, delay: 0.4 },
    },
  };

  // Convert Title string to list of letters to achieve premium stagger entrance
  const titleWords = content.title.split(' ');

  return (
    <div className="relative z-20 w-full max-w-5xl px-6 md:px-12 lg:px-16 flex flex-col items-center text-center justify-center min-h-[40vh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${preset.id}-${content.title}`}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="flex flex-col items-center justify-center space-y-6 md:space-y-8"
        >
          {/* 1. Tagline Line */}
          <motion.div
            variants={elementVariants}
            className="flex items-center gap-2"
          >
            <span 
              className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
              style={{ backgroundColor: accentColor }}
            />
            <span className={preset.taglineClass}>
              {content.tagline}
            </span>
          </motion.div>

          {/* 2. Main High-Couture Title */}
          <motion.h1 
            variants={titleContainerVariants}
            className={`${preset.titleClass} select-none leading-none`}
          >
            {titleWords.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block whitespace-nowrap mr-3 last:mr-0">
                {word.split('').map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    variants={letterVariants}
                    className="inline-block hover:scale-105 hover:text-white transition-transform duration-200 cursor-default"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h1>

          {/* 3. Subtitle / Descriptive Layer */}
          <motion.p
            variants={elementVariants}
            className={`${preset.subtitleClass} max-w-2xl text-center font-light leading-relaxed`}
          >
            {content.subtitle}
          </motion.p>

          {/* 4. Elegant Call To Action */}
          <motion.div
            variants={elementVariants}
            className="pt-4 flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              onClick={onCtaClick}
              id="cinematic-cta-primary"
              className={`${preset.ctaClass} cursor-pointer group flex items-center justify-center gap-2.5 transition-all duration-300 transform active:scale-95`}
            >
              <span>{content.ctaText}</span>
              {preset.id === 'cyber' ? (
                <Sparkles className="w-4 h-4 text-[#14b8a6] group-hover:rotate-12 transition-transform duration-300" />
              ) : preset.id === 'editorial' ? (
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              ) : (
                <PlayCircle className="w-4 h-4 text-stone-900 group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

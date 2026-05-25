import { motion, AnimatePresence } from 'motion/react';
import { VignetteIntensity, ColorGradePreset } from '../types';

interface CinematicOverlayProps {
  vignette: VignetteIntensity;
  colorGrade: ColorGradePreset;
  letterbox: boolean;
}

export default function CinematicOverlay({ vignette, colorGrade, letterbox }: CinematicOverlayProps) {
  // Vignette style definition
  const vignetteStyles = {
    none: 'bg-black/0',
    soft: 'bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]',
    medium: 'bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.65)_100%)]',
    deep: 'bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.85)_100%)]',
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none transition-all duration-700">
      {/* Base Gradient Overlays from Frosted Glass Theme */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/45" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.35)_100%)]" />

      {/* Dynamic Color Grade Overlay */}
      <div className={`absolute inset-0 transition-all duration-1000 ${colorGrade.overlayClass}`} />

      {/* Dynamic Vignette Layer */}
      <div className={`absolute inset-0 transition-all duration-700 ${vignetteStyles[vignette]}`} />

      {/* Subtle Ambient Lens Glows */}
      <div className="cinematic-glow w-[600px] h-[600px] left-1/4 top-1/4 -translate-y-1/2 -translate-x-1/2 mix-blend-screen opacity-70" />
      <div className="lens-flare-teal w-[500px] h-[500px] right-1/4 bottom-1/4 translate-y-1/3 translate-x-1/3 mix-blend-screen opacity-50" />

      {/* Cinematic Letterbox Aspect Ratio (2.39:1 widescreen bars) */}
      <AnimatePresence>
        {letterbox && (
          <>
            {/* Top Widescreen Bar */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '8%' }}
              exit={{ height: 0 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.2 }}
              className="absolute top-0 left-0 right-0 bg-stone-950 border-b border-white/5 z-40 pointer-events-auto"
            />
            {/* Bottom Widescreen Bar */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '8%' }}
              exit={{ height: 0 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.2 }}
              className="absolute bottom-0 left-0 right-0 bg-stone-950 border-t border-white/5 z-40 pointer-events-auto"
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

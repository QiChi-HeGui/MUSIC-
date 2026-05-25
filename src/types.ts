export type TypographyTheme = 'editorial' | 'cyber' | 'minimal';

export interface TypographyPreset {
  id: TypographyTheme;
  name: string;
  titleClass: string;
  subtitleClass: string;
  taglineClass: string;
  ctaClass: string;
  fontFamily: string;
}

export type ColorGrade = 'natural' | 'teal-orange' | 'warm-amber' | 'noir' | 'emerald';

export interface ColorGradePreset {
  id: ColorGrade;
  name: string;
  overlayClass: string;
  accentColor: string;
  gradientFrom: string;
}

export type VignetteIntensity = 'none' | 'soft' | 'medium' | 'deep';

export interface HeroContent {
  tagline: string;
  title: string;
  subtitle: string;
  ctaText: string;
}

export interface LyricLine {
  time: number; // time in seconds
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
  audioUrl: string;
  lyricsText?: string;
  parsedLyrics: LyricLine[];
}

export interface CinematicState {
  typography: TypographyTheme;
  colorGrade: ColorGrade;
  vignette: VignetteIntensity;
  letterbox: boolean;
  content: HeroContent;
  isMuted: boolean;
  isPlaying: boolean;
}


import { TypographyPreset, ColorGradePreset, HeroContent } from './types';

export const TYPOGRAPHY_PRESETS: Record<string, TypographyPreset> = {
  editorial: {
    id: 'editorial',
    name: '典雅美学 (Editorial Lux)',
    fontFamily: 'font-serif',
    titleClass: 'font-serif text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-none text-stone-100 italic',
    subtitleClass: 'font-sans text-xs md:text-sm font-light tracking-[0.25em] uppercase text-stone-400',
    taglineClass: 'font-sans text-stone-500 font-medium tracking-[0.4em] uppercase text-xs',
    ctaClass: 'font-sans border border-stone-700 hover:border-stone-400 bg-stone-950/40 backdrop-blur-md text-stone-200 text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:bg-stone-100 hover:text-stone-950 px-8 py-3.5 rounded-none',
  },
  cyber: {
    id: 'cyber',
    name: '赛博视界 (Cyber Horizon)',
    fontFamily: 'font-mono',
    titleClass: 'font-mono text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase text-slate-100',
    subtitleClass: 'font-mono text-[10px] md:text-xs font-normal tracking-widest text-[#14b8a6]',
    taglineClass: 'font-mono text-slate-500 text-[10px] uppercase font-semibold tracking-widest border-b border-white/10 pb-1.5',
    ctaClass: 'font-mono border border-[#14b8a6]/40 hover:border-[#14b8a6] bg-slate-950/80 text-[#14b8a6] text-xs uppercase tracking-wider transition-all duration-300 hover:bg-[#14b8a6]/10 px-6 py-3 rounded-none shadow-[0_0_15px_rgba(20,184,166,0.1)]',
  },
  minimal: {
    id: 'minimal',
    name: '北欧极简 (Nordic Clean)',
    fontFamily: 'font-sans',
    titleClass: 'font-sans text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white uppercase',
    subtitleClass: 'font-sans text-xs md:text-sm font-semibold tracking-wider text-rose-500 uppercase',
    taglineClass: 'font-sans text-white/40 text-xs font-semibold uppercase tracking-widest',
    ctaClass: 'font-sans font-bold bg-white text-black hover:bg-white/90 text-xs tracking-wider uppercase transition-all duration-300 px-8 py-4 rounded-full shadow-lg',
  }
};

export const COLOR_GRADES: Record<string, ColorGradePreset> = {
  natural: {
    id: 'natural',
    name: '原生电影感胶片 (Natural)',
    overlayClass: 'mix-blend-normal bg-transparent',
    accentColor: '#ffffff',
    gradientFrom: 'from-stone-950/90',
  },
  'teal-orange': {
    id: 'teal-orange',
    name: '好莱坞青橙 (Teal & Orange)',
    overlayClass: 'mix-blend-color bg-gradient-to-tr from-cyan-900/40 via-transparent to-orange-900/30',
    accentColor: '#0ea5e9',
    gradientFrom: 'from-slate-950/95',
  },
  'warm-amber': {
    id: 'warm-amber',
    name: '黄金温润琥珀 (Amber Hour)',
    overlayClass: 'mix-blend-color bg-gradient-to-tr from-amber-950/45 via-amber-900/10 to-stone-950/40',
    accentColor: '#f59e0b',
    gradientFrom: 'from-black/95',
  },
  noir: {
    id: 'noir',
    name: '黑白艺术默片 (Noir Grayscale)',
    overlayClass: 'backdrop-grayscale mix-blend-saturation bg-stone-900/10',
    accentColor: '#a8a29e',
    gradientFrom: 'from-black/95',
  },
  emerald: {
    id: 'emerald',
    name: '深邃翡翠森林 (Deep Emerald)',
    overlayClass: 'mix-blend-color bg-gradient-to-tr from-emerald-950/40 via-transparent to-stone-950/20',
    accentColor: '#10b981',
    gradientFrom: 'from-zinc-950/95',
  }
};

export const DEFAULT_CONTENT_BY_THEME: Record<string, HeroContent> = {
  editorial: {
    tagline: '首映级电影感音乐典藏',
    title: '温 润 视 听 的 艺 术 境 界',
    subtitle: '探寻电影工业美学、动效几何与逐字高保真歌词的时空回响',
    ctaText: '开启声色之旅',
  },
  cyber: {
    tagline: '系统代号: 霓虹星云 NEBULON',
    title: '数 码 衰 变 // 幻 境 主 机',
    subtitle: '来自同步高保真传感器与多音频通道的实时宽屏流渲染反馈',
    ctaText: '启动甲板/播放',
  },
  minimal: {
    tagline: '导演精选 2026',
    title: '纯 粹 与 留 白',
    subtitle: '空无是听觉感官与精妙物理律动的极致画布',
    ctaText: '进入歌单',
  }
};

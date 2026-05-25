import { motion } from 'motion/react';
import { TypographyTheme, ColorGrade, VignetteIntensity, HeroContent } from '../types';
import { TYPOGRAPHY_PRESETS, COLOR_GRADES } from '../data';
import { 
  X, Type, Palette, Eye, Film, Sliders, ChevronDown, 
  RotateCcw, SlidersHorizontal, Check, Play, Pause, FileText 
} from 'lucide-react';
import { useState } from 'react';

interface ControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  vignette: VignetteIntensity;
  setVignette: (v: VignetteIntensity) => void;
  typography: TypographyTheme;
  setTypography: (t: TypographyTheme) => void;
  colorGrade: ColorGrade;
  setColorGrade: (c: ColorGrade) => void;
  letterbox: boolean;
  setLetterbox: (l: boolean) => void;
  content: HeroContent;
  setContent: (content: HeroContent) => void;
  resetToPreset: () => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export default function ControlPanel({
  isOpen,
  onClose,
  vignette,
  setVignette,
  typography,
  setTypography,
  colorGrade,
  setColorGrade,
  letterbox,
  setLetterbox,
  content,
  setContent,
  resetToPreset,
  isPlaying,
  setIsPlaying
}: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<'visuals' | 'content'>('visuals');

  const handleTextChange = (field: keyof HeroContent, val: string) => {
    setContent({
      ...content,
      [field]: val,
    });
  };

  const handleThemeChange = (themeId: TypographyTheme) => {
    setTypography(themeId);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
      className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white/[0.03] backdrop-blur-3xl border-l border-white/15 z-50 flex flex-col shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-white/70" />
          <h2 className="font-mono text-sm uppercase tracking-wider text-white font-medium">
            导演调试台 (Director Desk)
          </h2>
        </div>
        <button
          onClick={onClose}
          id="btn-close-panel"
          className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-stone-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 text-xs font-mono">
        <button
          onClick={() => setActiveTab('visuals')}
          id="tab-visuals"
          className={`flex-1 py-3 text-center uppercase tracking-widest transition-colors cursor-pointer border-b ${
            activeTab === 'visuals'
              ? 'text-white border-white/50 bg-white/[0.02]'
              : 'text-stone-400 hover:text-white border-transparent'
          }`}
        >
          电影滤镜美学
        </button>
        <button
          onClick={() => setActiveTab('content')}
          id="tab-content"
          className={`flex-1 py-3 text-center uppercase tracking-widest transition-colors cursor-pointer border-b ${
            activeTab === 'content'
              ? 'text-white border-white/50 bg-white/[0.02]'
              : 'text-stone-400 hover:text-white border-transparent'
          }`}
        >
          台词剧本修改
        </button>
      </div>

      {/* Panel Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {activeTab === 'visuals' ? (
          <>
            {/* Playback Control Quick Section */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono tracking-widest text-stone-400 uppercase flex items-center gap-1">
                <Film className="w-3.5 h-3.5" /> 氛围背景视频播放
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsPlaying(true)}
                  id="btn-play"
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono border cursor-pointer transition-all ${
                    isPlaying 
                      ? 'bg-white text-stone-950 border-white font-bold' 
                      : 'border-white/10 text-stone-300 hover:bg-white/5'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> 处于播放状态
                </button>
                <button
                  onClick={() => setIsPlaying(false)}
                  id="btn-pause"
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono border cursor-pointer transition-all ${
                    !isPlaying 
                      ? 'bg-white text-stone-950 border-white font-bold' 
                      : 'border-white/10 text-stone-300 hover:bg-white/5'
                  }`}
                >
                  <Pause className="w-3.5 h-3.5 fill-current" /> 处于暂停状态
                </button>
              </div>
            </div>

            {/* Typography Presets */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono tracking-widest text-stone-400 uppercase flex items-center gap-1">
                <Type className="w-3.5 h-3.5" /> 视觉排版美学 presets
              </label>
              <div className="space-y-2">
                {(Object.keys(TYPOGRAPHY_PRESETS) as TypographyTheme[]).map((key) => {
                  const item = TYPOGRAPHY_PRESETS[key];
                  const isSelected = typography === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleThemeChange(key)}
                      id={`preset-${key}`}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? 'bg-white/[0.04] border-white/30 shadow-md'
                          : 'border-white/5 hover:border-white/10 bg-transparent'
                      }`}
                    >
                      <div>
                        <p className={`text-stone-200 text-xs font-mono ${isSelected ? 'text-white' : ''}`}>
                          {item.name}
                        </p>
                        <p className={`text-[10px] text-stone-500 font-sans mt-0.5 ${item.fontFamily}`}>
                          {key === 'editorial' ? '古典奢华 Playfair + Plus Jakarta' : key === 'cyber' ? '赛博科技 JetBrains Mono' : '原生粗斜极简几何 (Large Heavy Sans)'}
                        </p>
                      </div>
                      {isSelected ? (
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-stone-600 group-hover:text-stone-400 transition-colors" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Grade Filters */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono tracking-widest text-stone-400 uppercase flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" /> 电影工业级色彩分级 (LUT)
              </label>
              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(COLOR_GRADES) as ColorGrade[]).map((key) => {
                  const item = COLOR_GRADES[key];
                  const isSelected = colorGrade === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setColorGrade(key)}
                      id={`grade-${key}`}
                      className={`w-full text-left px-3.5 py-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? 'bg-white/15 border-white/40 shadow-inner'
                          : 'border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: item.accentColor }}
                        />
                        <span className="text-stone-200 text-xs font-mono group-hover:text-white transition-colors">
                          {item.name}
                        </span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vignette Sliders */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono tracking-widest text-stone-400 uppercase flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> 镜头暗角阻断落差 (Vignette)
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-stone-900/60 rounded-lg border border-white/5">
                {(['none', 'soft', 'medium', 'deep'] as VignetteIntensity[]).map((level) => {
                  const isSelected = vignette === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setVignette(level)}
                      id={`vignette-${level}`}
                      className={`py-1.5 rounded-md text-[10px] font-mono uppercase tracking-wider text-center cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white/15 text-white font-medium shadow-sm'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      {level === 'none' ? '无暗角' : level === 'soft' ? '温和' : level === 'medium' ? '标准' : '深邃'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Widescreen Toggle */}
            <div className="pt-2">
              <div className="flex items-center justify-between p-3.5 bg-stone-900/40 rounded-xl border border-white/5">
                <div className="space-y-0.5 max-w-[70%]">
                  <span className="text-stone-200 text-xs font-mono block">电影遮幅宽影院 (2.39:1)</span>
                  <span className="text-[10px] text-stone-500 block">在上下方加入专业遮幅，还原电影院高比例临场感受</span>
                </div>
                <button
                  onClick={() => setLetterbox(!letterbox)}
                  id="toggle-letterbox"
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer shrink-0 ${
                    letterbox ? 'bg-white' : 'bg-stone-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full shadow-md transform duration-300 ease-out ${
                      letterbox ? 'translate-x-5 bg-stone-950' : 'translate-x-0 bg-stone-400'
                    }`}
                  />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-5">
            {/* Text Editor Header */}
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-mono tracking-widest text-stone-400 uppercase flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> 画布台词与字幕
              </p>
              <button
                onClick={resetToPreset}
                id="btn-restore-defaults"
                className="text-[10px] font-mono tracking-wider flex items-center gap-1 text-stone-400 hover:text-white cursor-pointer transition-colors"
                title="重置当前文字为排版预置的描述蓝图"
              >
                <RotateCcw className="w-3 h-3" /> 恢复排版默认值
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-widest text-stone-400 uppercase block">
                  环境先导小标题 (Tagline)
                </label>
                <input
                  type="text"
                  value={content.tagline}
                  onChange={(e) => handleTextChange('tagline', e.target.value)}
                  maxLength={40}
                  className="w-full px-3 py-2.5 bg-stone-900/60 border border-white/10 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="例如：首映级电影感音乐典藏"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-widest text-stone-400 uppercase block">
                  中央主巨幕标题 (Title)
                </label>
                <textarea
                  value={content.title}
                  onChange={(e) => handleTextChange('title', e.target.value)}
                  maxLength={80}
                  rows={2}
                  className="w-full px-3 py-2.5 bg-stone-900/60 border border-white/10 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-white/30 transition-colors resize-none leading-relaxed"
                  placeholder="例如：温 润 视 听 的 艺 术 境 界"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-widest text-stone-400 uppercase block">
                  故事阐述段落 (Subtitle / Logline)
                </label>
                <textarea
                  value={content.subtitle}
                  onChange={(e) => handleTextChange('subtitle', e.target.value)}
                  maxLength={180}
                  rows={3}
                  className="w-full px-3 py-2.5 bg-stone-900/60 border border-white/10 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-white/30 transition-colors resize-none leading-relaxed"
                  placeholder="精致描述关于该部作品的概念思想..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-widest text-stone-400 uppercase block">
                  呼吁引导按钮文字 (CTA button)
                </label>
                <input
                  type="text"
                  value={content.ctaText}
                  onChange={(e) => handleTextChange('ctaText', e.target.value)}
                  maxLength={30}
                  className="w-full px-3 py-2.5 bg-stone-900/60 border border-white/10 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="例如：开启声色之旅"
                />
              </div>
            </div>

            {/* Micro Hint */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-[11px] text-stone-400 leading-relaxed font-sans">
              <span className="font-semibold text-white block mb-1">交互动能偏移解构！</span>
              主大幕的每一个字符都已自动解构为独立的交互微单元。当您在屏幕中央将光标滑过这些字符时，它会敏锐地随着光标产生立体的3D震颤与缩放效果，极具视觉冲击力。
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding Info */}
      <div className="p-4 bg-stone-950 border-t border-white/10 text-[10px] text-stone-500 font-mono text-center flex items-center justify-center gap-1.5">
        <SlidersHorizontal className="w-3 h-3 text-stone-500" />
        <span>电影级视听画境实验器 V1.1</span>
      </div>
    </motion.div>
  );
}

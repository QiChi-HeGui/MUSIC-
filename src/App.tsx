import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, Volume2, VolumeX, RefreshCw, CheckCircle2, Monitor, Music, Tv } from 'lucide-react';
import CinematicOverlay from './components/CinematicOverlay';
import HeroText from './components/HeroText';
import ControlPanel from './components/ControlPanel';
import MusicPlayerDeck from './components/MusicPlayerDeck';
import { TYPOGRAPHY_PRESETS, COLOR_GRADES, DEFAULT_CONTENT_BY_THEME } from './data';
import { PRESET_TRACKS } from './songsPreset';
import { TypographyTheme, ColorGrade, VignetteIntensity, HeroContent, Track } from './types';

export default function App() {
  // Cinematic Visual & Configuration states
  const [typography, setTypography] = useState<TypographyTheme>('editorial');
  const [colorGrade, setColorGrade] = useState<ColorGrade>('teal-orange');
  const [vignette, setVignette] = useState<VignetteIntensity>('medium');
  const [letterbox, setLetterbox] = useState<boolean>(true);
  
  // Custom script content state
  const [content, setContent] = useState<HeroContent>({
    tagline: '以太数码合成器 AETHER STUDIO',
    title: '温 润 视 听 的 艺 术 境 界',
    subtitle: '同步交互式电影宽屏逐字提词器与高雅的本地高保真声波频率',
    ctaText: '开启声色之旅',
  });

  // Track Playlist Status State
  const [tracks, setTracks] = useState<Track[]>(PRESET_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const currentTrack = tracks[currentTrackIndex] || PRESET_TRACKS[0];

  // Screen layout mode ('music' for audio deck centerpiece, 'cinematic' for text titles)
  const [screenMode, setScreenMode] = useState<'music' | 'cinematic'>('music');

  // Media Player states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false); // Music player starts unmuted by default
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Video & audio elements
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync background atmospheric wallpaper video (always loop, always silent)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Safe play background silent trigger
      });
    }
  }, []);

  // Sync primary audio soundtrack changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Set audio file URL
    audioRef.current.src = currentTrack.audioUrl;
    audioRef.current.load();
    
    // Resume playback if playing
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentTrack]);

  // Handle Playback State changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn('Audio play blocked by browser sandbox policy:', err);
        setIsPlaying(false);
        showNotification('请点击播放按钮以授权浏览器音频播放');
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Sync volume muted trigger
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Standard audio tracking handlers
  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioDurationChange = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    // Automatically skip to the next track on track-end
    handleNextTrack();
  };

  const handleScrub = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  // Skip buttons
  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    setCurrentTime(0);
    showNotification(`切换下一首: "${tracks[(currentTrackIndex + 1) % tracks.length]?.title || '未命名单曲'}"`);
  };

  const handlePrevTrack = () => {
    const nextIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(nextIdx);
    setCurrentTime(0);
    showNotification(`载入上一首: "${tracks[nextIdx]?.title || '未命名单曲'}"`);
  };

  // Import matched MP3 + LRC callback
  const handleImportTracks = (newTracks: Track[], statusMessage: string) => {
    // Prepend imported tracks so they load immediately at index 0
    setTracks((prevTracks) => [...newTracks, ...prevTracks]);
    setCurrentTime(0);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
    showNotification(statusMessage);
  };

  // Reset copy to the default content of the selected typography preset
  const handleResetToPresetDefault = () => {
    const defaults = DEFAULT_CONTENT_BY_THEME[typography];
    if (defaults) {
      setContent({ ...defaults });
      showNotification('台词剧本已重置为排版默认值');
    }
  };

  // Switch typography presets naturally
  const handleTypographyChange = (newPreset: TypographyTheme) => {
    setTypography(newPreset);
    const defaults = DEFAULT_CONTENT_BY_THEME[newPreset];
    if (defaults) {
      setContent({ ...defaults });
    }
  };

  const triggerCallToAction = () => {
    // Switch to music mode on call to action click!
    setScreenMode('music');
    setIsPlaying(true);
    showNotification(`进入播放器甲板：正在播放 "${currentTrack.title}"`);
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Helper formatting minutes:seconds
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentFrame = Math.floor(currentTime * 24);
  const activeTypographyPreset = TYPOGRAPHY_PRESETS[typography];
  const activeColorGradePreset = COLOR_GRADES[colorGrade];

  return (
    <div className={`relative w-screen h-screen bg-black overflow-hidden flex flex-col items-center justify-center select-none ${activeTypographyPreset.fontFamily}`}>
      
      {/* BACKGROUND LOOP VIDEO (Silent Cinematic Wallpaper Layer) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 transition-opacity duration-1000"
      >
        <source src="https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4" type="video/mp4" />
      </video>

      {/* HTML5 AUDIO MUSIC PLAYER HOST (Invisible Engine) */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleAudioTimeUpdate}
        onDurationChange={handleAudioDurationChange}
        onEnded={handleAudioEnded}
        preload="auto"
      />

      {/* CINEMATIC COLOR GRADE & VIGNETTE OVERLAYS */}
      <CinematicOverlay
        vignette={vignette}
        colorGrade={activeColorGradePreset}
        letterbox={letterbox}
      />

      {/* CINEMATIC FILM GRAIN NOISE EFFECT */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-40 animate-noise bg-[repeat]" 
        style={{ 
          backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E')` 
        }} 
      />

      {/* UNIFIED HEADER NAVIGATION BAR */}
      <nav className="absolute top-0 left-0 right-0 z-40 flex justify-between items-center px-4 py-4 md:px-12 md:py-6 select-none">
        
        {/* Dynamic Logo with pulse anchor */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md bg-white/5 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: activeColorGradePreset.accentColor }} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-white font-sans">
              以太声音实验室
            </span>
            <span className="text-[8px] font-mono tracking-widest text-white/30 uppercase">
              CINEMA SOUND LAB_03
            </span>
          </div>
        </div>

        {/* Dynamic Display Mode Buttons */}
        <div className="flex gap-2 sm:gap-4 items-center">
          
          {/* Switch Visual screen Mode */}
          <button
            onClick={() => {
              const nextMode = screenMode === 'music' ? 'cinematic' : 'music';
              setScreenMode(nextMode);
              showNotification(`切换视图：当前展示 ${nextMode === 'music' ? '滚屏歌词甲板' : '电影主幕介绍'}`);
            }}
            id="btn-toggle-screen-mode"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-[9px] font-mono tracking-wider uppercase font-semibold cursor-pointer transition-all"
            title="切换屏幕布局模式"
          >
            {screenMode === 'music' ? (
              <>
                <Tv className="w-3 h-3 text-[#14b8a6]" />
                <span>显示主幕字幕</span>
              </>
            ) : (
              <>
                <Music className="w-3 h-3 text-[#14b8a6]" />
                <span>显示歌词甲板</span>
              </>
            )}
          </button>

          {/* Quick cycle layout presets */}
          <button
            onClick={() => {
              const themesList: TypographyTheme[] = ['editorial', 'cyber', 'minimal'];
              const nextIndex = (themesList.indexOf(typography) + 1) % themesList.length;
              handleTypographyChange(themesList[nextIndex]);
              showNotification(`快切排版：当前激活 ${themesList[nextIndex].toUpperCase()}`);
            }}
            id="btn-quick-theme-nav"
            className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 bg-transparent text-white/60 hover:text-white text-[9px] font-mono uppercase tracking-widest transition-all cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-white/40 rotate-180" />
            <span>排版样式: {typography === 'editorial' ? '古典美学' : typography === 'cyber' ? '赛博视界' : '北欧极简'}</span>
          </button>

          {/* Director desk slider drawer toggle */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            id="btn-toggle-director-desk"
            className="px-4 py-1.5 border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full text-white text-[9px] tracking-[0.2em] font-semibold cursor-pointer active:scale-95 transition-all duration-200 shadow-sm"
          >
            {isPanelOpen ? '关闭调试台' : '导演调试台'}
          </button>
        </div>
      </nav>

      {/* CENTERPIECE WORKSPACE ELEMENT */}
      <div className="flex-1 w-full flex items-center justify-center z-20">
        <AnimatePresence mode="wait">
          {screenMode === 'music' ? (
            <motion.div
              key="lyrics-mode-card"
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -15 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
              className="w-full flex justify-center"
            >
              <MusicPlayerDeck
                currentTrack={currentTrack}
                currentTime={currentTime}
                duration={duration}
                isPlaying={isPlaying}
                onPlayPause={() => {
                  setIsPlaying(!isPlaying);
                  showNotification(isPlaying ? '音频轨道已静音暂停' : '电影感高保真音频引擎已激活');
                }}
                onSeek={handleScrub}
                onNext={handleNextTrack}
                onPrev={handlePrevTrack}
                playlist={tracks}
                onSelectTrack={(track) => {
                  const idx = tracks.findIndex(t => t.id === track.id);
                  if (idx !== -1) {
                    setCurrentTrackIndex(idx);
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }
                }}
                onImportTracks={handleImportTracks}
                accentColor={activeColorGradePreset.accentColor}
              />
            </motion.div>
          ) : (
            <motion.div
              key="billboard-mode"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
              className="w-full flex justify-center"
            >
              <HeroText
                preset={activeTypographyPreset}
                content={content}
                accentColor={activeColorGradePreset.accentColor}
                onCtaClick={triggerCallToAction}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM HARDWARE SPECS CONTROLLER DASHBOARD */}
      <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-12 md:right-12 z-30 max-w-7xl mx-auto w-[calc(100%-3rem)] md:w-[calc(100%-6rem)] grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-300">
        
        {/* Module 1: Status & Sound controls */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between h-[86px] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 group">
          <span className="text-[8px] tracking-[0.2em] uppercase text-white/40 block font-mono">
            音频通道连接 (Feed Connection)
          </span>
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-base font-light italic font-serif text-white">
                {isPlaying ? '暖声合成器输出中' : '声波引擎闲置中'}
              </span>
              <span className="text-[9px] text-white/30 uppercase tracking-widest font-mono mt-1 font-semibold">
                {formatTime(currentTime)} • {isPlaying ? '实时渲染 (RENDER)' : '以太休眠 (AETHER)'}
              </span>
            </div>
            {/* Control buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                id="timeline-btn-play-pause"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white flex items-center justify-center border border-white/15 cursor-pointer transition-all duration-150"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <div className="w-2 h-2 bg-white flex justify-between">
                    <div className="w-0.5 h-full bg-white rounded-sm" />
                    <div className="w-0.5 h-full bg-white rounded-sm" />
                  </div>
                ) : (
                  <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[7px] border-l-white translate-x-[1px]" />
                )}
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                id="timeline-btn-mute"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white flex items-center justify-center border border-white/15 cursor-pointer transition-all duration-150"
                aria-label={isMuted ? "Unmute sound" : "Mute sound"}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-sky-400 animate-pulse" style={{ color: activeColorGradePreset.accentColor }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Module 2: Synchronized Timeline Seeker slider */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between h-[86px] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300">
          <span className="text-[8px] tracking-[0.2em] uppercase text-white/40 block font-mono">
            歌学进度伺服 (Timeline Seeker)
          </span>
          <div className="flex flex-col gap-1 w-full">
            <div className="relative group py-1 flex items-center">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={(e) => handleScrub(parseFloat(e.target.value))}
                id="cinematic-timeline-seeker"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="relative w-full h-1 bg-white/15 rounded-full overflow-hidden transition-all group-hover:h-1.5 duration-150">
                <div 
                  className="h-full rounded-full transition-all duration-100"
                  style={{ 
                    width: `${(currentTime / (duration || 100)) * 100}%`,
                    backgroundColor: activeColorGradePreset.accentColor
                  }}
                />
              </div>
            </div>
            {/* Timing specifications & Current frame rate */}
            <div className="flex justify-between items-center text-[8px] font-mono text-white/40 tracking-widest leading-none mt-1">
              <span>渲染帧 FRM-{currentFrame.toString().padStart(5, '0')}</span>
              <span className="text-white/60 font-sans italic">{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Module 3: Active Production specifications */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-4 rounded-xl flex flex-col justify-between h-[86px] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:bg-white/[0.12] hover:border-white/30 transition-all duration-300">
          <span className="text-[8px] tracking-[0.2em] uppercase text-white/40 block font-mono">
            音学音宿规格 (Specs Monitor)
          </span>
          <div className="flex justify-between items-end">
            <div className="flex flex-col mr-2 overflow-hidden">
              <span 
                className="text-base font-light italic font-serif truncate transition-all duration-300"
                style={{ color: activeColorGradePreset.accentColor }}
              >
                {currentTrack.title.split(' ')[0]}
              </span>
              <span className="text-[9px] text-white/35 uppercase tracking-widest font-mono mt-0.5">
                {typography === 'editorial' ? '古典美学' : typography === 'cyber' ? '赛博视界' : '北欧极简'}逐字滚动
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  const themesList: TypographyTheme[] = ['editorial', 'cyber', 'minimal'];
                  const nextIndex = (themesList.indexOf(typography) + 1) % themesList.length;
                  handleTypographyChange(themesList[nextIndex]);
                }}
                id="timeline-btn-cycle-presets"
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 text-white cursor-pointer transition-all duration-150"
                title="快速切换排版格式"
              >
                <RefreshCw className="w-3.5 h-3.5 text-white/80" />
              </button>
              <button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                id="timeline-btn-desk"
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/35 text-white cursor-pointer transition-all duration-150"
                title="开启导演调试台"
              >
                <Sliders className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* NOTIFICATION LAYER */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-stone-900/90 border border-white/10 text-white flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-200">
              {notification}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTROL CABINET PANEL DRAWER */}
      <ControlPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        vignette={vignette}
        setVignette={setVignette}
        typography={typography}
        setTypography={handleTypographyChange}
        colorGrade={colorGrade}
        setColorGrade={setColorGrade}
        letterbox={letterbox}
        setLetterbox={setLetterbox}
        content={content}
        setContent={setContent}
        resetToPreset={handleResetToPresetDefault}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
    </div>
  );
}

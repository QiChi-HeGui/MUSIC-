import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, SkipForward, SkipBack, Music, ListMusic, 
  Upload, FileAudio, FileText, CheckCircle, Flame, Sparkles, AlertCircle, Info, Clock, ArrowRight 
} from 'lucide-react';
import { Track, LyricLine } from '../types';
import { parseLRC } from '../utils/lrcParser';

interface MusicPlayerDeckProps {
  currentTrack: Track;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (seconds: number) => void;
  onNext: () => void;
  onPrev: () => void;
  playlist: Track[];
  onSelectTrack: (track: Track) => void;
  onImportTracks: (tracks: Track[], message: string) => void;
  accentColor: string;
}

export default function MusicPlayerDeck({
  currentTrack,
  currentTime,
  duration,
  isPlaying,
  onPlayPause,
  onSeek,
  onNext,
  onPrev,
  playlist,
  onSelectTrack,
  onImportTracks,
  accentColor,
}: MusicPlayerDeckProps) {
  const [showPlaylistDrawer, setShowPlaylistDrawer] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [importStatus, setImportStatus] = useState<{ status: 'idle' | 'success' | 'error'; message: string }>({ status: 'idle', message: '' });

  // Refs for tracking active lyric lines & container positions
  const lyricContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLyricRef = useRef<HTMLDivElement | null>(null);

  // Parse and identify current lyric index
  const lyrics = currentTrack.parsedLyrics || [];
  let activeLyricIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeLyricIndex = i;
    } else {
      break;
    }
  }

  // Smooth scroll to active lyric line in container viewport center
  useEffect(() => {
    if (activeLyricRef.current && lyricContainerRef.current) {
      const container = lyricContainerRef.current;
      const activeElement = activeLyricRef.current;
      
      const containerHeight = container.clientHeight;
      const activeOffsetTop = activeElement.offsetTop;
      const activeHeight = activeElement.clientHeight;

      const targetScrollTop = activeOffsetTop - (containerHeight / 2) + (activeHeight / 2);
      
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });
    }
  }, [activeLyricIndex]);

  // Handle Multi-file or Folder Selection & Pairing
  const handleFileProcess = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setImportStatus({ status: 'idle', message: '正在分析并解析传入声轨与歌词文本...' });
    
    const audioFiles: File[] = [];
    const lrcFiles: File[] = [];

    // Filter into audio and lyric list
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'mp3' || ext === 'wav' || ext === 'ogg' || ext === 'm4a') {
        audioFiles.push(file);
      } else if (ext === 'lrc' || ext === 'txt') {
        lrcFiles.push(file);
      }
    }

    if (audioFiles.length === 0) {
      setImportStatus({
        status: 'error',
        message: '未在选择的路径下找到支持的音频文件（主推格式为 MP3, WAV, M4A）。'
      });
      return;
    }

    const matchedTracks: Track[] = [];

    // Map LRC files by name (lowercase without extension for robust matching)
    const lrcMap = new Map<string, File>();
    for (const lrcFile of lrcFiles) {
      const baseName = lrcFile.name.substring(0, lrcFile.name.lastIndexOf('.')).toLowerCase();
      lrcMap.set(baseName, lrcFile);
    }

    // Process audio files & look for matched LRC text dynamically
    for (const audioFile of audioFiles) {
      const audioBaseName = audioFile.name.substring(0, audioFile.name.lastIndexOf('.')).toLowerCase();
      const matchedLrcFile = lrcMap.get(audioBaseName);
      
      let lyricsText = '';
      if (matchedLrcFile) {
        lyricsText = await matchedLrcFile.text();
      } else {
        // Fallback placeholder timeline in case no LRC is found
        lyricsText = `[00:00.00] (正在播放声轨: ${audioFile.name})
[00:04.00] 纯音乐伴奏轨道 - 享受安神旋律中
[00:15.00] 该文件夹中未检测到同名且兼容的 .lrc 歌词提词器。
[00:30.00] 提示：下次导入可以在同一文件夹放入同名的 ${audioFile.name.substring(0, audioFile.name.lastIndexOf('.'))}.lrc 文件以实现逐字滚动高亮！
[01:00.00] 静享舒缓的声波流淌...
[01:30.00] (以太声音物理实验引擎)`;
      }

      const generatedAudioUrl = URL.createObjectURL(audioFile);
      const parsedLyrics = parseLRC(lyricsText);

      matchedTracks.push({
        id: `local-${Date.now()}-${audioBaseName}-${Math.random().toString(36).substr(2, 5)}`,
        title: audioFile.name.substring(0, audioFile.name.lastIndexOf('.')),
        artist: '本地加载声轨',
        album: '外部物理存档',
        audioUrl: generatedAudioUrl,
        lyricsText: lyricsText,
        parsedLyrics: parsedLyrics,
        coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop'
      });
    }

    onImportTracks(matchedTracks, `已成功同步并渲染 ${matchedTracks.length} 首载入单曲高保真波长！`);
    setImportStatus({
      status: 'success',
      message: `已导入 ${matchedTracks.length} 首外部声轨！其中成功配对 ${matchedTracks.filter(t => t.lyricsText && !t.lyricsText.includes('纯音乐伴奏轨道')).length} 份时序逐字歌词提词。`
    });

    // Auto switch to the first imported song
    if (matchedTracks.length > 0) {
      onSelectTrack(matchedTracks[0]);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileProcess(e.dataTransfer.files);
    }
  };

  return (
    <div className="relative z-20 w-full max-w-6xl px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[50vh] pt-24 pb-36">
      
      {/* LEFT COLUMN: VINYL ROTATOR & ALBUM SPECIFICATIONS (4 cols) */}
      <div className="lg:col-span-5 flex flex-col justify-between backdrop-blur-xl bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300">
        <div className="space-y-6">
          
          {/* Header Track Deck Title */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[9px] tracking-[0.25em] text-white/40 font-mono block uppercase">
                当前播放声卡 (Now Playing Deck)
              </span>
              <h2 className="text-2xl font-serif text-white font-light tracking-wide truncate max-w-[200px] md:max-w-[280px]">
                {currentTrack.title}
              </h2>
              <span className="text-xs text-white/50 block font-light">
                {currentTrack.artist} {currentTrack.album ? `• ${currentTrack.album}` : ''}
              </span>
            </div>

            {/* Playlists Button */}
            <button
              onClick={() => setShowPlaylistDrawer(!showPlaylistDrawer)}
              id="btn-playlist-drawer"
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer active:scale-90 transition-all"
              title="打开待播清单"
            >
              <ListMusic className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Rotating Vinyl Disk Record cover */}
          <div className="relative flex justify-center items-center py-6 group">
            {/* Ambient Background Glow behind Vinyl */}
            <div 
              className="absolute w-56 h-56 rounded-full blur-3xl opacity-30 transition-all duration-1000"
              style={{ backgroundColor: accentColor }}
            />

            {/* Simulated Tone-Arm needle */}
            <div 
              className="absolute top-0 right-1/4 w-12 h-20 transition-all duration-700 ease-in-out origin-top-right z-30 pointer-events-none"
              style={{
                transform: isPlaying ? 'rotate(15deg) translate(-10px, 10px)' : 'rotate(-10deg) translate(0px, 0px)',
              }}
            >
              <svg width="40" height="70" viewBox="0 0 40 70" fill="none">
                <path d="M5 5 C 5 5, 20 2, 28 20 L28 45 L32 50" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
                <rect x="26" y="45" width="6" height="12" rx="1" fill="rgba(255,255,255,0.9)" />
              </svg>
            </div>

            {/* Main Circle Vinyl with cover art inside */}
            <div className="relative w-56 h-56 rounded-full bg-stone-950 flex items-center justify-center p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] border border-white/5">
              
              {/* Outer Groovy Vinyl Ring */}
              <div 
                className={`absolute inset-1 rounded-full border border-stone-850 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.9)_100%)] ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}
                style={{
                  backgroundImage: 'repeating-radial-gradient(circle, #0e0e11, #0e0e11 2px, #1a1a22 3px, #0e0e11 4px)'
                }}
              />

              {/* Sub vinyl circles */}
              <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute inset-14 rounded-full border border-white/10 pointer-events-none" />

              {/* Central Custom Image Cover */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-black/80 z-10 flex-shrink-0">
                <img 
                  src={currentTrack.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop'} 
                  alt={currentTrack.title}
                  className={`w-full h-full object-cover select-none pointer-events-none ${isPlaying ? 'animate-[spin_12s_linear_infinite]' : ''}`}
                  referrerPolicy="no-referrer"
                />
                {/* Micro center hole */}
                <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-stone-950 border border-white/20" />
              </div>
            </div>
          </div>

          {/* Graphical Equalizer Waveform display */}
          <div className="flex justify-between items-end gap-1 h-12 px-2 pt-2 bg-black/10 rounded-xl border border-white/5">
            {Array.from({ length: 28 }).map((_, barIndex) => {
              // Create dynamic height modifiers based on index & music progress
              const randomFactor = Math.sin(barIndex * 0.9) * 0.4 + 0.6;
              const soundWaveHeight = isPlaying 
                ? `${Math.max(12, Math.floor((Math.sin(currentTime * 3 + barIndex * 0.5) * 50 + 50) * randomFactor))}%` 
                : '12%';

              return (
                <div
                  key={barIndex}
                  className="flex-1 rounded-sm transition-all duration-200"
                  style={{
                    height: soundWaveHeight,
                    backgroundColor: isPlaying ? accentColor : 'rgba(255, 255, 255, 0.15)',
                    opacity: isPlaying ? 0.82 : 0.4
                  }}
                />
              );
            })}
          </div>

        </div>

        {/* Playback Controls (Previous, Play, Next) inside the Left Deck Card */}
        <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-6">
          <button
            onClick={onPrev}
            id="deck-btn-prev"
            className="p-3 text-white/50 hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer bg-white/5 hover:bg-white/10 rounded-full"
            title="上一首"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={onPlayPause}
            id="deck-btn-play-pause"
            className="p-5 rounded-full text-black hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer transform duration-150"
            style={{ backgroundColor: accentColor }}
            title={isPlaying ? "暂停播放" : "开始播放"}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            id="deck-btn-next"
            className="p-3 text-white/50 hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer bg-white/5 hover:bg-white/10 rounded-full"
            title="下一首"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* RIGHT COLUMN: SCROLLING LRC LYRICS DECK OR IMPORT UTILITIES (7 cols) */}
      <div className="lg:col-span-7 flex flex-col backdrop-blur-xl bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-h-[460px] relative overflow-hidden">
        
        {/* Absolute dynamic glow gradient based on color grade */}
        <div 
          className="absolute -right-24 -top-24 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none transition-all duration-1000"
          style={{ backgroundColor: accentColor }}
        />

        {/* Central interactive navigation between lyrics and import desk */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4 select-none">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-white/60" />
            <h3 className="font-mono text-xs uppercase tracking-widest text-white/80 font-semibold">
              画幕逐字提词器 (LRC Scrolling)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
            {lyrics.length > 0 ? `${lyrics.length} 组时间戳` : '无时间戳歌词'}
          </span>
        </div>

        {/* The scrolling lyrics container viewport */}
        {lyrics.length > 0 ? (
          <div 
            ref={lyricContainerRef}
            className="flex-1 overflow-y-auto px-2 space-y-6 md:space-y-8 pr-4 my-4 max-h-[380px] scroll-smooth vertical-lyric-scroller relative scrollbar-thin scrollbar-track-transparent ScrollContain cursor-ns-resize"
          >
            {/* Fade Out Edge masks */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-stone-950/80 pointer-events-none z-10" />
            
            {lyrics.map((line, index) => {
              const isActive = index === activeLyricIndex;
              const isPassed = index < activeLyricIndex;
              
              return (
                <div
                  key={index}
                  ref={isActive ? activeLyricRef : null}
                  onClick={() => onSeek(line.time)}
                  className={`text-center py-2 px-4 rounded-xl transition-all duration-500 cursor-pointer text-base md:text-xl lg:text-2xl font-serif text-slate-100 ${
                    isActive 
                      ? 'font-medium scale-102 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] opacity-100' 
                      : isPassed 
                        ? 'opacity-35 font-light scale-98 hover:opacity-75' 
                        : 'opacity-55 font-light scale-98 hover:opacity-85'
                  }`}
                  style={{
                    color: isActive ? accentColor : '',
                    textShadow: isActive ? `0 0 16px ${accentColor}30` : ''
                  }}
                >
                  {line.text || '•••'}
                </div>
              );
            })}
            
            <div className="h-28" /> {/* Cushion at bottom so the final lyric line centers correctly */}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-white/40 space-y-3">
            <Info className="w-8 h-8 opacity-40 animate-pulse" />
            <p className="text-sm font-light">歌词加载中、内容为空或当前无法读取。</p>
            <p className="text-xs text-white/30 font-mono">请选择预设单曲，或者选择并拖入 MP3 文件夹与 LRC 文件进行快速实时声轨解析。</p>
          </div>
        )}

        {/* FOLDER SYNCH_DECK / DIRECTORY IMPORT PANEL at the bottom of Right Card */}
        <div className="mt-auto border-t border-white/5 pt-4">
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 ${
              isDragging 
                ? 'bg-white/10 border-dashed border-white/50 scale-[0.99] shadow-inner' 
                : 'bg-white/[0.01] hover:bg-white/[0.03] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white shrink-0">
                <Upload className="w-5 h-5 text-white/80" />
              </div>
              <div className="space-y-0.5 text-left">
                <span className="text-xs font-mono font-bold text-white block flex items-center gap-1.5">
                  加载本地音乐及歌词目录 (MP3/LRC) <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </span>
                <span className="text-[10px] text-white/40 block leading-tight max-w-[320px]">
                  可以拖放文件夹，或批量选择 <b>.mp3</b> 与 <b>.lrc</b> 传入，播放器将按照相同的主文件名自动匹配。
                </span>
              </div>
            </div>

            {/* Custom browser select files click fields */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
              {/* Folder Selector Input */}
              <label 
                className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono tracking-wider uppercase font-semibold cursor-pointer border border-white/10 transition-colors flex items-center gap-1.5 active:scale-95 text-center justify-center flex-1 md:flex-initial"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>选择歌词文件夹</span>
                <input
                  type="file"
                  multiple
                  webkitdirectory=""
                  directory=""
                  onChange={(e) => handleFileProcess(e.target.files)}
                  className="hidden"
                />
              </label>

              {/* Standard Multiple Files Input */}
              <label 
                className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[10px] font-mono tracking-wider uppercase font-semibold cursor-pointer border border-white/5 transition-colors flex items-center gap-1.5 active:scale-95 text-center justify-center flex-1 md:flex-initial"
              >
                <ListMusic className="w-3.5 h-3.5" />
                <span>批量选择文件</span>
                <input
                  type="file"
                  multiple
                  accept=".mp3,.wav,.ogg,.m4a,.lrc,.txt"
                  onChange={(e) => handleFileProcess(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Micro telemetry indicator of upload status */}
          <AnimatePresence>
            {importStatus.message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`text-[9px] mt-2 font-mono flex items-center gap-1.5 p-2 rounded-lg ${
                  importStatus.status === 'success' 
                    ? 'text-emerald-400 bg-emerald-950/20' 
                    : importStatus.status === 'error'
                      ? 'text-rose-400 bg-rose-955/20'
                      : 'text-stone-300 bg-white/5'
                }`}
              >
                {importStatus.status === 'success' ? (
                  <CheckCircle className="w-3 h-3 text-emerald-450 shrink-0" />
                ) : importStatus.status === 'error' ? (
                  <AlertCircle className="w-3 h-3 text-rose-455 shrink-0" />
                ) : (
                  <Info className="w-3 h-3 text-stone-400 shrink-0 animate-spin" />
                )}
                <span className="truncate">{importStatus.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* FLOATING PLAYLIST DRAWER COMPONENT */}
      <AnimatePresence>
        {showPlaylistDrawer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
            className="absolute inset-x-4 top-24 bottom-32 bg-stone-950/90 backdrop-blur-3xl border border-white/10 z-40 p-6 rounded-3xl flex flex-col shadow-3xl text-left"
          >
            {/* Header drawer panel */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-white/70" />
                <h4 className="text-sm font-mono uppercase tracking-widest text-white font-medium">
                  当前播放会话列表 (Active Playback Queue)
                </h4>
              </div>
              <button
                onClick={() => setShowPlaylistDrawer(false)}
                id="btn-close-playlist"
                className="text-[10px] font-mono tracking-[0.15em] text-white/50 hover:text-white uppercase transition-colors p-1"
              >
                关闭列表 [X]
              </button>
            </div>

            {/* Scrollable song tracks */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin">
              {playlist.map((track, trackIndex) => {
                const isSelected = track.id === currentTrack.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => {
                      onSelectTrack(track);
                      setShowPlaylistDrawer(false);
                    }}
                    id={`track-select-${track.id}`}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 border-white/20 shadow-md'
                        : 'border-transparent hover:border-white/5 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Visual active level indicator */}
                      {isSelected && isPlaying ? (
                        <div className="w-5 h-5 flex items-center justify-center text-white">
                          <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-white/30 w-5 text-center">
                          {(trackIndex + 1).toString().padStart(2, '0')}
                        </span>
                      )}

                      {/* Small circular record banner */}
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                        <img 
                          src={track.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop'} 
                          alt="" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="truncate pr-4 text-left">
                        <p className={`text-xs font-mono font-medium truncate ${isSelected ? 'text-white' : 'text-stone-300 group-hover:text-white'}`}>
                          {track.title}
                        </p>
                        <p className="text-[10px] text-white/40 font-sans truncate font-light mt-0.5">
                          {track.artist} {track.album ? `• ${track.album}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {track.id.startsWith('local-') && (
                        <span className="text-[8px] bg-white/10 text-white/50 px-1.5 py-0.5 rounded uppercase font-mono tracking-wider">
                          本地离线音符
                        </span>
                      )}
                      {isSelected ? (
                        <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-semibold animation-pulse">
                          播放中 (PLAYING)
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono opacity-0 group-hover:opacity-100 text-white/40 uppercase tracking-widest flex items-center gap-1">
                          点击播放 <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Hint overlay */}
            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-white/30 font-mono text-center">
              温馨提示：你可以随时批量选择或拖入多个 MP3 与 LRC 文件组合对，丰富该播放器声海！
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

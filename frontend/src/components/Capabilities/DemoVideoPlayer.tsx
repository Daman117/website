import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface DemoVideoPlayerProps {
  src: string;
  poster?: string;
  accent: string;
  accentRgb: string;
}

const fmt = (s: number) => {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, '0')}`;
};

// Custom always-visible progress bar — native <video controls> auto-hide their
// scrub bar after a couple seconds of no mouse movement, which makes seeking
// feel broken if you pause to aim your click. This bar never hides.
const DemoVideoPlayer: React.FC<DemoVideoPlayerProps> = ({ src, poster, accent, accentRgb }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragging, setDragging] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play(); else v.pause();
  };

  const seekToClientX = useCallback((clientX: number) => {
    const v = videoRef.current;
    const bar = barRef.current;
    if (!v || !bar || !v.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    v.currentTime = ratio * v.duration;
    setCurrent(ratio * v.duration);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => seekToClientX(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, seekToClientX]);

  useEffect(() => {
    const onFsChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', height: 480, borderRadius: 16, overflow: 'hidden', background: '#000' }}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted={muted}
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => { if (!dragging) setCurrent(e.currentTarget.currentTime); }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
      />

      {/* Always-visible control bar */}
      <div
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(4,6,18,0.82) 60%, rgba(4,6,18,0.92) 100%)',
          padding: '20px 16px 12px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}
      >
        {/* Progress bar — large hit area, click or drag anywhere to seek */}
        <div
          ref={barRef}
          onMouseDown={(e) => { setDragging(true); seekToClientX(e.clientX); }}
          style={{ position: 'relative', width: '100%', height: 14, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <div style={{ position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }} />
          <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 4, borderRadius: 2, background: accent }} />
          <div
            style={{
              position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)',
              width: 13, height: 13, borderRadius: '50%', background: accent,
              boxShadow: `0 0 0 3px rgba(${accentRgb},0.25)`,
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} style={{ all: 'unset', cursor: 'pointer', display: 'flex' }}>
            {playing ? <Pause size={18} color="#fff" fill="#fff" /> : <Play size={18} color="#fff" fill="#fff" />}
          </button>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontVariantNumeric: 'tabular-nums' }}>
            {fmt(current)} / {fmt(duration)}
          </span>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => { const v = videoRef.current; if (v) { v.muted = !v.muted; setMuted(v.muted); } }}
            aria-label={muted ? 'Unmute' : 'Mute'}
            style={{ all: 'unset', cursor: 'pointer', display: 'flex' }}
          >
            {muted ? <VolumeX size={17} color="#fff" /> : <Volume2 size={17} color="#fff" />}
          </button>
          <button
            onClick={() => {
              if (!document.fullscreenElement) wrapRef.current?.requestFullscreen();
              else document.exitFullscreen();
            }}
            aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            style={{ all: 'unset', cursor: 'pointer', display: 'flex' }}
          >
            {fullscreen ? <Minimize size={17} color="#fff" /> : <Maximize size={17} color="#fff" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoVideoPlayer;

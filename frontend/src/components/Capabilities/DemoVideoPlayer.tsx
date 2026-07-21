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

  const seekBy = useCallback((deltaSeconds: number) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const next = Math.min(v.duration, Math.max(0, v.currentTime + deltaSeconds));
    v.currentTime = next;
    setCurrent(next);
  }, []);

  const onProgressKeyDown = (e: React.KeyboardEvent) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    switch (e.key) {
      case 'ArrowLeft': e.preventDefault(); seekBy(-5); break;
      case 'ArrowRight': e.preventDefault(); seekBy(5); break;
      case 'Home': e.preventDefault(); v.currentTime = 0; setCurrent(0); break;
      case 'End': e.preventDefault(); v.currentTime = v.duration; setCurrent(v.duration); break;
    }
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => seekToClientX(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
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
    <div ref={wrapRef} className="video-wrapper">
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
        className="video-player u-w-full u-h-full u-block"
      />

      {/* Always-visible control bar */}
      <div className="video-overlay u-flex-column u-gap-8">
        {/* Progress bar — large hit area, click or drag anywhere to seek */}
        <div
          ref={barRef}
          onMouseDown={(e) => { setDragging(true); seekToClientX(e.clientX); }}
          onKeyDown={onProgressKeyDown}
          tabIndex={0}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={current}
          aria-valuetext={`${fmt(current)} of ${fmt(duration)}`}
          className="video-progress u-w-full u-flex u-items-center"
          style={{ '--pct': `${pct}%`, '--accent': accent, '--accent-rgb': accentRgb } as React.CSSProperties}
        >
          <div className="video-progress-track" />
          <div className="video-progress-fill" />
          <div className="video-progress-thumb" />
        </div>

        <div className="video-controls u-flex u-items-center">
          <button onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} className="video-button u-flex">
            {playing ? <Pause size={18} color="#fff" fill="#fff" /> : <Play size={18} color="#fff" fill="#fff" />}
          </button>
          <span className="video-time u-text-sm">
            {fmt(current)} / {fmt(duration)}
          </span>
          <div className="video-spacer" />
          <button
            onClick={() => { const v = videoRef.current; if (v) { v.muted = !v.muted; setMuted(v.muted); } }}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="video-button u-flex"
          >
            {muted ? <VolumeX size={17} color="#fff" /> : <Volume2 size={17} color="#fff" />}
          </button>
          <button
            onClick={() => {
              if (!document.fullscreenElement) wrapRef.current?.requestFullscreen();
              else document.exitFullscreen();
            }}
            aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            className="video-button u-flex"
          >
            {fullscreen ? <Minimize size={17} color="#fff" /> : <Maximize size={17} color="#fff" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoVideoPlayer;

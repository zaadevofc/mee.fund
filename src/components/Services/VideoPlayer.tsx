import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SystemContext } from '~/app/providers';

type VideoPlayerType = {
  id: string;
  src: string;
  mimetype: string;
  autoPlay?: boolean;
};

const VideoPlayer: React.FC<VideoPlayerType> = ({ id, src, mimetype, autoPlay = true }) => {
  const { activeVideoId, setActiveVideo } = useContext(SystemContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isActive = id === activeVideoId;

  const playVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setActiveVideo!(id);
          setIsMuted(false);
          videoRef.current!.muted = false;
        })
        .catch(error => {
          console.error('Playback failed:', error);
          setIsPlaying(false);
          setIsMuted(true);
        });
    }
  }, [id, setActiveVideo]);

  const pauseVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (autoPlay) {
            setActiveVideo!(id);
          }
        } else {
          if (isActive) {
            setActiveVideo!(null);
          }
        }
      },
      { threshold: 0.9 }
    );

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, [id, autoPlay, isActive, setActiveVideo]);

  useEffect(() => {
    if (isActive) {
      playVideo();
    } else {
      pauseVideo();
    }
  }, [isActive, playVideo, pauseVideo]);

  const togglePlay = () => {
    if (isPlaying) {
      pauseVideo();
    } else {
      setActiveVideo!(id);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <video
        ref={videoRef}
        className="h-full w-full cursor-pointer"
        onClick={togglePlay}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
        muted={isMuted}
      >
        <source src={src} type={mimetype} />
        Browser anda tidak mendukung video tag.
      </video>
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <button onClick={togglePlay} className="rounded-full bg-white/50 bg-clip-text px-4 py-3 text-black text-transparent backdrop-blur-lg">
            ▶
          </button>
        </div>
      )}
      {isPlaying && (
        <>
          {isMuted ? (
            <button onClick={toggleMute} className="absolute bottom-3 right-3 rounded-full bg-white/50 p-1 text-black backdrop-blur-lg">
              🔇
            </button>
          ) : (
            <button onClick={toggleMute} className="absolute bottom-3 right-3 rounded-full bg-white/50 p-1 text-black backdrop-blur-lg">
              🔊
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default VideoPlayer;

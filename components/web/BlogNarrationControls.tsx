"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  StepBack,
  StepForward,
  Volume2,
  VolumeX,
  X,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export interface Chapter {
  title: string;
  startTime: number;
}

interface BlogNarrationControlsProps {
  audioUrl?: string;
  title?: string;
  chapters?: Chapter[];
  autoPlay?: boolean;
  onClose?: () => void;
}

export function BlogNarrationControls({
  audioUrl,
  title = "Listen to article",
  chapters = [],
  autoPlay = false,
  onClose,
}: BlogNarrationControlsProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const currentChapter = useMemo(() => {
    if (!chapters.length) return null;
    return (
      [...chapters]
        .reverse()
        .find((chapter) => currentTime >= chapter.startTime) || chapters[0]
    );
  }, [currentTime, chapters]);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [autoPlay]);

  if (!audioUrl) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSliderChange = (value: number[]) => {
    const time = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipSeconds = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.min(
        Math.max(audioRef.current.currentTime + seconds, 0),
        duration
      );
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-2xl border border-zinc-200/80 bg-white/90 p-3.5 shadow-2xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex items-center gap-3.5">
        <Button
          onClick={togglePlay}
          size="icon"
          variant="default"
          className="h-9 w-9 shrink-0 rounded-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          )}
        </Button>

        <div className="flex flex-1 flex-col justify-center gap-1.5 min-w-0">
          <div className="flex items-center justify-between text-xs font-medium tracking-tight text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {title}
              </span>

              {currentChapter && (
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 truncate max-w-[160px]">
                  <Bookmark className="h-2.5 w-2.5 shrink-0 text-zinc-400" />
                  <span className="truncate">{currentChapter.title}</span>
                </span>
              )}
            </div>

            <span className="font-mono text-[11px] tabular-nums shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="relative flex items-center">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSliderChange}
              className="cursor-pointer relative z-10"
            />

            {duration > 0 &&
              chapters.map((chapter, index) => {
                if (chapter.startTime <= 0) return null;
                const percentage = (chapter.startTime / duration) * 100;
                return (
                  <div
                    key={index}
                    className="absolute top-1/2 -translate-y-1/2 h-2.5 w-0.5 bg-white dark:bg-zinc-950 z-20 pointer-events-none rounded-full"
                    style={{ left: `${percentage}%` }}
                    title={`Chapter: ${chapter.title}`}
                  />
                );
              })}
          </div>
        </div>

        <div className="flex items-center gap-0.5 border-l border-zinc-200/80 pl-2 dark:border-zinc-800/80">
          <Button
            onClick={restartAudio}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            title="Reset to start"
            aria-label="Reset narration to start"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          <Button
            onClick={() => skipSeconds(-15)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            title="Skip back 15s"
            aria-label="Skip back 15 seconds"
          >
            <StepBack className="h-3.5 w-3.5" />
          </Button>

          <Button
            onClick={() => skipSeconds(15)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            title="Skip forward 15s"
            aria-label="Skip forward 15 seconds"
          >
            <StepForward className="h-3.5 w-3.5" />
          </Button>

          <Button
            onClick={toggleMute}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            title={isMuted ? "Unmute" : "Mute"}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
          </Button>

          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              title="Close player"
              aria-label="Close narration player"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
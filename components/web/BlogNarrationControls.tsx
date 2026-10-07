"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  StepBack,
  StepForward,
  Volume2,
  VolumeX,
  X,
  List,
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

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

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

  const chapterMarks = useMemo(
    () => chapters.map((c) => c.startTime),
    [chapters]
  );

  const currentChapter = useMemo(() => {
    if (!chapters.length) return null;
    return (
      [...chapters]
        .reverse()
        .find((chapter) => currentTime >= chapter.startTime) || chapters[0]
    );
  }, [currentTime, chapters]);

  const handleChapterClick = (chapterTitle: string) => {
    const cleanId = slugify(chapterTitle);

    const element = document.getElementById(cleanId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    window.history.pushState(null, "", `#${cleanId}`);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const renderTooltipContent = useCallback(
    (hoverVal: number) => {
      const chapter =
        [...chapters]
          .reverse()
          .find((c) => hoverVal >= c.startTime) || chapters[0];

      return (
        <div className="flex flex-col items-center gap-0.5">
          {chapter && (
            <span className="text-[10px] font-medium text-zinc-300 dark:text-zinc-700 max-w-[160px] truncate">
              {chapter.title}
            </span>
          )}
          <span className="font-mono text-[11px] font-bold tabular-nums">
            {formatTime(hoverVal)}
          </span>
        </div>
      );
    },
    [chapters]
  );

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

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
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
          className="cursor-pointer h-9 w-9 shrink-0 rounded-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          )}
        </Button>

        <div className="flex flex-1 flex-col justify-center gap-1.5 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                {title}
              </span>

              {currentChapter && (
                <button
                  type="button"
                  onClick={() => handleChapterClick(currentChapter.title)}
                  className="group inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-600 transition-colors text-left"
                >
                  <List className="h-3 w-3 shrink-0 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-600 transition-colors" />
                  <span className="truncate">{currentChapter.title}</span>
                </button>
              )}
            </div>

            <span className="font-mono text-[11px] tabular-nums shrink-0 text-zinc-500 dark:text-zinc-400 pt-0.5">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            marks={chapterMarks}
            showTooltipArrow={false}
            showTooltip
            getTooltipContent={renderTooltipContent}
            onValueChange={handleSliderChange}
            className="cursor-pointer relative w-full"
          />
        </div>

        <div className="flex items-center gap-0.5 border-l border-zinc-200/80 pl-2 dark:border-zinc-800/80">
          <Button
            onClick={restartAudio}
            variant="ghost"
            size="icon"
            className="cursor-pointer h-8 w-8 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            title="Reset to start"
            aria-label="Reset narration to start"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          <Button
            onClick={() => skipSeconds(-15)}
            variant="ghost"
            size="icon"
            className="cursor-pointer h-8 w-8 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            title="Skip back 15s"
            aria-label="Skip back 15 seconds"
          >
            <StepBack className="h-3.5 w-3.5" />
          </Button>

          <Button
            onClick={() => skipSeconds(15)}
            variant="ghost"
            size="icon"
            className="cursor-pointer h-8 w-8 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            title="Skip forward 15s"
            aria-label="Skip forward 15 seconds"
          >
            <StepForward className="h-3.5 w-3.5" />
          </Button>

          <Button
            onClick={toggleMute}
            variant="ghost"
            size="icon"
            className="cursor-pointer h-8 w-8 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
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
              className="cursor-pointer h-8 w-8 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
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
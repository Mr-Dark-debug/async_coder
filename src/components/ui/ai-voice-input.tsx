"use client";

import { Mic } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { cn } from "@/lib/utils";

interface AIVoiceInputProps {
  onStart?: () => void;
  onStop?: (duration: number, recording?: Blob | null) => void;
  onError?: (error: Error) => void;
  visualizerBars?: number;
  demoMode?: boolean;
  demoInterval?: number;
  className?: string;
}

export interface AIVoiceInputHandle {
  stopRecording: (options?: { discard?: boolean }) => void;
  isRecording: () => boolean;
}

const SUPPORTED_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
  "audio/mp4"
];

function pickSupportedMimeType(): string | undefined {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined") {
    return undefined;
  }

  return SUPPORTED_MIME_TYPES.find((type) =>
    MediaRecorder.isTypeSupported(type)
  );
}

export const AIVoiceInput = forwardRef<AIVoiceInputHandle, AIVoiceInputProps>(
  function AIVoiceInputComponent(
    {
      onStart,
      onStop,
      onError,
      visualizerBars = 48,
      demoMode = false,
      demoInterval = 3000,
      className
    },
    ref
  ) {
    const [submitted, setSubmitted] = useState(false);
    const [time, setTime] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [isDemo, setIsDemo] = useState(demoMode);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const durationRef = useRef(0);
    const discardRef = useRef(false);
    const mimeTypeRef = useRef<string | undefined>(undefined);
    const isStartingRef = useRef(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      setIsDemo(demoMode);
    }, [demoMode]);

    const stopTimer = useCallback(() => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      startTimeRef.current = null;
    }, []);

    const updateTimer = useCallback(() => {
      if (startTimeRef.current == null) {
        return;
      }

      const elapsed = Math.floor(
        (performance.now() - startTimeRef.current) / 1000
      );

      if (elapsed !== durationRef.current) {
        durationRef.current = elapsed;
        setTime(elapsed);
      }
    }, []);

    const startTimer = useCallback(() => {
      stopTimer();
      startTimeRef.current = performance.now();
      durationRef.current = 0;
      setTime(0);
      timerRef.current = setInterval(updateTimer, 200);
    }, [stopTimer, updateTimer]);

    const cleanupStream = useCallback(() => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      mediaRecorderRef.current = null;
    }, []);

    const finalizeStop = useCallback(
      (blob: Blob | null) => {
        const startTime = startTimeRef.current;
        const trackedDuration = durationRef.current;

        stopTimer();

        const shouldDiscard = discardRef.current;
        discardRef.current = false;

        durationRef.current = 0;
        startTimeRef.current = null;

        setSubmitted(false);
        setTime(0);

        if (!shouldDiscard) {
          const preciseDuration =
            startTime != null
              ? Math.max(
                  trackedDuration,
                  Math.round((performance.now() - startTime) / 1000)
                )
              : trackedDuration;

          onStop?.(preciseDuration, blob);
        }
      },
      [onStop, stopTimer]
    );

    const stopRecording = useCallback(
      (options?: { discard?: boolean }) => {
        if (options?.discard) {
          discardRef.current = true;
        }

        const recorder = mediaRecorderRef.current;
        if (recorder && recorder.state !== "inactive") {
          try {
            recorder.stop();
            return;
          } catch {
            cleanupStream();
          }
        } else {
          cleanupStream();
        }

        finalizeStop(null);
      },
      [cleanupStream, finalizeStop]
    );

    const startRecording = useCallback(async () => {
      if (submitted || isStartingRef.current) {
        return;
      }

      if (
        typeof window === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        const error = new Error(
          "Audio recording is not supported in this browser."
        );
        onError?.(error);
        return;
      }

      isStartingRef.current = true;

      try {
        discardRef.current = false;
        setIsDemo(false);

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
        streamRef.current = stream;

        const mimeType = pickSupportedMimeType();
        mimeTypeRef.current = mimeType;

        const recorder = mimeType
          ? new MediaRecorder(stream, { mimeType })
          : new MediaRecorder(stream);

        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstart = () => {
          startTimer();
          setSubmitted(true);
          onStart?.();
        };

        recorder.onstop = () => {
          const chunks = audioChunksRef.current.slice();
          audioChunksRef.current = [];
          cleanupStream();

          const mime =
            mimeTypeRef.current ??
            (chunks[0] ? chunks[0].type : undefined) ??
            "audio/webm";

          const blob =
            !discardRef.current && chunks.length > 0
              ? new Blob(chunks, { type: mime })
              : null;

          finalizeStop(blob);
        };

        recorder.onerror = (event) => {
          const error =
            event instanceof ErrorEvent && event.error
              ? event.error
              : new Error(
                  "An unexpected error occurred while recording audio."
                );

          discardRef.current = true;
          onError?.(error);

          try {
            recorder.stop();
          } catch {
            cleanupStream();
            finalizeStop(null);
          }
        };

        recorder.start();
      } catch (err) {
        cleanupStream();
        discardRef.current = true;

        const error =
          err instanceof Error
            ? err
            : new Error(
                "Unable to access the microphone. Check permissions and try again."
              );

        onError?.(error);
        setSubmitted(false);
      } finally {
        isStartingRef.current = false;
      }
    }, [
      submitted,
      onStart,
      onError,
      startTimer,
      cleanupStream,
      finalizeStop
    ]);

    useImperativeHandle(
      ref,
      () => ({
        stopRecording: (options?: { discard?: boolean }) =>
          stopRecording(options),
        isRecording: () => submitted
      }),
      [stopRecording, submitted]
    );

    useEffect(() => {
      if (!isDemo) {
        return;
      }

      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      const runAnimation = () => {
        setSubmitted(true);
        timeoutId = setTimeout(() => {
          setSubmitted(false);
          timeoutId = setTimeout(runAnimation, 1000);
        }, demoInterval);
      };

      const initialTimeout = setTimeout(runAnimation, 100);

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        clearTimeout(initialTimeout);
      };
    }, [isDemo, demoInterval]);

    useEffect(() => {
      return () => {
        discardRef.current = true;
        stopRecording({ discard: true });
      };
    }, [stopRecording]);

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    };

    const handleClick = () => {
      if (isDemo) {
        setIsDemo(false);
        setSubmitted(false);
        return;
      }

      if (submitted) {
        stopRecording();
      } else {
        void startRecording();
      }
    };

    return (
      <div className={cn("w-full py-4", className)}>
        <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
          <button
            className={cn(
              "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
              submitted
                ? "bg-none"
                : "bg-none hover:bg-black/10 dark:hover:bg-white/10"
            )}
            type="button"
            onClick={handleClick}
          >
            {submitted ? (
              <div
                className="w-6 h-6 rounded-sm animate-spin bg-black dark:bg-white cursor-pointer pointer-events-auto"
                style={{ animationDuration: "3s" }}
              />
            ) : (
              <Mic className="w-6 h-6 text-black/70 dark:text-white/70" />
            )}
          </button>

          <span
            className={cn(
              "font-mono text-sm transition-opacity duration-300",
              submitted
                ? "text-black/70 dark:text-white/70"
                : "text-black/30 dark:text-white/30"
            )}
          >
            {formatTime(time)}
          </span>

          <div className="h-4 w-64 flex items-center justify-center gap-0.5">
            {[...Array(visualizerBars)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-0.5 rounded-full transition-all duration-300",
                  submitted
                    ? "bg-black/50 dark:bg-white/50 animate-pulse"
                    : "bg-black/10 dark:bg-white/10 h-1"
                )}
                style={
                  submitted && isClient
                    ? {
                        height: `${20 + Math.random() * 80}%`,
                        animationDelay: `${i * 0.05}s`
                      }
                    : undefined
                }
              />
            ))}
          </div>

          <p className="h-4 text-xs text-black/70 dark:text-white/70">
            {submitted ? "Listening..." : "Click to speak"}
          </p>
        </div>
      </div>
    );
  }
);

AIVoiceInput.displayName = "AIVoiceInput";

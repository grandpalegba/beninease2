'use client';

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react";

const MAX_DURATION = 60; // seconds

interface Props {
  onSaved?: (blob: Blob, durationSec: number) => void;
}

const AudioRecorder = ({ onSaved }: Props) => {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const intervalRef = useRef<number | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onSaved?.(blob, elapsed);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);
      setElapsed(0);
      intervalRef.current = window.setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= MAX_DURATION) {
            stopRecording();
          }
          return next;
        });
      }, 1000);
    } catch (e) {
      setError("Microphone inaccessible. Vérifie les autorisations du navigateur.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRecording(false);
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setElapsed(0);
    setPlaying(false);
  };

  const togglePlay = () => {
    if (!audioElRef.current) return;
    if (playing) {
      audioElRef.current.pause();
      setPlaying(false);
    } else {
      audioElRef.current.play();
      setPlaying(true);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = (elapsed / MAX_DURATION) * 100;

  return (
    <div
      className="font-body rounded-xl p-6"
      style={{
        background: "#ffffff",
        boxShadow: "inset 0 0 0 1px rgba(232, 17, 45, 0.35)",
      }}
    >
      <div className="flex items-start justify-between mb-3 gap-3">
        <div>
          <p
            className="font-label text-xs uppercase tracking-[0.2em] font-bold"
            style={{ color: "#e8112d" }}
          >
            Enregistre ta réponse
          </p>
          <p className="text-sm mt-1" style={{ color: "#5a5c5c" }}>
            1 minute maximum — pose ta voix sur ce cas.
          </p>
        </div>
        <span
          className="font-mono tabular-nums text-xs px-2.5 py-1 rounded-md whitespace-nowrap"
          style={{
            background: recording ? "#e8112d" : "#f0f1f1",
            color: recording ? "#ffffff" : "#2d2f2f",
          }}
        >
          {formatTime(elapsed)} / 1:00
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-1 rounded-full overflow-hidden mb-5"
        style={{ background: "#f0f1f1" }}
      >
        <motion.div
          className="h-full"
          style={{ background: "#e8112d" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {!audioUrl && !recording && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold transition-all hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: "#1a1a1a", color: "#ffffff" }}
          >
            <Mic size={16} /> Enregistrer mon interprétation
          </button>
        )}
        {recording && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold transition-all"
            style={{ background: "#2d2f2f", color: "#ffffff" }}
          >
            <Square size={14} /> Arrêter
          </button>
        )}
        {audioUrl && !recording && (
          <>
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold text-white transition-all hover:scale-[1.03]"
              style={{
                background: "linear-gradient(90deg, #00693e 0%, #005c36 100%)",
              }}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
              {playing ? "Pause" : "Écouter"}
            </button>
            <button
              onClick={resetRecording}
              className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-bold transition-all"
              style={{
                background: "#f0f1f1",
                color: "#e8112d",
              }}
            >
              <Trash2 size={14} /> Recommencer
            </button>
            <audio
              ref={audioElRef}
              src={audioUrl}
              onEnded={() => setPlaying(false)}
              className="hidden"
            />
          </>
        )}
      </div>

      {error && (
        <p className="mt-3 text-xs" style={{ color: "#e8112d" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default AudioRecorder;

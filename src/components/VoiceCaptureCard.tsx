"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, Loader2, CheckCircle2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VoiceCaptureCardProps {
  /** Called whenever the transcript changes (live + final). */
  onTranscriptChange: (text: string) => void;
  /** Called when the user submits the transcript (clicks Parse button). */
  onSubmit: (text: string) => void;
  /** Indicates if the AI is currently processing the transcript. */
  isParsing?: boolean;
}

type ListenState = "idle" | "listening" | "unsupported";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Safely access the browser SpeechRecognition constructor (Chrome / Edge). */
function getSpeechRecognition(): any {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VoiceCaptureCard({
  onTranscriptChange,
  onSubmit,
  isParsing = false
}: VoiceCaptureCardProps) {
  // Initialise state lazily so we only call getSpeechRecognition() once, on
  // the client, without needing a side-effect to update it afterwards.
  const [listenState, setListenState] = useState<ListenState>(() => {
    if (typeof window === "undefined") return "idle"; // SSR guard
    return getSpeechRecognition() ? "idle" : "unsupported";
  });
  const [transcript, setTranscript] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Keep parent in sync whenever transcript changes
  useEffect(() => {
    onTranscriptChange(transcript);
  }, [transcript, onTranscriptChange]);

  const startListening = useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-IN"; // good for Indian English + Rupee-style amounts
    recognition.interimResults = true; // show live partial transcript
    recognition.maxAlternatives = 1;
    recognition.continuous = false; // auto stops after a pause

    recognition.onstart = () => setListenState("listening");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      // Collect all results into one string
      let full = "";
      for (let i = 0; i < event.results.length; i++) {
        full += event.results[i][0].transcript;
      }
      setTranscript(full);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      // "no-speech" is a common non-critical event; log others
      if (event.error !== "no-speech") {
        console.error("Speech recognition error:", event.error);
      }
      setListenState("idle");
    };

    recognition.onend = () => setListenState("idle");

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListenState("idle");
  }, []);

  const clearTranscript = () => {
    setTranscript("");
    onTranscriptChange("");
  };

  const handleSubmit = () => {
    const trimmed = transcript.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card flex flex-col items-center justify-center rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden group h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--secondary)]/5 pointer-events-none" />
      {/* Header */}
      <div className="mb-6 relative z-10">
        <h2 className="mb-2 text-2xl font-bold text-[var(--foreground)] tracking-tight">AI Assistant</h2>
        <p className="text-sm text-[var(--text-muted)] max-w-xs mx-auto font-medium">
          Tap to speak or type your expense. We'll handle the rest.
        </p>
      </div>

      {/* Unsupported Browser Warning */}
      {listenState === "unsupported" && (
        <div className="mb-6 relative z-10 rounded-xl border border-[var(--warning)]/20 bg-[var(--warning)]/10 px-4 py-3 text-sm text-[var(--warning)]">
          <strong>Voice not supported.</strong> Use the text input below instead. Works best in Chrome.
        </div>
      )}

      {/* Mic Button */}
      {listenState !== "unsupported" && (
        <div className="flex flex-col items-center gap-4 relative z-10 mb-8 h-36 justify-center">
          <AnimatePresence mode="wait">
            {isParsing ? (
              <motion.div
                key="processing"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg shadow-[var(--primary)]/40">
                  <Loader2 className="h-10 w-10 animate-spin" />
                </div>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-bold text-[var(--primary)] tracking-widest uppercase mt-4 drop-shadow-md"
                >
                  Processing...
                </motion.p>
              </motion.div>
            ) : (
              <motion.div key="mic" className="flex flex-col items-center w-full">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={listenState === "listening" ? stopListening : startListening}
                  className={`relative flex h-24 w-24 items-center justify-center rounded-full text-white transition-all shadow-2xl ${
                    listenState === "listening"
                      ? "bg-red-500 shadow-red-500/40"
                      : "bg-gradient-to-br from-[var(--primary)] to-[var(--ai-glow)] shadow-[var(--primary)]/30 hover:shadow-[var(--primary)]/50"
                  }`}
                  aria-label={listenState === "listening" ? "Stop listening" : "Start listening"}
                >
                  {/* Enhanced Pulse ring when listening */}
                  {listenState === "listening" && (
                    <>
                      <motion.span 
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full bg-red-400" 
                      />
                      <motion.span 
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.5, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full bg-red-400" 
                      />
                    </>
                  )}
                  {/* Ambient subtle glow when idle */}
                  {listenState !== "listening" && (
                    <span className="absolute inset-0 rounded-full border border-white/20 animate-pulse" />
                  )}
                  {listenState === "listening" ? <MicOff className="h-10 w-10 relative z-10" /> : <Mic className="h-10 w-10 relative z-10" />}
                </motion.button>

                <div className="h-12 mt-3 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {listenState === "listening" ? (
                      <motion.div 
                        key="listening"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col items-center gap-2"
                      >
                        {/* Animated Waveform */}
                        <div className="flex items-center gap-1 h-6">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ height: ["20%", "100%", "20%"] }}
                              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                              className="w-1.5 bg-red-500 rounded-full"
                            />
                          ))}
                        </div>
                        <p className="text-xs font-bold text-red-500 tracking-widest uppercase drop-shadow-md">
                          Listening...
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-wrap items-center justify-center gap-2 max-w-sm"
                      >
                        {["Add Fuel", "Split Expense", "Monthly Report"].map(chip => (
                          <span key={chip} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full border border-[var(--card-border)] bg-[var(--background)] text-[var(--text-muted)] cursor-pointer hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] hover:border-[var(--primary)]/30 transition-colors">
                            {chip}
                          </span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Text Input (always visible) */}
      <div className="w-full flex flex-col gap-2 relative z-10">
        <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider text-left pl-1">
          {listenState === "unsupported" ? "Type your expense" : "Or type it manually"}
        </label>
        <textarea
          className="w-full resize-none rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)]/50 shadow-inner focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all"
          rows={3}
          placeholder='e.g. "Spent 250rs on dinner at Swiggy"'
          value={transcript}
          onChange={(e) => {
            setTranscript(e.target.value);
            onTranscriptChange(e.target.value);
          }}
          disabled={isParsing}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 w-full mt-4 relative z-10">
        <button
          onClick={handleSubmit}
          disabled={!transcript.trim() || isParsing}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 font-semibold text-white shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--primary)]/90 hover:shadow-[var(--primary)]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isParsing ? "Parsing..." : "Parse"} {!isParsing && <Send className="h-4 w-4" />}
        </button>
        {transcript && !isParsing && (
          <button
            onClick={clearTranscript}
            className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-5 py-3 font-semibold text-[var(--text-muted)] transition hover:bg-[var(--card-border)] hover:text-[var(--foreground)]"
          >
            Clear
          </button>
        )}
      </div>
    </motion.div>
  );
}

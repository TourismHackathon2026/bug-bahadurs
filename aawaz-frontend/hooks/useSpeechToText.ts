import { useCallback, useRef, useState } from "react";

interface UseSpeechToTextReturn {
    transcript: string;
    isListening: boolean;
    isStarting: boolean;
    isSpeaking: boolean;
    error: string | null;
    startListening: (language?: string) => void;
    stopListening: () => void;
    resetTranscript: () => void;
    interimTranscript: string;
}

export function useSpeechToText(): UseSpeechToTextReturn {
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    // Check if browser supports Web Speech API
    const SpeechRecognition =
        typeof window !== "undefined"
            ? (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition
            : null;

    const startListening = useCallback(
        (language: string = "en-US") => {
            if (!SpeechRecognition) {
                setError(
                    "Speech Recognition not supported in this browser. Please use Chrome, Edge, or Firefox."
                );
                return;
            }

            try {
                setError(null);
                setTranscript("");
                setInterimTranscript("");
                setIsStarting(true);

                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = language;

                recognition.onstart = () => {
                    setIsStarting(false);
                    setIsListening(true);
                };

                recognition.onresult = (event: any) => {
                    let interim = "";
                    let final = "";

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcriptPart = event.results[i][0].transcript;

                        if (event.results[i].isFinal) {
                            final += transcriptPart + " ";
                        } else {
                            interim += transcriptPart;
                        }
                    }

                    if (final) {
                        setTranscript((prev) => (prev + final).trim());
                    }
                    setInterimTranscript(interim);
                };

                recognition.onerror = (event: any) => {
                    const errorMap: Record<string, string> = {
                        "no-speech": "No speech detected. Please try again.",
                        "audio-capture": "No microphone found. Please check your permissions.",
                        "network": "Network error. Check your internet connection.",
                    };

                    const errorMessage = errorMap[event.error] || `Error: ${event.error}`;

                    setError(errorMessage);
                    setIsListening(false);
                    setIsStarting(false);
                    recognitionRef.current = null;
                };

                recognition.onend = () => {
                    setIsListening(false);
                    setIsStarting(false);
                    recognitionRef.current = null;
                };

                recognitionRef.current = recognition;
                recognition.start();
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : "Failed to start speech recognition";
                setError(message);
                setIsListening(false);
            }
        },
        [SpeechRecognition]
    );

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (err) {
                // Already stopped
            }
            recognitionRef.current = null;
        }
        setIsListening(false);
        setIsStarting(false);
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript("");
        setInterimTranscript("");
        setError(null);
    }, []);

    const isSpeaking = isListening;

    return {
        transcript,
        isListening,
        isStarting,
        isSpeaking,
        error,
        startListening,
        stopListening,
        resetTranscript,
        interimTranscript,
    };
}

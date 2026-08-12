"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { extractVoiceComplaint } from "@/actions/complaint.actions";
import {
    Microphone,
    MicrophoneSlash,
    Spinner,
    CheckCircle,
    XCircle,
} from "@phosphor-icons/react";
import { toast } from "sonner";

interface VoiceComplaintData {
    title: string;
    description: string;
    category: string;
}

interface VoiceRecorderProps {
    onComplaintExtracted: (data: VoiceComplaintData) => void;
    disabled?: boolean;
}

export function VoiceComplaintRecorder({
    onComplaintExtracted,
    disabled = false,
}: VoiceRecorderProps) {
    const {
        transcript,
        isListening,
        isStarting,
        error,
        startListening,
        stopListening,
        resetTranscript,
        interimTranscript,
    } = useSpeechToText();

    const [isExtracting, setIsExtracting] = useState(false);
    const [extractionError, setExtractionError] = useState<string | null>(null);
    const [language, setLanguage] = useState("en-US");

    const handleStartRecording = async () => {
        setExtractionError(null);
        resetTranscript();
        startListening(language);
    };

    const handleStopRecording = () => {
        stopListening();
    };

    const handleExtractComplaint = async () => {
        if (!transcript.trim()) {
            toast.error("No speech detected. Please try recording again.");
            return;
        }

        setIsExtracting(true);
        setExtractionError(null);

        try {
            const result = await extractVoiceComplaint(transcript);

            if (!result.success || !result.data) {
                throw new Error(result.error || "Failed to process voice complaint");
            }

            toast.success("Complaint extracted successfully!");
            onComplaintExtracted({
                title: result.data.title,
                description: result.data.description,
                category: result.data.category,
            });

            resetTranscript();
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to extract complaint";
            setExtractionError(message);
            toast.error(message);
        } finally {
            setIsExtracting(false);
        }
    };

    const fullTranscript = transcript + interimTranscript;

    return (
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                        Voice Complaint Recording
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        Speak your complaint naturally. We'll extract the details for you.
                    </p>
                </div>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={isListening || disabled}
                    className="h-9 rounded-md border border-input bg-white px-2 text-xs leading-6 focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                >
                    <option value="en-US">English</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                    <option value="de-DE">German</option>
                    <option value="hi-IN">Hindi</option>
                </select>
            </div>

            {/* Recording Controls */}
            <div className="flex gap-2">
                {!isListening ? (
                    <Button type="button"
                        onClick={handleStartRecording}
                        disabled={disabled || isExtracting || isStarting}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                    >
                        <Microphone size={18} weight="fill" />
                        Start Recording
                    </Button>
                ) : (
                    <Button
                        onClick={handleStopRecording}
                        className="flex items-center gap-2 bg-destructive hover:bg-destructive/90"
                    >
                        <MicrophoneSlash size={18} weight="fill" />
                        Stop Recording
                    </Button>
                )}

                {fullTranscript && (
                    <Button
                        onClick={() => resetTranscript()}
                        variant="outline"
                        disabled={isListening || isExtracting}
                    >
                        Clear
                    </Button>
                )}
            </div>

            {/* Status Indicator */}
            {isStarting && (
                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
                    Voice is starting... Please wait before speaking.
                </div>
            )}
            {isListening && !isStarting && (
                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
                    Listening...
                </div>
            )}

            {/* Transcript Display */}
            {fullTranscript && (
                <div className="space-y-2">
                    <div className="rounded-lg bg-surface p-4">
                        <p className="text-sm text-foreground leading-relaxed">
                            {transcript}
                            {interimTranscript && (
                                <span className="text-muted-foreground italic">
                                    {interimTranscript}
                                </span>
                            )}
                        </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {fullTranscript.split(" ").length} words • {fullTranscript.length}{" "}
                        characters
                    </p>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="rounded-lg bg-destructive/10 p-3 flex items-start gap-2">
                    <XCircle size={18} className="text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-destructive">{error}</p>
                        <p className="text-xs text-destructive/80 mt-1">
                            Please check your microphone and try again.
                        </p>
                    </div>
                </div>
            )}

            {extractionError && (
                <div className="rounded-lg bg-destructive/10 p-3 flex items-start gap-2">
                    <XCircle size={18} className="text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-destructive">{extractionError}</p>
                </div>
            )}

            {/* Extract Button */}
            {transcript && !isListening && (
                <Button
                    onClick={handleExtractComplaint}
                    disabled={disabled || isExtracting || !transcript.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                >
                    {isExtracting ? (
                        <>
                            <Spinner size={18} weight="fill" className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CheckCircle size={18} weight="fill" />
                            Extract Complaint Details
                        </>
                    )}
                </Button>
            )}

            {/* Info Message */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 text-xs text-blue-900 dark:text-blue-100">
                <p>
                    💡 <strong>Tip:</strong> Speak clearly and naturally. Include details
                    about what happened, where, when, and who was involved.
                </p>
            </div>
        </div>
    );
}

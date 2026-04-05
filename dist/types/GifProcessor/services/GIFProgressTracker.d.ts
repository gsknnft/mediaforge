import { BaseProgressTracker, Phase } from './BaseProgressTracker';
export declare const GIF_PHASES: Record<string, Phase>;
export declare const GIF_PHASE_ORDER: string[];
export declare class GIFProgressTracker extends BaseProgressTracker {
    private encodingStartTime;
    private frameCount;
    private processedFrames;
    private completedPhases;
    private phaseTimings;
    private progressDebouncer;
    constructor();
    updateProgress(phase: keyof typeof GIF_PHASES, progress: number, details?: string, totalItems?: number, processedItems?: number, estimatedRemainingTime?: number): void;
    private handleEncodingPhase;
    private calculatePhaseElapsed;
    private calculateProcessingSpeed;
    private calculateEta;
    completePhase(phaseId: string, timestamp?: number): Promise<void>;
    getTotalElapsedTime(): number;
    reset(): void;
    destroy(): void;
}
export declare class ImageProcessingTracker extends BaseProgressTracker {
}
export declare class VideoProcessingTracker extends BaseProgressTracker {
}
export type { Phase };
//# sourceMappingURL=GIFProgressTracker.d.ts.map
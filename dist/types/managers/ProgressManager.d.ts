export declare class ProgressDebouncer {
    private callback;
    private timeout;
    private lastUpdate;
    private readonly minInterval;
    constructor(callback: Function);
    update(...args: any[]): void;
    cancel(): void;
}
interface IProgressManager {
    trackFrameProcessing(frameIndex: number, totalFrames: number): void;
    updateLoadingProgress(current: number, total: number, assetUrl: string): void;
    calculateETA(currentFrame: number, totalFrames: number): string;
    resetProgress(): void;
    updatePhase(phaseId: string, progress: number, message: string, operation: "processing" | "streaming", assetName?: string, totalItems?: number, estimatedRemainingTime?: number): void;
}
export declare class ProgressManager implements IProgressManager {
    private phases;
    private initialized;
    private progressDebouncer;
    private processingStartTime;
    private framesProcessed;
    private averageFrameTime;
    private totalFrames;
    private frameStartTime;
    private frameProcessingTimes;
    private totalFramesCount;
    private processedFramesCount;
    private phaseStartTimes;
    private completedPhases;
    private significantOperations;
    constructor();
    private initializePhases;
    /**
     * 🚀 Tracks frame processing time and calculates progress/ETA dynamically.
     */
    trackFrameProcessing(frameIndex: number, totalFrames: number): {
        progress: number;
        estimatedRemainingTime: number;
        avgTimePerFrame: number;
        elapsedTime: number;
    };
    /**
     * 📥 Tracks overall loading progress.
     */
    updateLoadingProgress(current: number, total: number, assetUrl: string): void;
    /**
     * ⏳ Calculates ETA dynamically.
     */
    calculateETA(currentFrame: number, totalFrames: number): string;
    /**
     * 🔄 Resets all progress tracking data.
     */
    resetProgress(phaseId?: string): void;
    /**
     * 📊 Updates the progress of a specific GIF processing phase.
     */
    updatePhase(phaseId: string, progress: number, message: string, operation?: "processing" | "streaming", assetName?: string, totalItems?: number, estimatedRemainingTime?: number): void;
    destroy(): void;
}
export default ProgressManager;
//# sourceMappingURL=ProgressManager.d.ts.map
interface Phase {
    id: string;
    name: string;
    weight: number;
    color: string;
    progress?: number;
    status?: 'pending' | 'active' | 'completed' | 'error';
    message?: string;
    duration?: number;
    eta?: number;
    startTime?: number;
    assetName?: string;
    totalItems?: number;
    processedItems?: number;
    averageTimePerItem?: number;
    endTime?: number;
}
interface ProgressEventDetail {
    phase: string;
    phaseProgress: number;
    totalProgress: number;
    message?: string;
    currentPhase: string;
    status?: string;
    timestamp: number;
    totalItems?: number;
    processedItems?: number;
    estimatedRemainingTime?: number;
    elapsedTime?: number;
    isActive?: boolean;
    processingSpeed?: string;
}
export declare class BaseProgressTracker {
    protected phases: Record<string, Phase>;
    protected phaseOrder: string[];
    protected startTime: number;
    protected phaseStartTimes: Record<string, number>;
    protected currentPhase: string;
    constructor(phases: Record<string, Phase>, phaseOrder: string[]);
    protected emitProgress(detail: ProgressEventDetail): void;
    protected calculateTotalProgress(): number;
    startTracking(): void;
    updatePhaseProgress(phaseId: string, progress: number, message?: string): void;
    reset(): void;
    getPhaseInfo(phaseId: string): Phase | undefined;
    getAllPhases(): Phase[];
    getCurrentPhase(): Phase | undefined;
    getTotalProgress(): number;
    getElapsedTime(): number;
}
export type { ProgressEventDetail, Phase };
declare const _default: {
    BaseProgressTracker: typeof BaseProgressTracker;
};
export default _default;
//# sourceMappingURL=BaseProgressTracker.d.ts.map
import { GIF_PHASES } from "../services/GIFProgressTracker";

export class ProgressDebouncer {
    private timeout: NodeJS.Timeout | null = null;
    private lastUpdate: number = 0;
    private readonly minInterval: number = 1000; // Minimum time between updates
  
    constructor(private callback: Function) {}
  
    update(...args: any[]) {
      const now = performance.now();
      
      // Cancel any pending updates
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
  
      // If enough time has passed, update immediately
      if (now - this.lastUpdate > this.minInterval) {
        this.lastUpdate = now;
        this.callback(...args);
        return;
      }
  
      // Otherwise, schedule an update
      this.timeout = setTimeout(() => {
        this.lastUpdate = performance.now();
        this.callback(...args);
      }, this.minInterval);
    }
  
    cancel() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
    }
  }

interface IProgressManager {
    trackFrameProcessing(frameIndex: number, totalFrames: number): void;
    updateLoadingProgress(current: number, total: number, assetUrl: string): void;
    calculateETA(currentFrame: number, totalFrames: number): string;
    resetProgress(): void;
    updatePhase(
        phaseId: string, 
        progress: number,
        message: string, 
        operation: 'processing' | 'streaming',
        assetName?: string,
        totalItems?: number,
        estimatedRemainingTime?: number
    ): void;
}

interface PhaseState {
    progress: number;
    message: string;
    operation: 'processing' | 'streaming';
    processed: number;
    total: number;
    status: 'pending' | 'active' | 'completed';
}


class ProgressManager implements IProgressManager {
    private phases: Record<string, PhaseState> = {};
    private initialized = false;
    private progressDebouncer: ProgressDebouncer;
    private processingStartTime: number = 0;
    private framesProcessed: number = 0;
    private averageFrameTime: number = 0;
    private totalFrames: number = 0;
    private frameStartTime: number = 0;
    private frameProcessingTimes: number[] = [];
    private totalFramesCount: number = 0;
    private processedFramesCount: number = 0;
    private phaseStartTimes: Map<string, number> = new Map();
    private completedPhases: Set<string> = new Set();
    private significantOperations = new Set(['processing', 'encoding']);

    constructor() {
        this.progressDebouncer = new ProgressDebouncer((data: any) => {
            window.dispatchEvent(new CustomEvent('gif-phase-update', { detail: data }));
        });
        if (!this.initialized) {
            this.initializePhases();
            this.initialized = true;
          }
    }


    private initializePhases() {
        // Initialize phases without triggering updates
        Object.entries(GIF_PHASES).forEach(([key, phase]) => {
          this.phases[phase.id] = {
            progress: 0,
            message: `${phase.name} reset`,
            operation: 'processing',
            processed: 0,
            total: 0,
            status: 'pending'
          };
        });
      }
      
    /**
     * 🚀 Tracks frame processing time and calculates progress/ETA dynamically.
     */
    public trackFrameProcessing(frameIndex: number, totalFrames: number) {
        const now = performance.now();

        if (frameIndex === 0) {
            // Initialize tracking for a new GIF process
            this.frameStartTime = now;
            this.frameProcessingTimes = [];
            this.totalFramesCount = totalFrames;
            this.processedFramesCount = 0;
            this.processingStartTime = now;
        }

        // Calculate frame time
        const frameTime = now - this.frameStartTime;
        this.frameProcessingTimes.push(frameTime);
        this.processedFramesCount++;

        // Smooth out fluctuations by averaging last 5 frames
        const recentFrames = this.frameProcessingTimes.slice(-5);
        const avgTimePerFrame = recentFrames.reduce((a, b) => a + b, 0) / recentFrames.length;

        // Estimate remaining time
        const remainingFrames = totalFrames - (frameIndex + 1);
        const estimatedRemainingTime = remainingFrames * avgTimePerFrame;

        // Update for next frame
        this.frameStartTime = now;

        return {
            progress: Math.round(((frameIndex + 1) / totalFrames) * 100),
            estimatedRemainingTime,
            avgTimePerFrame,
            elapsedTime: now - this.processingStartTime
        };
    }

    /**
     * 📥 Tracks overall loading progress.
     */
    public updateLoadingProgress(current: number, total: number, assetUrl: string): void {
        const progress = Math.round((current / total) * 100);
        this.updatePhase(
            GIF_PHASES.LOADING.id,
            progress,
            `Loading assets (${current}/${total}): ${assetUrl.split('/').pop()}`
        );
    }

    /**
     * ⏳ Calculates ETA dynamically.
     */
    public calculateETA(currentFrame: number, totalFrames: number): string {
        const now = performance.now();
        const elapsed = now - this.processingStartTime;

        if (currentFrame === 0) {
            this.processingStartTime = now;
            return 'Calculating...';
        }

        this.framesProcessed = currentFrame;
        this.averageFrameTime = elapsed / currentFrame;

        const remainingFrames = totalFrames - currentFrame;
        const estimatedRemainingMs = remainingFrames * this.averageFrameTime;

        if (estimatedRemainingMs < 1000) {
            return 'Less than a second';
        }

        const seconds = Math.round(estimatedRemainingMs / 1000);
        if (seconds < 60) {
            return `~${seconds} seconds`;
        }

        const minutes = Math.round(seconds / 60);
        return `~${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    /**
     * 🔄 Resets all progress tracking data.
     */
  // Modify the reset method to be more selective
  public resetProgress(phaseId?: string) {
    if (phaseId) {
      // Reset single phase without triggering update
      const phase = GIF_PHASES[phaseId];
      if (phase) {
        this.phases[phase.id] = {
          progress: 0,
          message: `${phase.name} reset`,
          operation: 'processing',
          processed: 0,
          total: 0,
          status: 'pending'
        };
      }
    } else {
      // Only reset if not already in initial state
      const needsReset = Object.values(this.phases).some(phase => 
        phase.progress !== 0 || 
        phase.processed !== 0 || 
        phase.total !== 0 ||
        phase.status !== 'pending'
      );

      if (needsReset) {
        this.initializePhases();
      }
    }
  }


    /**
     * 📊 Updates the progress of a specific GIF processing phase.
     */
    public updatePhase(
        phaseId: string, 
        progress: number, 
        message: string,
        operation: 'processing' | 'streaming' = 'processing',
        assetName?: string,
        totalItems?: number,
        estimatedRemainingTime?: number
    ): void {
        // Skip progress updates for non-significant operations
        if (!this.significantOperations.has(operation)) {
            return;
        }
        const now = performance.now();

        if (!this.phaseStartTimes.has(phaseId)) {
            this.phaseStartTimes.set(phaseId, now);
        }

        // Calculate elapsed time for the phase
        const phaseElapsed = now - (this.phaseStartTimes.get(phaseId) || now);
        const phaseSpeed = this.processedFramesCount ? phaseElapsed / this.processedFramesCount : 0;
        const remainingInPhase = totalItems ? (totalItems - this.processedFramesCount) * phaseSpeed : 0;

        const phaseData = {
            phaseId,
            currentProgress: progress,
            message,
            operation,
            assetName,
            timestamp: now,
            totalItems,
            estimatedRemainingTime: estimatedRemainingTime || remainingInPhase,
            elapsedTime: phaseElapsed,
            speed: phaseSpeed,
            processed: this.processedFramesCount,
            total: totalItems || this.totalFramesCount,
            isCompleted: progress >= 100
        };

        // **🚀 Emit progress update event (Debounced for performance)**
        this.progressDebouncer.update(phaseData);

        // ✅ Mark completed phases
        if (progress >= 100) {
            this.completedPhases.add(phaseId);
        }

        // Ensure previous phases are marked complete
        Object.values(GIF_PHASES).forEach(phase => {
            if (phase.id !== phaseId && !this.completedPhases.has(phase.id)) {
                const isEarlierPhase = Object.values(GIF_PHASES).indexOf(phase) <
                                       Object.values(GIF_PHASES).findIndex(p => p.id === phaseId);

                if (isEarlierPhase) {
                    this.completedPhases.add(phase.id);
                    window.dispatchEvent(new CustomEvent('gif-phase-update', {
                        detail: {
                            phaseId: phase.id,
                            currentProgress: 100,
                            message: `${phase.name} complete`,
                            timestamp: now
                        }
                    }));
                }
            }
        });

        // **Debugging Info**
        console.debug(`[GIF Phase Update] ${phaseId}:`, {
            progress,
            message,
            operation,
            processed: this.processedFramesCount,
            total: this.totalFramesCount,
            avgTime: Math.round(phaseData.speed)
        });
    }

    public destroy() {
        this.progressDebouncer.cancel();
    }
}

export default ProgressManager;

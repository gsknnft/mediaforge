import { BaseProgressTracker, Phase } from './BaseProgressTracker';
import { ProgressDebouncer } from '../managers/ProgressManager';

// GIF-specific configuration
export const GIF_PHASES: Record<string, Phase> = {
  LOADING: { id: 'loading', name: 'Loading Assets', weight: 5, color: 'bg-blue-600'},
  CREATE_STATIC: { id: 'create_static', name: 'Creating Static Layer', weight: 5, color: 'bg-teal-600'},
  EXTRACTING: { id: 'extracting', name: 'Extracting Frames', weight: 15, color: 'bg-purple-600'},
  PROCESSING: { id: 'processing', name: 'Processing Frames', weight: 25, color: 'bg-yellow-600'},
  ENCODING: { id: 'encoding', name: 'Encoding GIF', weight: 50, color: 'bg-green-600'}
};

export const GIF_PHASE_ORDER = ['loading', 'create_static', 'extracting', 'processing', 'encoding'];

// GIF-specific progress tracker
export class GIFProgressTracker extends BaseProgressTracker {
  private encodingStartTime: number = 0;
  private frameCount: number = 0;
  private processedFrames: number = 0;
  private completedPhases: Set<string> = new Set();
  private phaseTimings: Map<string, { start: number; end?: number }> = new Map();
  private progressDebouncer: ProgressDebouncer;

  constructor() {
    super(GIF_PHASES, GIF_PHASE_ORDER);
    this.startTime = Date.now();
    this.progressDebouncer = new ProgressDebouncer((data: any) => {
        this.emitProgress(data);
    });
}

  updateProgress(
    phase: keyof typeof GIF_PHASES,
    progress: number,
    details?: string,
    totalItems?: number,
    processedItems?: number,
    estimatedRemainingTime?: number
  ) {
    const now = Date.now();
    
    // Check if the phase is valid
    if (!this.phases[phase]) {
      console.error(`Invalid phase: ${phase}`);
      return;
    }
  
    // Initialize phase timing if not exists
    if (!this.phaseTimings.has(phase)) {
      this.phaseTimings.set(phase, { start: now });
    } 

    // Handle phase transitions
    if (phase !== this.currentPhase) {
      if (this.currentPhase) {
        const prevTiming = this.phaseTimings.get(this.currentPhase);
        if (prevTiming) {
          prevTiming.end = now;
          this.phaseTimings.set(this.currentPhase, prevTiming);
        }
      }
      this.currentPhase = phase;
    }

    // Update phase state
    const currentPhase = this.phases[phase];
    if (!currentPhase) return;

    currentPhase.status = 'active';
    currentPhase.progress = Math.min(100, Math.max(0, progress));
    currentPhase.message = details || currentPhase.message;
    currentPhase.startTime = this.phaseTimings.get(phase)?.start;
    currentPhase.totalItems = totalItems;
    currentPhase.processedItems = processedItems;

    // Special handling for encoding phase
    if (phase === 'encoding') {
      this.handleEncodingPhase(progress, now, totalItems, processedItems);
    }

    // Calculate timing metrics
    const phaseElapsed = this.calculatePhaseElapsed(phase, now);
    const totalElapsed = now - this.startTime;
    
    // Calculate processing speed and ETA
    const processingSpeed = this.calculateProcessingSpeed(phase, processedItems, phaseElapsed);
    const eta = this.calculateEta(phase, processedItems, totalItems, phaseElapsed);

    // Emit progress
    this.progressDebouncer.update({
      phase,
      phaseProgress: progress,
      totalProgress: this.calculateTotalProgress(),
      message: currentPhase.message,
      currentPhase: currentPhase.name,
      status: currentPhase.status,
      timestamp: now,
      totalItems,
      processedItems,
      estimatedRemainingTime: eta,
      elapsedTime: totalElapsed,
      isActive: true,
      processingSpeed: processingSpeed
  });

    // Handle phase completion
    if (progress >= 100) {
      this.completePhase(phase, now).then(() => {
        this.updateProgress(phase, 0, details, totalItems, processedItems, estimatedRemainingTime);
      });        
    }
  }

  private handleEncodingPhase(progress: number, now: number, totalItems?: number, processedItems?: number) {
    if (!this.encodingStartTime) {
      this.encodingStartTime = now;
      this.frameCount = totalItems || 0;
    }
    this.processedFrames = processedItems || 0;
  }

  private calculatePhaseElapsed(phase: string, now: number): number {
    const timing = this.phaseTimings.get(phase);
    if (!timing) return 0;
    return now - timing.start;
  }

  private calculateProcessingSpeed(phase: string, processedItems?: number, elapsed?: number): string {
    if (!processedItems || !elapsed) return '';
    const itemsPerSecond = (processedItems / elapsed) * 1000;
    return phase === 'encoding' ? 
      `${itemsPerSecond.toFixed(1)} fps` : 
      `${itemsPerSecond.toFixed(1)}/s`;
  }

  private calculateEta(phase: string, processed?: number, total?: number, elapsed?: number): number {
    if (!processed || !total || !elapsed) return 0;
    const itemsPerMs = processed / elapsed;
    const remaining = total - processed;
    return remaining / itemsPerMs;
  }

  async completePhase(phaseId: string, timestamp: number = Date.now()): Promise<void> {
    const phase = this.phases[phaseId];
    if (!phase) return;

    const timing = this.phaseTimings.get(phaseId);
    if (timing) {
      timing.end = timestamp;
      this.phaseTimings.set(phaseId, timing);
    }

    phase.status = 'completed';
    phase.progress = 100;
    phase.endTime = timestamp;
    phase.duration = timing ? timing.end! - timing.start : 0;

    this.completedPhases.add(phaseId);

    // Start next phase if available
    const nextPhaseIndex = this.phaseOrder.indexOf(phaseId) + 1;
    if (nextPhaseIndex < this.phaseOrder.length) {
      const nextPhaseId = this.phaseOrder[nextPhaseIndex];
      this.phaseTimings.set(nextPhaseId, { start: timestamp });
    }
  }

  getTotalElapsedTime(): number {
    return Date.now() - this.startTime;
  }

  reset() {
    super.reset();
    this.startTime = Date.now();
    this.encodingStartTime = 0;
    this.frameCount = 0;
    this.processedFrames = 0;
    this.completedPhases.clear();
    this.phaseTimings.clear();
  }

  destroy() {
    this.progressDebouncer.cancel();
}

}

// Create other specific trackers as needed
export class ImageProcessingTracker extends BaseProgressTracker {
  // Implementation for image processing specific tracking
}

export class VideoProcessingTracker extends BaseProgressTracker {
  // Implementation for video processing specific tracking
}

export type { Phase };
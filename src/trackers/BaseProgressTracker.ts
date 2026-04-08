interface Phase {
  id: string;
  name: string;
  weight: number;
  color: string;
  progress?: number;
  status?: 'pending' | 'active' | 'completed' | 'error';
  message?: string;
  duration?: number; // Add this to store the phase duration
  eta?: number;
  startTime?: number;
  assetName?: string;
  totalItems?: number;
  processedItems?: number;
  averageTimePerItem?: number;
  endTime?: number;
}

// Define the base progress event type
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

// Base progress tracker class
export class BaseProgressTracker {
  protected phases: Record<string, Phase> = {};
  protected phaseOrder: string[] = [];
  protected startTime: number = 0;
  protected phaseStartTimes: Record<string, number> = {};
  protected currentPhase: string = '';

  constructor(phases: Record<string, Phase>, phaseOrder: string[]) {
    this.phases = { ...phases };
    this.phaseOrder = phaseOrder;
  }

  protected emitProgress(detail: ProgressEventDetail) {
    if (typeof window !== "undefined") {

    window.dispatchEvent(new CustomEvent('progress-update', { detail }));
  }
  }

  protected calculateTotalProgress(): number {
    let totalProgress = 0;
    let activePhaseFound = false;

    for (const phaseId of this.phaseOrder) {
      const phase = this.phases[phaseId];
      if (phase.status === 'completed') {
        totalProgress += phase.weight;
      } else if (phase.status === 'active' && !activePhaseFound) {
        totalProgress += ((phase.progress ?? 0) * phase.weight) / 100;
        activePhaseFound = true;
      }
      if (activePhaseFound) break;
    }

    const totalWeight = this.phaseOrder.reduce((sum, id) => sum + this.phases[id].weight, 0);
    return totalWeight > 0 ? Math.round((totalProgress / totalWeight) * 100) : 0;
  }

  startTracking() {
    this.startTime = Date.now();
    this.reset();
  }

  updatePhaseProgress(phaseId: string, progress: number, message?: string) {
    const phase = this.phases[phaseId];
    if (phase) {
      phase.progress = progress;
      phase.message = message || '';
      this.emitProgress({
        phase: phaseId,
        phaseProgress: progress,
        totalProgress: this.getTotalProgress(),
        currentPhase: this.currentPhase,
        status: phase.status,
        timestamp: Date.now(),
        elapsedTime: this.getElapsedTime(),
      });
    }
  }

  reset() {
    this.startTime = 0;
    this.phaseStartTimes = {};
    this.currentPhase = this.phaseOrder[0];

    Object.values(this.phases).forEach(phase => {
      phase.progress = 0;
      phase.status = undefined;
      phase.message = '';
      phase.startTime = undefined;
      phase.eta = undefined;
      phase.processedItems = undefined;
      phase.totalItems = undefined;
      phase.averageTimePerItem = undefined;
    });
  }

  getPhaseInfo(phaseId: string): Phase | undefined {
    return this.phases[phaseId];
  }

  getAllPhases(): Phase[] {
    return Object.values(this.phases);
  }

  getCurrentPhase(): Phase | undefined {
    return this.phases[this.currentPhase];
  }

  getTotalProgress(): number {
    return this.calculateTotalProgress();
  }

  getElapsedTime(): number {
    return this.startTime ? Date.now() - this.startTime : 0;
  }
}

export type { ProgressEventDetail, Phase };
export default { BaseProgressTracker };

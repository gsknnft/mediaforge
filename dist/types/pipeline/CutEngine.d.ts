import { MediaTimeline } from "./types";
export declare class CutEngine {
    static cutByFrame(timeline: MediaTimeline, startFrame: number, endFrameInclusive: number, clipName?: string): MediaTimeline;
    static cutByTime(timeline: MediaTimeline, startMs: number, endMs: number, clipName?: string): MediaTimeline;
    static sampleEvery(timeline: MediaTimeline, step: number, clipName?: string): MediaTimeline;
}
//# sourceMappingURL=CutEngine.d.ts.map
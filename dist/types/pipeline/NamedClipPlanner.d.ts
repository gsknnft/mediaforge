import { MediaTimeline, NamedClipPlanOptions, NamedClipRange } from "./types";
export declare class NamedClipPlanner {
    static plan(timeline: MediaTimeline, options?: NamedClipPlanOptions): NamedClipRange[];
    static split(timeline: MediaTimeline, options?: NamedClipPlanOptions): Record<string, MediaTimeline>;
    static summarize(timeline: MediaTimeline, options?: NamedClipPlanOptions): Array<NamedClipRange & {
        durationMs: number;
    }>;
}
//# sourceMappingURL=NamedClipPlanner.d.ts.map
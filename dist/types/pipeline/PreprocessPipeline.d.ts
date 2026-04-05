import type { FlatBackgroundPreprocessOptions, MediaTimeline, TimelinePreprocessOptions, TimelinePreprocessReport } from "./types";
export declare function createFlatBackgroundSpritePreprocess(options: FlatBackgroundPreprocessOptions): TimelinePreprocessOptions;
export declare class PreprocessPipeline {
    static run(timeline: MediaTimeline, options?: TimelinePreprocessOptions): Promise<{
        timeline: MediaTimeline;
        report: TimelinePreprocessReport;
    }>;
}
//# sourceMappingURL=PreprocessPipeline.d.ts.map
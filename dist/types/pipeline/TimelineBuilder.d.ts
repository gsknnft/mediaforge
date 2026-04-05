import { ParsedFrame } from "gifuct-js";
import type { MediaTimeline, VideoExtractOptions } from "./types";
export declare class TimelineBuilder {
    static fromGifFrames(frames: ParsedFrame[], id?: string): MediaTimeline;
    static fromImageSource(source: CanvasImageSource, id?: string, durationMs?: number): Promise<MediaTimeline>;
    static fromVideo(options: VideoExtractOptions, id?: string): Promise<MediaTimeline>;
}
//# sourceMappingURL=TimelineBuilder.d.ts.map
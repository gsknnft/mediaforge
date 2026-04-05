import { EventEmitter } from 'events';
export type GifStatus = {
    isLoading: boolean;
    error?: string;
    progress?: number;
    temporaryGif?: string | null;
};
interface GifLoaderConfig {
    maxSizeInMB: number;
    allowedFileType: string[];
}
export declare class GifLoader extends EventEmitter {
    private temporaryGif;
    private readonly config;
    private status;
    constructor(config?: Partial<GifLoaderConfig>);
    private isCanceled;
    cancelUpload(): void;
    uploadTemporaryGif(file: File): Promise<string | null>;
    private validateFile;
    private createObjectURL;
    private simulateProgress;
    getTemporaryGif(): string | null;
    cleanup(): void;
}
export {};
//# sourceMappingURL=GifLoader.d.ts.map
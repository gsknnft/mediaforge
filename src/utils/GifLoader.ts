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

export class GifLoader extends EventEmitter {
    private temporaryGif: string | null = null;
    private readonly config: GifLoaderConfig = {
        maxSizeInMB: 10,
        allowedFileType: ['image/gif']
    };
    private status: GifStatus = {
        isLoading: false,
        progress: 0
    };

    constructor(config?: Partial<GifLoaderConfig>) {
        super();
        this.config = {
            ...this.config,
            ...config,
        };
    }
    
    private isCanceled = false;

    cancelUpload(): void {
        if (this.status.isLoading) {
            this.isCanceled = true;
            this.status.isLoading = false;
            this.emit('statusChange', this.status);
        }
    }


    async uploadTemporaryGif(file: File): Promise<string | null> {
        this.status.isLoading = true;
        this.status.progress = 0; // Reset progress on new upload
        this.emit('statusChange', this.status);

        try {
            if (!this.validateFile(file)) {
                throw new Error('Invalid file format or size');
            }

            // Simulate upload progress for demo purposes
            await this.simulateProgress(500); // Adjust delay as needed

            const gifUrl = await this.createObjectURL(file);
            this.temporaryGif = gifUrl;
            this.status.progress = 100;
            this.emit('statusChange', this.status);
            return gifUrl;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
            this.status.error = message;
            this.emit('statusChange', this.status);
            return null;        
        } finally {
            this.status.isLoading = false;
            this.emit('statusChange', this.status);
        }
    }


    private validateFile(file: File): boolean {
        const isValidType = this.config.allowedFileType.includes(file.type);
        const isValidSize = file.size <= this.config.maxSizeInMB * 1024 * 1024;
        return isValidType && isValidSize;
    }

    private async createObjectURL(file: File): Promise<string> {
        return URL.createObjectURL(file);
    }

    private async simulateProgress(delay: number): Promise<void> {
        const increments = 10;
        for (let i = 0; i <= 100; i += increments) {
            this.status.progress = i;
            this.emit('statusChange', this.status);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    

    getTemporaryGif(): string | null {
        return this.temporaryGif;
    }

    cleanup(): void {
        if (this.temporaryGif) {
            URL.revokeObjectURL(this.temporaryGif);
            this.temporaryGif = null;
        }
    }
}
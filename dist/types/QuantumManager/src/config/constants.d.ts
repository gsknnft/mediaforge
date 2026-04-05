import { Address } from 'viem';
declare const DEPLOY_URL: String;
declare const BaseURL: String;
declare const S3_BUCKET: String;
declare const BASE_URL: String;
declare const PUBLIC_ASSETS_URL = "/assets/traits";
declare const CONTRACT_ADDRESS: string;
declare const RATE_LIMIT_DELAY = 300;
declare const MAX_CONCURRENT_REQUESTS = 5;
declare const MAX_RETRY_ATTEMPTS = 3;
declare const MAX_LOCAL_STORAGE_CACHE_SIZE = 50;
declare const ALLOWED_ADDRESSES: Array<Address>;
export declare const SYSTEM_NAME = "QSignal";
export declare const SYSTEM_SEED = "V-Signal-v01";
export declare const SYSTEM_OWNER = "@GSKNNFT";
export declare const SYSTEM_VERSION = "QSignal-v01";
export declare const SYSTEM_CYCLE = "WIP-03";
export declare const LICENSE_FILE = "LICENSE.md";
export declare const PATENT_FILE = "PATENT_REFERENCE.md";
export declare const RECOVERY_PROTOCOL = "RECOVERY_PROTOCOL.md";
export declare const TOKEN_FETCH_CONFIG: {
    readonly BATCH_SIZE: 20;
    readonly RETRY_DELAY: 1000;
    readonly MAX_RETRIES: 3;
    readonly BATCH_INTERVAL: 200;
    readonly BACKOFF_MULTIPLIER: 500;
};
export { ALLOWED_ADDRESSES, PUBLIC_ASSETS_URL, DEPLOY_URL, BaseURL, S3_BUCKET, BASE_URL, CONTRACT_ADDRESS, RATE_LIMIT_DELAY, MAX_CONCURRENT_REQUESTS, MAX_RETRY_ATTEMPTS, MAX_LOCAL_STORAGE_CACHE_SIZE };
//# sourceMappingURL=constants.d.ts.map
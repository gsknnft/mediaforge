// put any constants here.
import { Address } from 'viem';
const DEPLOY_URL: String = "";// `https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsteven-tey%2Fprecedent&project-name=precedent&repository-name=precedent&demo-title=Precedent&demo-description=An%20opinionated%20collection%20of%20components%2C%20hooks%2C%20and%20utilities%20for%20your%20Next%20project.&demo-url=https%3A%2F%2Fprecedent.dev&demo-image=https%3A%2F%2Fprecedent.dev%2Fopengraph-image&env=GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,NEXTAUTH_SECRET&envDescription=How%20to%20get%20these%20env%20variables%3A&envLink=https%3A%2F%2Fgithub.com%2Fsteven-tey%2Fprecedent%2Fblob%2Fmain%2F.env.example&stores=%5B%7B"type"%3A"postgres"%7D%5D`;
const BaseURL: String = 'https://apefathersnft.nyc3.cdn.digitaloceanspaces.com'; //https://apefathersnft.nyc3.cdn.digitaloceanspaces.com/afbgless
const S3_BUCKET: String = `${BaseURL}/afbgless`;
const BASE_URL: String = `${BaseURL}/afnft/public`;
//const OVERLAY_BASE_URL: String = `${BASE_URL}/overlays`; // Add this line
const PUBLIC_ASSETS_URL = '/assets/traits';
import { getEnvString } from "../../../utils/env";

const CONTRACT_ADDRESS = getEnvString(
  "NEXT_PUBLIC_APEFATHERS_ADDRESS",
  "0xE128cA01CcEb08f1b0a58C628d841Bc0EF0A4b80",
);
const RATE_LIMIT_DELAY = 300; // 300ms delay between requests
const MAX_CONCURRENT_REQUESTS = 5;
const MAX_RETRY_ATTEMPTS = 3;
const MAX_LOCAL_STORAGE_CACHE_SIZE = 50; // Example limit
const ALLOWED_ADDRESSES: Array<Address> = ['0x197cD8E056B6CC93700F56FF38d5c13B613f57e8'];

export const SYSTEM_NAME = "QSignal";
export const SYSTEM_SEED = "V-Signal-v01";
export const SYSTEM_OWNER = "@GSKNNFT";
export const SYSTEM_VERSION = "QSignal-v01";
export const SYSTEM_CYCLE = "WIP-03";

export const LICENSE_FILE = "LICENSE.md";
export const PATENT_FILE = "PATENT_REFERENCE.md";
export const RECOVERY_PROTOCOL = "RECOVERY_PROTOCOL.md";


export const TOKEN_FETCH_CONFIG = {
    BATCH_SIZE: 20,
    RETRY_DELAY: 1000,
    MAX_RETRIES: 3,
    BATCH_INTERVAL: 200,
    BACKOFF_MULTIPLIER: 500
  } as const;


export {
    ALLOWED_ADDRESSES,
    PUBLIC_ASSETS_URL,
    DEPLOY_URL,
    BaseURL,
    S3_BUCKET,
    BASE_URL,
    CONTRACT_ADDRESS,
    RATE_LIMIT_DELAY,
    MAX_CONCURRENT_REQUESTS,
    MAX_RETRY_ATTEMPTS,
    MAX_LOCAL_STORAGE_CACHE_SIZE
}

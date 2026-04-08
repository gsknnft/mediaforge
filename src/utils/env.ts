type EnvLike = {
  MODE?: string;
  DEV?: boolean;
  PROD?: boolean;
  [key: string]: unknown;
};

type EnvCarrier = {
  env?: EnvLike;
  DEV?: boolean;
  PROD?: boolean;
};

function getImportMetaEnv(): EnvCarrier | undefined {
  if (typeof globalThis === "undefined") return undefined;
  const meta = (globalThis as any).importMeta as EnvCarrier | undefined;
  if (meta?.env) return meta;
  return (globalThis as any).import_meta as EnvCarrier | undefined;
}

const metaEnv = getImportMetaEnv()?.env ?? {};

export function getEnvString(key: string, fallback = ""): string {
  const value = (metaEnv as Record<string, unknown>)[key];
  if (typeof value === "string") return value;
  if (typeof process !== "undefined") {
    const nodeValue = (process as any)?.env?.[key];
    if (typeof nodeValue === "string") return nodeValue;
  }
  return fallback;
}

export function getEnvMode(): string {
  const mode = getEnvString("MODE", "");
  if (mode) return mode;
  const nodeEnv =
    typeof process !== "undefined" ? (process as any).env?.NODE_ENV : "";
  return typeof nodeEnv === "string" ? nodeEnv : "";
}

export function isDevMode(): boolean {
  const meta = getImportMetaEnv();
  if (typeof meta?.env?.DEV === "boolean") return meta.env.DEV;
  if (typeof meta?.DEV === "boolean") return meta.DEV;
  return getEnvMode() === "development";
}

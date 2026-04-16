export interface ISessionManager {
    createSession(): string;
    endSession(sessionId: string): void;
    isValidSession(sessionId: string): boolean;
}
export declare class SessionManager implements ISessionManager {
    private static instance;
    private activeSessions;
    static getInstance(): SessionManager;
    static destroyInstance(): void;
    createSession(): string;
    endSession(sessionId: string): void;
    isValidSession(sessionId: string): boolean;
    cleanup(): void;
}
export declare const sessionManager: SessionManager;
export default SessionManager;
//# sourceMappingURL=SessionManager.d.ts.map
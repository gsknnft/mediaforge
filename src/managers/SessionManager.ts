import { nanoid } from 'nanoid';

export interface ISessionManager {
  createSession(): string;
  endSession(sessionId: string): void;
  isValidSession(sessionId: string): boolean;
}

export class SessionManager implements ISessionManager {
  private static instance: SessionManager | null = null;
  private activeSessions: Map<string, number> = new Map();


  public static getInstance(): SessionManager {
    if (!this.instance) {
      this.instance = new SessionManager();
    }
    return this.instance;
  }

  public static destroyInstance(): void {
    this.instance = null;
  }

  public createSession(): string {
    const sessionId = nanoid();
    this.activeSessions.set(sessionId, Date.now());
    return sessionId;
  }

  public endSession(sessionId: string): void {
    if (this.isValidSession(sessionId)) {
      this.activeSessions.delete(sessionId);
    }
  }

  public isValidSession(sessionId: string): boolean {
    return this.activeSessions.has(sessionId);
  }

  public cleanup(): void {
    // End all active sessions
    this.activeSessions.forEach((_, sessionId) => {
      this.endSession(sessionId);
    });
    this.activeSessions.clear();
  }
}

export const sessionManager = SessionManager.getInstance();
export default SessionManager;

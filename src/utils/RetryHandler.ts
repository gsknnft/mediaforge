// RetryHandler for encapsulating retry logic
class RetryHandler {
  protected retries: number;
  protected delay: number;
  protected backoffFactor: number;

  constructor(retries = 3, delay = 500, backoffFactor = 2) {
    this.retries = retries;
    this.delay = delay;
    this.backoffFactor = backoffFactor;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let attempts = 0;
    let currentDelay = this.delay;

    while (attempts < this.retries) {
      try {
        return await fn();
      } catch (error) {
        attempts++;
        if (attempts >= this.retries) throw error;
        await this.delayExecution(currentDelay);
        currentDelay *= this.backoffFactor;
      }
    }
    throw new Error("RetryHandler exhausted all retries");
  }

  protected delayExecution(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

class EnhancedRetryHandler extends RetryHandler {
  private jitterFactor: number;

  constructor(retries = 3, delay = 500, backoffFactor = 2, jitterFactor = 0.1) {
    super(retries, delay, backoffFactor);
    this.jitterFactor = jitterFactor;
  }

  private applyJitter(delay: number): number {
    const jitter = delay * this.jitterFactor * (Math.random() - 0.5);
    return delay + jitter;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let attempts = 0;
    let currentDelay = this.delay;

    while (attempts < this.retries) {
      try {
        return await fn();
      } catch (error) {
        attempts++;
        if (attempts >= this.retries) throw error;
        const jitteredDelay = this.applyJitter(currentDelay);
        await this.delayExecution(jitteredDelay);
        currentDelay *= this.backoffFactor;
      }
    }
    throw new Error("EnhancedRetryHandler exhausted all retries");
  }
}

// Fetch utility using RetryHandler
async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retries = 3,
  delay = 500
): Promise<Response> {
  const retryHandler = new RetryHandler(retries, delay);
  return retryHandler.execute(() => fetch(url, options));
}


export {
  RetryHandler,
  EnhancedRetryHandler,
  fetchWithRetry,
};

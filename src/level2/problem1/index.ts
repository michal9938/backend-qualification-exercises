export class ExecutionCache<TInputs extends Array<unknown>, TOutput> {
  private readonly cache = new Map<string, Promise<TOutput>>();

  constructor(private readonly handler: (...args: TInputs) => Promise<TOutput>) {}

  async fire(key: string, ...args: TInputs): Promise<TOutput> {
    const existing = this.cache.get(key);
    if (existing) {
      return existing;
    }

    const promise = this.handler(...args);
    this.cache.set(key, promise);
    return promise;
  }
}

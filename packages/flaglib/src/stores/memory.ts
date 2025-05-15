import { FlagStore } from "./flagStore"

export class MemoryFlagStore implements FlagStore {
  private flags: Record<string, boolean>

  constructor(initialFlags: Record<string, boolean>) {
    this.flags = { ...initialFlags }
  }

  async isFeatureEnabled(featureName: string): Promise<boolean> {
    return Promise.resolve(!!this.flags[featureName])
  }

  setFlags(flags: Record<string, boolean>) {
    this.flags = { ...this.flags, ...flags }
  }
}

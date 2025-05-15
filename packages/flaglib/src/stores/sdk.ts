import { FlagStore } from "./flagStore"

export interface SdkClient {
  isEnabled(featureName: string): boolean | Promise<boolean>
}

export class SdkFlagStore implements FlagStore {
  constructor(private client: SdkClient) {}

  async isFeatureEnabled(featureName: string): Promise<boolean> {
    const result = this.client.isEnabled(featureName)
    return Promise.resolve(result)
  }
}

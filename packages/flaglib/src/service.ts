import { FlagStore } from "./stores/flagStore"

export class FeatureFlagService {
  private stores: FlagStore[]

  constructor(stores: FlagStore[]) {
    this.stores = stores
  }

  async isEnabled(featureName: string): Promise<boolean> {
    for (const store of this.stores) {
      try {
        const enabled = await store.isFeatureEnabled(featureName)
        if (enabled) {
          return true
        }
      } catch (e) {
        console.warn("FlagStore error", e)
      }
    }
    return false
  }
}

export interface FlagStore {
  isFeatureEnabled(featureName: string): Promise<boolean>
}

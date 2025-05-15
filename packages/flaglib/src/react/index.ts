import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { FeatureFlagService } from "../service"

interface FeatureFlagContextValue {
  enabled: boolean
  loading: boolean
}

export const FlagContext = createContext<FeatureFlagService | null>(null)

export interface FeatureFlagProviderProps {
  service: FeatureFlagService
  featureName: string
  children: ReactNode
}

export function useFeatureFlag(featureName: string): FeatureFlagContextValue {
  const service = useContext(FlagContext)
  if (!service) {
    throw new Error("FeatureFlagProvider 가 필요합니다")
  }

  const [state, setState] = useState<FeatureFlagContextValue>({
    enabled: false,
    loading: true,
  })

  useEffect(() => {
    service
      .isEnabled(featureName)
      .then((enabled) => setState({ enabled, loading: false }))
      .catch(() => setState({ enabled: false, loading: false }))
  }, [service, featureName])

  return state
}

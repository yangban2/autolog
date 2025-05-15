import { ReactNode } from "react"
import { FlagContext } from "."
import { FeatureFlagService } from "../service"

export function FeatureFlagProvider({
  service,
  children,
}: {
  service: FeatureFlagService
  children: ReactNode
}): JSX.Element {
  return <FlagContext.Provider value={service}>{children}</FlagContext.Provider>
}

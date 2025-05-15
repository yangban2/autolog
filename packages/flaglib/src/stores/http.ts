import { FlagStore } from "./flagStore"

export interface HttpStoreOptions {
  url: string
  fetcher?: (url: string) => Promise<any>
}

export class HttpFlagStore implements FlagStore {
  private url: string
  private fetcher: (url: string) => Promise<any>

  constructor(options: HttpStoreOptions) {
    this.url = options.url
    this.fetcher = options.fetcher ?? fetch.bind(window)
  }

  async isFeatureEnabled(featureName: string): Promise<boolean> {
    const res = await this.fetcher(
      `${this.url}/${encodeURIComponent(featureName)}`
    )
    if (!res.ok) {
      throw new Error(`HTTP flag fetch failed: ${res.status}`)
    }
    const body = await res.json()
    return Boolean(body.enabled)
  }
}

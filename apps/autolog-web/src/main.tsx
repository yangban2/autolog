import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import {
  FeatureFlagProvider,
  FeatureFlagService,
  HttpFlagStore,
  MemoryFlagStore,
} from "@yangban2/flaglib"
import "./index.css"

const flagService = new FeatureFlagService([
  // memory 기반
  new MemoryFlagStore({ a: true }),
  // api 기반
  new HttpFlagStore({
    url: "https://autolog-api.fly.dev/api",
  }),
  //
])

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <FeatureFlagProvider service={flagService}>
      <App />
    </FeatureFlagProvider>
  </React.StrictMode>
)

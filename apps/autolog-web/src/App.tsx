import { useFeatureFlag } from "@yangban2/flaglib"
import ReviewChatUI from "./components/ReviewChatUI"

function App() {
  const { enabled, loading } = useFeatureFlag("new-feature")

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <div className="overflow-y-auto w-full">
        {enabled ? <ReviewChatUI /> : <div>구식 feature...</div>}
      </div>
    </div>
  )
}

export default App

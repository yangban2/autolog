import { useState } from "react"
import PreviewPanel from "./components/PreviewPanel"
import UploadPanel from "./components/UploadPanel"

function App() {
  const [review, setReview] = useState("")

  return (
    <div className="flex h-screen">
      <div className="w-1/2 border-r border-gray-300 p-6 overflow-y-auto">
        <UploadPanel setHtmlReview={setReview} />
      </div>
      <div className="w-1/2 p-6 overflow-y-auto">
        <PreviewPanel review={review} />
      </div>
    </div>
  )
}

export default App

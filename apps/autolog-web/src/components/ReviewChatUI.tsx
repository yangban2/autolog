// GPT-style ReviewChatUI – 멀티턴 Vision 기반
import React, { useRef, useState, useEffect } from "react"
import { callGptApi } from "../apis/gpt"

interface ImageWithMeta {
  file: File
  previewUrl: string
}

interface Message {
  role: "user" | "gpt"
  content: string
  images?: ImageWithMeta[]
}

const ReviewChatUI: React.FC = () => {
  const [chatLog, setChatLog] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [images, setImages] = useState<ImageWithMeta[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatLog])

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)
    const newImages = fileArray.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    setImages(newImages)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleImageUpload(e.dataTransfer.files)
  }

  const handleGenerateStart = async () => {
    if (images.length === 0 || input.trim() === "") return

    setIsLoading(true)

    const newChatLog: Message[] = [
      {
        role: "user",
        content: input,
        images,
      },
    ]

    const formData = new FormData()
    formData.append("chatLog", JSON.stringify(newChatLog))
    images.forEach((img) => formData.append("images", img.file))

    try {
      const html = await callGptApi(formData)
      setChatLog([...newChatLog, { role: "gpt", content: html }])
      setStarted(true)
      setInput("")
      setImages([])
    } catch (err) {
      alert("리뷰 생성에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    const updatedLog = [...chatLog, userMessage]
    setChatLog(updatedLog)
    setInput("")
    setIsLoading(true)

    const formData = new FormData()
    formData.append("chatLog", JSON.stringify(updatedLog))

    try {
      const html = await callGptApi(formData)
      setChatLog([...updatedLog, { role: "gpt", content: html }])
    } catch (err) {
      alert("리뷰 생성에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!started) {
    return (
      <div
        className="h-screen flex flex-col items-center justify-center gap-6 p-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div
          className="border-2 border-dashed border-gray-400 rounded-lg w-72 min-h-[12rem] p-2 flex flex-col items-center justify-center text-center cursor-pointer bg-white shadow"
          onClick={() => document.getElementById("file-input")?.click()}
        >
          {images.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative group w-20 h-20">
                  <img
                    src={img.previewUrl}
                    alt={`preview-${i}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-40 rounded opacity-0 group-hover:opacity-40 transition-opacity flex items-center justify-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      setImages((prev) =>
                        prev.filter((_, index) => index !== i)
                      )
                    }}
                  >
                    <span className="text-white text-xl font-bold">×</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-500">
              여기로 드래그하거나
              <br />
              클릭하여 이미지 업로드
            </span>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          id="file-input"
          onChange={(e) => handleImageUpload(e.target.files)}
        />

        <textarea
          className="w-[50vw] border p-2 rounded min-h-[100px]"
          placeholder="작성에 참고할 프롬프트를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          disabled={images.length === 0 || input.trim() === "" || isLoading}
          className={`bg-blue-600 text-white px-6 py-2 rounded ${isLoading ? "animate-pulse" : ""} disabled:opacity-50`}
          onClick={handleGenerateStart}
        >
          {isLoading ? "..." : "시작하기"}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chatLog.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded ${msg.role === "user" ? "bg-blue-100 self-end" : "bg-white self-start border"}`}
          >
            {msg.images && (
              <div className="flex flex-wrap gap-2 mb-2">
                {msg.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.previewUrl}
                    alt={`preview-${i}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: msg.content }} />
          </div>
        ))}
        {isLoading && (
          <div className="p-3 rounded bg-gray-200 animate-pulse">
            GPT가 작성 중입니다...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 space-y-2 bg-white">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="리뷰에 추가로 원하는 내용을 입력하세요..."
            className="flex-1 border p-2 rounded min-h-[60px]"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60 ${isLoading ? "animate-pulse" : ""}`}
          >
            {isLoading ? "..." : "입력"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewChatUI

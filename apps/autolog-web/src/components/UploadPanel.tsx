import React, { useState } from "react"
import { callGptApi } from "../apis/gpt"

export type ImageWithMeta = {
  file: File
  previewUrl: string
  description: string
}

interface Props {
  setHtmlReview: (html: string) => void
}

const UploadPanel: React.FC<Props> = ({ setHtmlReview }) => {
  const [images, setImages] = useState<ImageWithMeta[]>([])
  const [storeName, setStoreName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [category, setCategory] = useState("")
  const [tone, setTone] = useState("")
  const [userNote, setUserNote] = useState("")
  const [tookExterior, setTookExterior] = useState(true)
  const [tookInterior, setTookInterior] = useState(true)
  const [rating, setRating] = useState("")
  const [ratingText, setRatingText] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const newImages = files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        description: "",
      }))
      setImages(newImages)
    }
  }

  const handleGenerateReview = async () => {
    if (!storeName.trim()) {
      alert("가게 이름은 필수입니다.")
      return
    }

    const formData = new FormData()
    images.forEach((img) => formData.append("images", img.file))
    formData.append("storeName", storeName)
    formData.append("phoneNumber", phoneNumber)
    formData.append("category", category)
    formData.append("tone", tone)
    formData.append("userNote", userNote)
    formData.append("tookExterior", String(tookExterior))
    formData.append("tookInterior", String(tookInterior))
    formData.append("rating", rating)
    formData.append("ratingText", ratingText)

    // 이미지 설명은 JSON 문자열로
    const descriptions = images.map((img) => img.description)
    formData.append("imageDescriptions", JSON.stringify(descriptions))

    try {
      const html = await callGptApi(formData)
      setHtmlReview(html)
    } catch (err) {
      console.error(err)
      alert("리뷰 생성에 실패했습니다.")
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">📤 사진 업로드 및 정보 입력</h2>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
      />
      <div className="pb-2 w-full">
        {images.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">📸 이미지 설명</h3>
            {images.map((img, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <img
                  src={img.previewUrl}
                  alt={`preview-${idx}`}
                  className="w-28 h-28 object-cover rounded"
                />
                <input
                  type="text"
                  value={img.description}
                  onChange={(e) => {
                    const updated = [...images]
                    updated[idx].description = e.target.value
                    setImages(updated)
                  }}
                  placeholder={`이미지 ${idx + 1} 설명`}
                  className="flex-1 border p-2 rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="가게 이름"
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        placeholder="전화번호"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full p-2 border rounded"
      />

      {/* 리뷰 카테고리 */}
      <div>
        <label className="block text-sm font-medium mb-1">리뷰 카테고리</label>
        <select
          className="w-full border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">선택 안함</option>
          <option value="카페">카페</option>
          <option value="맛집">맛집</option>
          <option value="혼밥">혼밥</option>
          <option value="데이트">데이트</option>
          <option value="술집">술집</option>
        </select>
      </div>

      {/* 말투 스타일 */}
      <div>
        <label className="block text-sm font-medium mb-1">리뷰어</label>
        <select
          className="w-full border p-2 rounded"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option value="남편">남편</option>
          <option value="아내">아내</option>
          <option value="하루담기">하루담기</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="block font-medium">📌 특이사항</label>
        <div className="flex items-center gap-4">
          <label>
            <input
              type="checkbox"
              checked={tookExterior}
              onChange={(e) => setTookExterior(e.target.checked)}
            />
            <span className="ml-1">가게 외관 찍음</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={tookInterior}
              onChange={(e) => setTookInterior(e.target.checked)}
            />
            <span className="ml-1">인테리어 찍음</span>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block font-medium">🌟 총평</label>
        <select
          className="w-full border p-2 rounded"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="">총평 선택</option>
          <option value="역대급">역대급</option>
          <option value="매우 훌륭">매우 훌륭</option>
          <option value="맛있다">맛있다</option>
          <option value="그저 그럼">그저 그럼</option>
          <option value="맛없다">맛없다</option>
        </select>

        <textarea
          value={ratingText}
          onChange={(e) => setRatingText(e.target.value)}
          placeholder="총평에 대한 간단한 설명"
          className="w-full border p-2 rounded min-h-[80px]"
        />
      </div>

      {/* 기타 설명 */}
      <div>
        <label className="block text-sm font-medium mb-1">기타 요청사항</label>
        <textarea
          className="w-full border p-2 rounded min-h-[100px]"
          value={userNote}
          onChange={(e) => setUserNote(e.target.value)}
          placeholder="예: 단체석 강조해줘요 / 강아지 동반 가능 꼭 써줘요"
        />
      </div>

      <button
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        onClick={handleGenerateReview}
      >
        리뷰 생성
      </button>
    </div>
  )
}

export default UploadPanel

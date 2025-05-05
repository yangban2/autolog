import Markdown from "react-markdown"

interface PreviewPanelProps {
  review: string
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ review }) => {
  const handleCopyToClipboard = async () => {
    if (!review) return

    try {
      await navigator.clipboard.writeText(review)
      alert("리뷰가 클립보드에 복사되었습니다!")
    } catch (err) {
      console.error("복사 실패:", err)
      alert("복사에 실패했습니다. 브라우저 권한을 확인하세요.")
    }
  }

  return (
    <div className="space-y-4">
      <div className="border p-4 rounded bg-white shadow prose max-w-none">
        {review ? (
          <Markdown>{review}</Markdown>
        ) : (
          <p className="text-gray-500">
            GPT가 생성한 리뷰가 여기에 표시됩니다.
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleCopyToClipboard}
          className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
        >
          📋 리뷰 복사
        </button>
      </div>
    </div>
  )
}

export default PreviewPanel

export const callGptApi = async (formData: FormData): Promise<string> => {
  const response = await fetch("https://autolog-api.fly.dev/api/review", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("GPT API 호출 실패")
  }

  const data = await response.json()
  return data.html // HTML 리뷰
}

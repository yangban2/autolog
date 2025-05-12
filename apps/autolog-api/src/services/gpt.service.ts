import { OpenAI } from "openai"
import { ENV } from "../config/env"
import { INSTRUCTIONS } from "../constants"

const openai = new OpenAI({ apiKey: ENV.OPENAI_API_KEY })

export const generateHtmlReview = async (prompt: string): Promise<string> => {
  const completion = await openai.responses.create({
    // max_output_tokens: 2048,
    // instructions: INSTRUCTIONS,
    model: "gpt-4o-2024-11-20",
    tools: [],
    input: [
      {
        role: "user",
        content: prompt,
      },
    ],
  })

  return completion.output_text ?? ""
}

export const generateHtmlReviewWithImages = async (
  prompt: string,
  base64Images: string[]
) => {
  const content = [
    { type: "text", text: prompt },
    ...base64Images.map((data) => ({
      type: "image_url",
      image_url: { url: data }, // base64 data URL
    })),
  ]

  const res = await openai.chat.completions.create({
    model: "gpt-4o", // 반드시 vision 지원 모델
    messages: [{ role: "user", content: JSON.stringify(content) }],
    temperature: 0.7,
    max_tokens: 1500,
  })

  return res.choices[0].message.content || ""
}

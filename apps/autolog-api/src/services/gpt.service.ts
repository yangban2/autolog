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

export const generateHtmlReviewWithUrls = async (
  prompt: string,
  urls: string[]
) => {
  const content = [
    { type: "text", text: prompt },
    ...urls.map((url) => ({
      type: "image_url",
      image_url: { url },
    })),
  ]

  const res = await openai.chat.completions.create({
    model: "gpt-4o", // Vision 모델
    messages: [{ role: "user", content: JSON.stringify(content) }],
    temperature: 0.7,
    max_tokens: 1500,
  })

  return res.choices[0].message.content || ""
}

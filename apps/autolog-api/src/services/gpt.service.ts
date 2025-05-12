import { OpenAI } from "openai"
import { ENV } from "../config/env"
import { INSTRUCTIONS } from "../constants"
import { ChatCompletionMessageParam } from "openai/resources/chat"

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

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } }

export async function generateHtmlReviewWithContext(
  messages: {
    role: string
    content: ContentPart[]
  }[]
) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages as ChatCompletionMessageParam[],
    temperature: 0.7,
    max_tokens: 1500,
  })

  return res.choices[0].message.content || ""
}

import { OpenAI } from "openai"
import { ENV } from "../config/env"
import { INSTRUCTIONS } from "../constants"

const openai = new OpenAI({ apiKey: ENV.OPENAI_API_KEY })

export const generateHtmlReview = async (prompt: string): Promise<string> => {
  const completion = await openai.responses.create({
    max_output_tokens: 2048,
    instructions: INSTRUCTIONS,
    model: "gpt-4.1-mini-2025-04-14",
    tools: [],
    input: [
      {
        role: "user",
        content: prompt,
      },
    ],
    // messages: [
    //   {
    //     role: "system",
    //     content: `
    //     당신은 네이버 블로그 SEO 전문가입니다.
    //     `,
    //   },
    //   {
    //     role: "user",
    //     content: prompt,
    //   },
    //   {
    //     role: "assistant",
    //     content: `
    //     1) SEO가 적용된 블로그 글을 작성해 주세요. \
    //     2) 네이버 SEO를 고려하여 글의 제목을 추천해 주세요. \
    //     3) 추천 해시태그를 작성된 글의 끝 부분에 추가해 주세요. \
    //     4) 친근한 어투를 사용해 주세요. \
    //     5) 자기 소개를 넣지 마세요.(예 : 000 전문가입니다, SEO 전문가입니다) \
    //     6) SEO를 고려해서 글을 작성한다는 것을 밝히지 마세요. \
    //     7) 제목은 최대 20자, 블로그 글은 4~5개의 문단으로 구성하고 최대 1000자 정도로 작성해 주세요.
    //     8) 제목은 다음 형식으로 작성해야 합니다. "[리뷰 종류] 글 제목"
    //     `,
    //   },
    // ],
    // temperature: 0.7,
  })

  console.log("GPT-4.1 Completion:", completion)

  return completion.output_text ?? ""
}

import { Router } from "express"
import fs from "fs"
import multer from "multer"

import { generateHtmlReviewWithContext } from "../services/gpt.service"
import { uploadFileToS3 } from "../services/s3.service"
import { ChatCompletionMessageParam } from "openai/resources/chat"

const router = Router()
const upload = multer({ dest: "uploads/" })

router.post("/review", upload.array("images"), async (req, res) => {
  try {
    const { chatLog } = req.body
    const files = req.files as Express.Multer.File[]

    if (!chatLog) {
      res.status(400).json({ error: "chatLog가 필요합니다." })
    }

    const parsedLog = JSON.parse(chatLog) as {
      role: "user" | "gpt"
      content: string
      images?: string[]
    }[]

    const imageUrls: string[] = []
    for (const file of files) {
      const url = await uploadFileToS3(file.path, file.originalname)
      imageUrls.push(url)
    }

    // 임시 파일 삭제
    files.forEach((file) => fs.unlinkSync(file.path))

    const messages = parsedLog.map((msg, idx) => {
      const isFirstUserWithImages =
        msg.role === "user" && idx === 0 && imageUrls.length > 0

      const content: ChatCompletionMessageParam["content"] =
        isFirstUserWithImages
          ? [
              { type: "text", text: `${msg.content} (한국어로 써줘)` },
              ...imageUrls.map((url) => ({
                type: "image_url" as const,
                image_url: { url },
              })),
            ]
          : [{ type: "text", text: msg.content }]

      return {
        role: msg.role === "gpt" ? "assistant" : msg.role,
        content,
      }
    })

    const html = await generateHtmlReviewWithContext(messages as any)
    res.json({ html })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "리뷰 생성 실패" })
  }
})

export default router

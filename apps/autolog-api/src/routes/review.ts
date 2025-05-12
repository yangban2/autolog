import { Router } from "express"
import fs from "fs"
import multer from "multer"

import { generateHtmlReviewWithUrls } from "../services/gpt.service"
import { uploadFileToS3 } from "../services/s3.service"

const router = Router()
const upload = multer({ dest: "uploads/" })

router.post("/review", upload.array("images"), async (req, res) => {
  try {
    const { prompt } = req.body
    const files = req.files as Express.Multer.File[]

    if (!prompt) {
      res.status(400).json({ error: "프롬프트가 필요합니다." })
    }

    // const base64Images = await Promise.all(
    //   files.map(async (file) => {
    //     const buffer = fs.readFileSync(file.path)
    //     fs.unlinkSync(file.path)
    //     return `data:image/${file.mimetype.split("/")[1]};base64,${buffer.toString("base64")}`
    //   })
    // )

    const imageUrls: string[] = []
    for (const file of files) {
      const url = await uploadFileToS3(file.path, file.originalname)
      imageUrls.push(url)
    }

    // 임시 파일 삭제
    files.forEach((file) => fs.unlinkSync(file.path))

    const html = await generateHtmlReviewWithUrls(prompt, imageUrls)
    res.json({ html })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "리뷰 생성 실패" })
  }
})

export default router

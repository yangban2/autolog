import express, { Request, Response } from "express"
import cors from "cors"
import multer from "multer"
import fs from "fs"
import exif from "exif-parser"

const app = express()
const upload = multer({ dest: "uploads/" })

app.use(cors())

app.post("/upload", upload.single("photo"), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).send("파일이 없습니다.")
    return
  }

  const buffer = fs.readFileSync(req.file.path)
  const parser = exif.create(buffer)
  const result = parser.parse()

  res.json({ exif: result.tags })
})

app.listen(4000, () => {
  console.log("🚀 API 서버 실행 중: http://localhost:4000")
})

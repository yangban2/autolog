import express, { Request, Response } from "express"
import cors from "cors"
import multer from "multer"
import fs from "fs"
import exif from "exif-parser"
import reviewRoute from "./routes/review"
import testRoute from "./routes/test"

const app = express()
const upload = multer({ dest: "uploads/" })

app.use(cors())
app.use(express.json())
app.use("/api", [reviewRoute, testRoute])

app.post("/upload", upload.array("photos"), (req: Request, res: Response) => {
  if (!req.files || !(req.files instanceof Array)) {
    res.status(400).send("파일이 없습니다.")
    return
  }

  const results = req.files.map((file) => {
    const buffer = fs.readFileSync(file.path)
    const parser = exif.create(buffer)
    const result = parser.parse()
    fs.unlinkSync(file.path) // 업로드된 파일 삭제
    return { fileName: file.originalname, exif: result.tags }
  })

  res.json(results)
})

app.listen(3000, () => {
  console.log("🚀 API 서버 실행 중: http://localhost:3000")
})

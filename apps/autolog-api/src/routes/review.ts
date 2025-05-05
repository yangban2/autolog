import { Router } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"

import { extractExif } from "../services/exif.service"
import { generateHtmlReview } from "../services/gpt.service"
import { reverseGeocode } from "../services/geocode.service"
import { uploadFileToS3 } from "../services/s3.service"
import { formatExifDate } from "../utils/format"

const router = Router()

const upload = multer({ dest: "uploads/" })

router.post("/review", upload.array("images"), async (req, res) => {
  try {
    const {
      storeName,
      phoneNumber,
      category,
      tone,
      userNote,
      tookExterior,
      tookInterior,
      rating,
      ratingText,
      imageDescriptions,
    } = req.body
    const files = req.files as Express.Multer.File[]

    const firstFilePath = files[0]?.path
    const exif = firstFilePath ? extractExif(firstFilePath) : {}

    const imageDescList = JSON.parse(imageDescriptions || "[]") // 배열

    let location = "알 수 없음"

    if (exif.latitude && exif.longitude) {
      const address = await reverseGeocode(exif.latitude, exif.longitude)
      if (address) location = address
    }

    const imageUrls: string[] = []
    for (const file of files) {
      const url = await uploadFileToS3(file.path, file.originalname)
      imageUrls.push(url)
    }

    // 이미지 URL + 설명 조합
    const imageInfos = imageUrls.map((url, i) => ({
      url,
      description: imageDescList[i] || `이미지 ${i + 1}`,
    }))

    // 임시 파일 삭제
    files.forEach((file) => fs.unlinkSync(file.path))

    // 프롬프트 생성
    const prompt = `
    다음은 블로그 리뷰를 작성하기 위한 정보입니다:
    
    - 가게 이름: ${storeName}
    - 전화번호: ${phoneNumber || "없음"}
    - 카테고리: ${category || "미지정"}
    - 리뷰어: ${tone} 
    (리뷰어가 남편일 때는 https://blog.naver.com/dailydamgi/223856207202 이 글을 참고하고, 
    리뷰어가 아내이거나 하루담기일 때는 https://blog.naver.com/dailydamgi/223851745159 이 글을 참고해줘.)
    - 위치: ${location}
    - 촬영 시간: ${formatExifDate(exif.date) || "알 수 없음"}
    - 외관 사진: ${tookExterior === "true" ? "찍음" : "못 찍음"}
    - 인테리어 사진: ${tookInterior === "true" ? "찍음" : "못 찍음"}
    - 총평: ${rating} / ${ratingText || "간단 총평 없음"}
    - 유저 요청: ${userNote || "없음"}
    
    [사진 설명 목록]
    ${imageInfos.map((img, i) => `- 이미지 ${i + 1}: ${img.description} (${img.url})`).join("\n")}
    
    이 정보를 참고하여 마크다운(Markdown) 형식의 블로그 리뷰를 작성해주세요.
    각 이미지 설명 뒤에는 반드시 마크다운 이미지 태그를 넣어주세요.
    친근하고 감성적인 블로거 말투로 써 주세요.
    `

    const html = await generateHtmlReview(prompt)

    res.json({ html })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "리뷰 생성 실패" })
  }
})

export default router

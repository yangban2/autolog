import { s3 } from "../config/aws"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { ENV } from "../config/env"

export const uploadFileToS3 = async (
  filePath: string,
  originalName: string
): Promise<string> => {
  const fileStream = fs.createReadStream(filePath)
  const ext = path.extname(originalName)
  const key = `uploads/${uuidv4()}${ext}`

  const uploadCommand = new PutObjectCommand({
    Bucket: ENV.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: fileStream,
    ContentType: getMimeType(ext),
  })

  console.log(`Uploading to S3... ${key}`)
  await s3.send(uploadCommand)

  const publicUrl = `https://debx85xqr1xjc.cloudfront.net/${key}`
  console.log(`File uploaded successfully. Public URL: ${publicUrl}`)
  return publicUrl
}

const getMimeType = (ext: string): string => {
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
  }
  return map[ext.toLowerCase()] || "application/octet-stream"
}

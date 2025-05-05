import dotenv from "dotenv"
dotenv.config()

export const ENV = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY || "",
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  AWS_REGION: process.env.AWS_REGION || "",
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || "",
}

console.log(ENV.AWS_REGION)

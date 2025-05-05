import fs from "fs"
import exifParser from "exif-parser"

export const extractExif = (
  filePath: string
): { latitude?: number; longitude?: number; date?: string } => {
  const buffer = fs.readFileSync(filePath)
  const parser = exifParser.create(buffer)
  const result = parser.parse()

  const gps = result.tags

  const latitude = gps.GPSLatitude
  const longitude = gps.GPSLongitude
  const date = gps.DateTimeOriginal

  return { latitude, longitude, date }
}

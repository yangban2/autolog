declare module "exif-parser" {
  interface ExifTags {
    [key: string]: any
  }

  interface ExifResult {
    tags: ExifTags
    imageSize: { width: number; height: number }
    thumbnailOffset?: number
    thumbnailLength?: number
    thumbnailBuffer?: Buffer
  }

  interface ExifParser {
    parse(): ExifResult
  }

  function create(buffer: Buffer): ExifParser

  export { create, ExifParser, ExifResult, ExifTags }
}

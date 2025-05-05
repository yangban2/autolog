import axios from "axios"
import { ENV } from "../config/env"

export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<string | null> => {
  try {
    const res = await axios.get(
      "https://dapi.kakao.com/v2/local/geo/coord2address.json",
      {
        headers: {
          Authorization: `KakaoAK ${ENV.KAKAO_REST_API_KEY}`,
        },
        params: {
          y: lat,
          x: lon,
        },
      }
    )

    const address1 = res.data.documents?.[0]?.address?.region_1depth_name
    const address2 = res.data.documents?.[0]?.address?.region_2depth_name
    const address3 = res.data.documents?.[0]?.address?.region_3depth_name
    const address = `${address1} ${address2} ${address3}`
    return address ?? null
  } catch (err) {
    console.error("역지오코딩 실패:", err)
    return null
  }
}

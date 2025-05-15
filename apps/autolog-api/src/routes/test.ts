import { getRandomValues } from "crypto"
import { Router } from "express"

const router = Router()

router.get("/new-feature", (_, res) => {
  const random = getRandomValues(new Uint8Array(1))
  const randomValue = random[0] % 10
  const enabled = randomValue < 7

  res.json({ enabled })
})

export default router

import axios from "axios"

export const client = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

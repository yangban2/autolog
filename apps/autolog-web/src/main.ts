const form = document.getElementById("upload-form") as HTMLFormElement
const result = document.getElementById("result") as HTMLPreElement

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const input = document.getElementById("photo") as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const formData = new FormData()
  formData.append("photo", input.files[0])

  result.textContent = "업로드 중..."

  try {
    const res = await fetch("http://localhost:4000/upload", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()
    result.textContent = JSON.stringify(data, null, 2)
  } catch (err) {
    result.textContent = `에러: ${err}`
  }
})

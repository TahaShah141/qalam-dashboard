import fetch from "node-fetch"

export const notify = (message: string) => {
  fetch('https://redirects-141.vercel.app/api/notify', {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ message })
  })
}
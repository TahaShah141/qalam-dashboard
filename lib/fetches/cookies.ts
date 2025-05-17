import { CredentialsType } from "../types";

export const updateCookies = async (credentials: CredentialsType) => {
  const { verified, cookies } = await fetchCookies(credentials)
  if (!verified) {
    localStorage.removeItem("login")
    localStorage.removeItem("password")
  } else {
    localStorage.setItem("cookies", cookies)
  }
}

export const fetchCookies = async (credentials: CredentialsType) => {
  const { verified, cookies } = await (await fetch("/api/login", {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({credentials})
  })).json()

  return { verified, cookies }
}
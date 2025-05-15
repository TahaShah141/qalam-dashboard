import { CredentialsType } from "../types";

export const fetchCookies = async (credentials: CredentialsType) => {
  const { verified, cookies } = await (await fetch("/api/login", {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({credentials})
  })).json()

  return { verified, cookies }
}
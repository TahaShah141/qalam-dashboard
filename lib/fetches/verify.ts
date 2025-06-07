import { CredentialsType } from "../types"

export const verify = async (credentials: CredentialsType): Promise<{verified: boolean}> => {
  const { verified } = await (await fetch("/api/verify", {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({credentials})
  })).json()

  return { verified }
}
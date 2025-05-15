import { CredentialsType, UserType } from "../types";

export const fetchUserData = async (credentials: CredentialsType, cookies: string): Promise<{user: UserType}> => {
  const { verified } = await (await fetch("/api/verify", {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({credentials})
  })).json()

  if (verified) {
    const user = await fetchUserFromDB()
    return { user }
  } else {
    const user = await scrapeUserData(credentials, cookies)
    return { user }
  }
}

const fetchUserFromDB = async (): Promise<UserType> => {
  const { node } = await (await fetch("/api/database/qalam-user")).json()
  return JSON.parse(node.value)
}

const scrapeUserData = async (credentials: CredentialsType, cookies: string): Promise<UserType> => {
  const { user } = await (await fetch("/api/scrape/user", {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({credentials, cookies})
  })).json()

  return user
}
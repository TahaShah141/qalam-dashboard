import { CredentialsType } from "./types";

export const isVerified = (credentials: CredentialsType) => {
  return credentials.login === process.env.QALAM_ID && credentials.password === process.env.QALAM_PASSWORD
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CredentialsType } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getLocalCredentials = (): {credentials: CredentialsType} => {
  const credentials: CredentialsType = {
    login: localStorage.getItem("login")!,
    password: localStorage.getItem("password")!
  }
  return { credentials }
}
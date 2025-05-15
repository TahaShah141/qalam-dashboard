"use client"

import { ReactNode, useEffect, useState } from "react"

import { LoginForm } from "./LoginForm"

type AuthenticatorProps = {
  children: ReactNode
}

export const Authenticator = ({children}: AuthenticatorProps) => {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const login = localStorage.getItem("login")
    const password = localStorage.getItem("password")

    if (login && password) {
      setAuthenticated(true)
    }
  }, [])

  if (!authenticated) {
    return <LoginForm setAuthenticated={setAuthenticated}/>
  }

  return (
    <>
      {children}
    </>
  )
}

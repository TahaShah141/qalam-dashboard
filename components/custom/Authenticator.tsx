"use client"

import { ReactNode, useEffect, useState } from "react"

import { LoginForm } from "./LoginForm"

type AuthenticatorProps = {
  children: ReactNode
}

export const Authenticator = ({children}: AuthenticatorProps) => {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const login = localStorage.getItem("login")
    const password = localStorage.getItem("password")

    if (login && password) {
      setAuthenticated(true)
    }
    setChecking(false)
  }, [])

  if (!authenticated && !checking) {
    return <LoginForm setAuthenticated={setAuthenticated}/>
  }

  return (
    <>
      {children}
    </>
  )
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CourseInfoType, CredentialsType } from "./types"

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

export const getLocalCourseInfo = (id: string): {course: CourseInfoType} => {
  const courses = JSON.parse(localStorage.getItem("courses")!) as CourseInfoType[]
  const course = courses.find(c => c.id === id)!
  return { course }
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CourseGradeBookComponentType, CourseInfoType, CredentialsType } from "./types"

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

export const getWeightedAverages = (data: CourseGradeBookComponentType): {average: number, obtained: number} => {

  if (!data) return {
    average: 0,
    obtained: 0
  }

  const average = data.components.filter(c => c.weight !== 0).reduce((acc, cur) => {
    const { weight, components } = cur
    const sumAverage = components.reduce((sum, {maxMarks, averageMarks}) => {
      return sum + averageMarks / maxMarks
    }, 0)
    return acc + weight/100 * sumAverage/components.length
  }, 0)

  const obtained = data.components.filter(c => c.weight !== 0).reduce((acc, cur) => {
    const { weight, components } = cur
    const sumObtained = components.reduce((sum, {maxMarks, obtainedMarks}) => {
      return sum + obtainedMarks / maxMarks
    }, 0)
    return acc + weight/100 * sumObtained/components.length
  }, 0)

  return {average, obtained}
}
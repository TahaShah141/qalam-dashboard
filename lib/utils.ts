import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CourseGradeBookComponentType, CourseGradeBookType, CourseInfoType, CredentialsType } from "./types"

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

  const filteredData = data.components.filter(c => c.weight !== 0 && c.components.length > 0)

  const average = filteredData.reduce((acc, cur) => {
    const { weight, components } = cur
    const filteredComponents = components.filter((c) => c.averageMarks > 0 && c.maxMarks > 0)
    const totalMaxMarks = filteredComponents.reduce((s, c) => s + c.maxMarks, 0)
    const sumAverage = filteredComponents.reduce((sum, {maxMarks, averageMarks}) => {
      return sum + averageMarks / totalMaxMarks
    }, 0)
    return acc + weight/100 * sumAverage
  }, 0)

  const obtained = filteredData.reduce((acc, cur) => {
    const { weight, components } = cur
    const filteredComponents = components.filter((c) => c.averageMarks > 0 && c.maxMarks > 0)
    const totalMaxMarks = filteredComponents.reduce((s, c) => s + c.maxMarks, 0)
    const sumObtained = components.reduce((sum, {maxMarks, obtainedMarks}) => {
      return sum + obtainedMarks / totalMaxMarks
    }, 0)
    return acc + weight/100 * sumObtained
  }, 0)

  return {average, obtained}
}

export const getOverallData = (grades: CourseGradeBookType): CourseGradeBookComponentType => {
  const combinedComponents = grades.flatMap(component => {
    const factor = component.name === "Lecture" ? 0.75 : component.name === "Lab" ? 0.25 : 1
    return component.components.map(sub => ({
      ...sub,
      weight: sub.weight * factor
    }))
  })

  return {
    name: "Overall",
    components: combinedComponents
  }
}
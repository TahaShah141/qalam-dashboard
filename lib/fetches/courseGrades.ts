import { CourseAttendanceType, CourseGradeBookType, CredentialsType } from "../types";

import { verify } from "./verify";

export const fetchCourseGrades = async (id: string, credentials: CredentialsType, cookies: string): Promise<{grades: CourseGradeBookType}> => {
  
  const { verified } = await verify(credentials)

  if (verified) {
    const grades = await fetchCourseGradesFromDB(id)
    if (!grades) return { grades: await scrapeCourseGradesData(id, credentials, cookies)}
    return { grades }
  } else {
    const grades = await scrapeCourseGradesData(id, credentials, cookies)
    return { grades }
  }
}
 
 const fetchCourseGradesFromDB = async (id: string): Promise<CourseGradeBookType | undefined> => {
   const { node } = await (await fetch(`/api/database/course-${id}-grades`)).json()
   if (!node) return undefined
   return JSON.parse(node.value)
 }
 
 export const scrapeCourseGradesData = async (id: string, credentials: CredentialsType, cookies: string): Promise<CourseGradeBookType> => {
   const { grades } = await (await fetch(`/api/scrape/course/${id}/grades`, {
     method: 'POST',
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({credentials, cookies})
   })).json()
 
   return grades
 }
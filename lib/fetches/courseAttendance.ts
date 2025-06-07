import { CourseAttendanceType, CredentialsType } from "../types";

import { verify } from "./verify";

export const fetchCourseAttendance = async (id: string, credentials: CredentialsType, cookies: string): Promise<{attendances: CourseAttendanceType}> => {
  
  const { verified } = await verify(credentials)

  if (verified) {
    const attendances = await fetchCourseAttendanceFromDB(id)
    if (!attendances) return { attendances: await scrapeCourseAttendanceData(id, credentials, cookies)}
    return { attendances }
  } else {
    const attendances = await scrapeCourseAttendanceData(id, credentials, cookies)
    return { attendances }
  }
}
 
 const fetchCourseAttendanceFromDB = async (id: string): Promise<CourseAttendanceType | undefined> => {
   const { node } = await (await fetch(`/api/database/course-${id}-attendance`)).json()
   if (!node) return undefined
   return JSON.parse(node.value)
 }
 
 export const scrapeCourseAttendanceData = async (id: string, credentials: CredentialsType, cookies: string): Promise<CourseAttendanceType> => {
   const { attendances } = await (await fetch(`/api/scrape/course/${id}/attendance`, {
     method: 'POST',
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({credentials, cookies})
   })).json()
 
   return attendances
 }
import { CourseInfoType, CredentialsType } from "../types";

import { verify } from "./verify";

export const fetchCourseInfo = async (credentials: CredentialsType, cookies: string): Promise<{courses: CourseInfoType[], lastUpdated: Date}> => {
  
  const { verified } = await verify(credentials)

  if (verified) {
    const [courses, lastUpdated] = await fetchCourseFromDB()
    return {
      courses,
      lastUpdated
    }
  } else {
    const courses = await scrapeCourseData(credentials, cookies)
    const lastUpdated = new Date(Date.now())
    return {
      courses,
      lastUpdated
    }
  }
}
 
 const fetchCourseFromDB = async (): Promise<[CourseInfoType[], Date]> => {
   const { node } = await (await fetch("/api/database/courses")).json()
   return [JSON.parse(node.value), node.updatedAt]
 }
 
 export const scrapeCourseData = async (credentials: CredentialsType, cookies: string): Promise<CourseInfoType[]> => {
   const { courses } = await (await fetch("/api/scrape/dashboard", {
     method: 'POST',
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({credentials, cookies})
   })).json()
 
   return courses
 }
import { AttendanceType, CredentialsType } from "../types";

export const fetchAttendanceData = async (credentials: CredentialsType, cookies: string): Promise<{courses: AttendanceType[], lastUpdated: Date}> => {
  const { verified } = await (await fetch("/api/verify", {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({credentials})
  })).json()

  if (verified) {
    const [courses, lastUpdated] = await fetchAttendanceFromDB()
    return {
      courses,
      lastUpdated
    }
  } else {
    const courses = await scrapeAttendanceData(credentials, cookies)
    const lastUpdated = new Date(Date.now())
    return {
      courses,
      lastUpdated
    }
  }
}
 
 const fetchAttendanceFromDB = async (): Promise<[AttendanceType[], Date]> => {
   const { node } = await (await fetch("/api/database/attendances")).json()
   return [JSON.parse(node.value), node.updatedAt]
 }
 
 export const scrapeAttendanceData = async (credentials: CredentialsType, cookies: string): Promise<AttendanceType[]> => {
   const { attendances } = await (await fetch("/api/scrape/attendances", {
     method: 'POST',
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({credentials, cookies})
   })).json()
 
   return attendances
 }
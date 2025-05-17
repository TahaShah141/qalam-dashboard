"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CourseInfoType, UserType } from "@/lib/types";
import { fetchCourseInfo, scrapeCourseData } from "@/lib/fetches/courseData";
import { useEffect, useState } from "react";

import { CourseCard } from "@/components/custom/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCard } from "@/components/custom/UserCard";
import { fetchUserData } from "@/lib/fetches/userData";
import { formatDate } from "date-fns"
import { getLocalCredentials } from "@/lib/utils";
import { updateCookies } from "@/lib/fetches/cookies";

export default function Home() {

  const [courses, setCourses] = useState<CourseInfoType[]>([])
  const [lastUpdated, setLastUpdated] = useState("")
  const [loadingCourses, setLoadingCourses] = useState(false)

  useEffect(() => {
    // local data
    const cookies = localStorage.getItem("cookies")
    console.log({cookies})
    const { credentials } = getLocalCredentials()
    
    // Fetch Courses
    const fetchCourses = async () => {
      const cookies = localStorage.getItem("cookies")
      setLoadingCourses(true)
      const { courses, lastUpdated } = await fetchCourseInfo(credentials, cookies!)
      
      localStorage.setItem("courses", JSON.stringify(courses))
      setCourses(courses)
      setLastUpdated(formatDate(lastUpdated, "HH:mm, do MMM"))
      setLoadingCourses(false)
    }
    
    // Fetch User
    const fetchUser = async () => {
      const cookies = localStorage.getItem("cookies")
      setLoadingUser(true)
      const localUser = localStorage.getItem("qalam-user")
      if (localUser) {
        setUser(JSON.parse(localUser))
        setLoadingUser(false)
        return;
      }
      const { user } = await fetchUserData(credentials, cookies!)
      setUser(user)
      localStorage.setItem("qalam-user", JSON.stringify(user))
      setLoadingUser(false)
    }

    const effectFunctions = async () => {
      if (!cookies) await updateCookies(credentials)
      fetchCourses()
      fetchUser()
    }
    effectFunctions()
  }, [])

  
  const [user, setUser] = useState<UserType>()
  const [loadingUser, setLoadingUser] = useState(false)
  
  const reloadContent = async () => {
    setLoadingCourses(true)
    const { credentials } = getLocalCredentials()
    const cookies = localStorage.getItem("cookies")
    const courses = await scrapeCourseData(credentials, cookies!)
    console.log({courses})
    setCourses(courses)
    setLastUpdated(formatDate(Date.now(), "HH:mm, do MMM"))
    setLoadingCourses(false)
  }
  
  return (
    <div className="flex flex-col gap-6 p-6">
      {user && <UserCard onReload={reloadContent} lastUpdated={lastUpdated} {...user} />}
      {loadingUser && (
        <Card className="w-full">
          <CardContent className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-4 items-center">
              <Skeleton className="size-20 rounded-full" />
              <div className="flex flex-col gap-2 justify-center">
                <Skeleton className="h-6 w-48 sm:w-64" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-52 sm:w-52" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loadingCourses ? 
        Array.from({length: 5}, (_, i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-4 w-1/2 rounded-sm" />
              <Skeleton className="h-4 w-1/6 rounded-sm" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex justify-between">
                <Skeleton className="w-1/5 h-4 rounded-sm" />
                <Skeleton className="w-8 h-4 rounded-sm" />
              </div>
              <Skeleton className="h-2 w-full rounded-sm" />
            </CardContent>
          </Card>
        ))
        :
        courses.map((c, i) => <CourseCard key={i} {...c} />)}
      </div>
    </div>
  );
}

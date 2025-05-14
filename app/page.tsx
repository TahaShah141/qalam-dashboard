"use client"

import { AttendanceType, UserType } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";

import { CourseCard } from "@/components/custom/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCard } from "@/components/custom/UserCard";
import { formatDate } from "date-fns"
import { relative } from "path";

export default function Home() {

  const [courses, setCourses] = useState<AttendanceType[]>([])
  const [lastUpdated, setLastUpdated] = useState("")
  const [loadingCourses, setLoadingCourses] = useState(false)
  
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true)
      const { node } = await (await fetch("/api/database/attendances")).json()
      console.log({node})

      if (!node) {
        reloadContent()
        return
      }
      
      setCourses(JSON.parse(node.value))
      setLastUpdated(formatDate(node.updatedAt, "HH:mm, do MMM"))
      setLoadingCourses(false)
    }
    fetchCourses()
  }, [])
  
  const [user, setUser] = useState<UserType>()
  const [loadingUser, setLoadingUser] = useState(false)
  
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true)
      const { node } = await (await fetch("/api/database/qalam-user")).json()
      console.log({node})
      setUser(JSON.parse(node.value))
      setLoadingUser(false)
    }
    fetchUser()
  }, [])
  
  const reloadContent = async () => {
    setLoadingCourses(true)
    const { attendances } = await (await fetch("/api/scrape")).json()
    console.log({attendances})
    setCourses(attendances)
    setLastUpdated(formatDate(Date.now(), "HH:mm, do MMM"))
    setLoadingCourses(false)
  }
  
  return (
    <div className="flex flex-col gap-6 p-4">
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

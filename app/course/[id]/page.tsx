"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CourseAttendanceType, CourseGradeBookType, CourseInfoType } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { fetchCourseAttendance, scrapeCourseAttendanceData } from "@/lib/fetches/courseAttendance"
import { fetchCourseGrades, scrapeCourseGradesData } from "@/lib/fetches/courseGrades"
import { getLocalCourseInfo, getLocalCredentials, getWeightedAverages } from "@/lib/utils"
import { useEffect, useState } from "react"

import { AggregateChart } from "@/components/custom/AggregateChart"
import { AttendanceBar } from "@/components/custom/AttendanceBar"
import { AttendanceMap } from "@/components/custom/AttendanceMap"
import { GradingComponentCard } from "@/components/custom/GradingComponentCard"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { updateCookies } from "@/lib/fetches/cookies"
import { useParams } from "next/navigation";

type CourseClassType = "Lecture" | "Lab"

const LOGOS = {
  Lab: <svg className="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M5 19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1c0-.21-.07-.41-.18-.57L13 8.35V4h-2v4.35L5.18 18.43c-.11.16-.18.36-.18.57m1 3a3 3 0 0 1-3-3c0-.6.18-1.16.5-1.63L9 7.81V6a1 1 0 0 1-1-1V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1v1.81l5.5 9.56c.32.47.5 1.03.5 1.63a3 3 0 0 1-3 3zm7-6l1.34-1.34L16.27 18H7.73l2.66-4.61zm-.5-4a.5.5 0 0 1 .5.5a.5.5 0 0 1-.5.5a.5.5 0 0 1-.5-.5a.5.5 0 0 1 .5-.5"/></svg>,
  Lecture: <svg className="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0zM22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></g></svg>
}

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const [selectedData, setSelectedData] = useState<CourseClassType>("Lecture")

  const [course, setCourse] = useState<CourseInfoType | undefined>()
  const [attendancesMap, setAttendancesMap] = useState<CourseAttendanceType>({})
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [grades, setGrades] = useState<CourseGradeBookType>([])
  const [loadingGrades, setLoadingGrades] = useState(false)

  useEffect(() => {
    // local data
    const cookies = localStorage.getItem("cookies")
    console.log({cookies})
    const { credentials } = getLocalCredentials()

    const { course: localCourse} = getLocalCourseInfo(id)
    setCourse(localCourse)

    // fetch Attendance
    const fetchAttendances = async () => {
      const cookies = localStorage.getItem("cookies")
      setLoadingAttendance(true)
      const { attendances } = await fetchCourseAttendance(id, credentials, cookies!)
      setAttendancesMap(attendances)
      setLoadingAttendance(false)
    }
    
    // fetch Grade Book
    const fetchGrades = async () => {
      const cookies = localStorage.getItem("cookies")
      setLoadingGrades(true)
      const { grades } = await fetchCourseGrades(id, credentials, cookies!)
      setGrades(grades)
      setLoadingGrades(false)
    }

    const effectFunctions = async () => {
      if (!cookies) await updateCookies(credentials);
      fetchAttendances()
      fetchGrades()
    }
    effectFunctions()
  }, [id])

  const reloadContent = async () => {
    setLoadingAttendance(true)
    setLoadingGrades(true)
    const { credentials } = getLocalCredentials()
    const cookies = localStorage.getItem("cookies")
    const attendancesPromise = scrapeCourseAttendanceData(id, credentials, cookies!)
    const gradesPromise = scrapeCourseGradesData(id, credentials, cookies!)
    attendancesPromise.then((attendances) => {
      setAttendancesMap(attendances)
      setLoadingAttendance(false)
    })
    gradesPromise.then((grades) => {
      setGrades(grades)
      setLoadingGrades(false)
    })
  }

  const attendances = attendancesMap[selectedData] || []
  const total = attendances.length
  const attended = attendances.filter(a => a.isPresent).length
  const missed = total - attended
  const attendance = Math.round((attended / total)*100)
  const containsLab = attendancesMap.Lab !== undefined

  return (
    <div className="flex flex-col gap-6 p-6">
      <Card>
        <CardContent className="flex flex-wrap gap-2 sm:gap-4 justify-between items-center">
          <div className="flex flex-col gap-2 sm:gap-4 justify-center">
            {course ? 
            <div className="flex flex-col">
              <CardTitle className="sm:text-2xl md:text-3xl flex gap-2 items-baseline flex-wrap">
                {course.name}
                <CardDescription className="sm:text-lg md:text-xl">{course.code}</CardDescription>
              </CardTitle>
              <CardDescription className="sm:text-lg md:text-xl">{course.instructor}</CardDescription>
            </div>:
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 flex-wrap items-baseline">
                <Skeleton className="h-8 w-52" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-6 w-28" />
            </div>
            }
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-fit">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-fit">
                <Button onClick={reloadContent} variant={"secondary"} size={"smlg"}>
                  <svg className="h-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12.077 19q-2.931 0-4.966-2.033q-2.034-2.034-2.034-4.964t2.034-4.966T12.077 5q1.783 0 3.339.847q1.555.847 2.507 2.365V5.5q0-.213.144-.356T18.424 5t.356.144t.143.356v3.923q0 .343-.232.576t-.576.232h-3.923q-.212 0-.356-.144t-.144-.357t.144-.356t.356-.143h3.2q-.78-1.496-2.197-2.364Q13.78 6 12.077 6q-2.5 0-4.25 1.75T6.077 12t1.75 4.25t4.25 1.75q1.787 0 3.271-.968q1.485-.969 2.202-2.573q.085-.196.274-.275q.19-.08.388-.013q.211.067.28.275t-.015.404q-.833 1.885-2.56 3.017T12.077 19"/></svg>
                  <Label className="">Reload</Label>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger className={`${buttonVariants({variant: "secondary", size: "smlg"})} font-bold text-xs capitalize w-24`}>
                    {LOGOS[selectedData]}
                    <Label>{selectedData}</Label>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup value={selectedData} onValueChange={(v) => setSelectedData(v as CourseClassType)}>
                      {Object.keys(attendancesMap).map((type) => (
                        <DropdownMenuRadioItem key={type} value={type}>
                          {LOGOS[type as CourseClassType]}
                          {type}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-fit">
                <div className="flex gap-2 p-2 rounded-md text-xs sm:text-base bg-secondary">
                  <p className="font-bold text-green-500">Attended:</p>
                  <p className="font-light">{attended}</p>
                </div>
                <div className="flex gap-2 p-2 rounded-md text-xs sm:text-base bg-secondary">
                  <p className="font-bold text-red-500">Missed:</p>
                  <p className="font-light">{missed}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full max-w-lg flex-col gap-2 sm:gap-4">
            {loadingAttendance ? 
            <Skeleton className="h-24 sm:h-32 w-full " /> :
            <AttendanceMap attendances={attendances} rows={selectedData === "Lecture" ? ((course?.creditHours || 3) - (containsLab ? 1 : 0)) : 1} horizontal={selectedData === "Lab"} />}
            {!loadingAttendance && <div className="flex gap-2 items-center max-w-2xl">
              <AttendanceBar attendance={attendance} className="bg-muted-foreground" />
              <Label className="text-muted-foreground">{attendance}%</Label>
            </div>}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loadingGrades && 
        <>
        <AggregateChart selectedData={selectedData} grades={grades} />
        {grades.find(g => g.name === selectedData)?.components.map((c, i) => <GradingComponentCard key={i} {...c} />)}
        </>}
        {loadingGrades && 
        <>
          {Array.from({length: 3}, (_, i) => <Skeleton key={i} className="h-[300px] w-full" />)}
        </>}
      </div>
    </div>
  )
}
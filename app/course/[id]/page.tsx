"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { AttendanceBar } from "@/components/custom/AttendanceBar"
import { AttendanceListType } from "@/lib/types"
import { AttendanceMap } from "@/components/custom/AttendanceMap"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"

const lectureAttendances: AttendanceListType = [
  { date: "2025-01-29", isPresent: true },
  { date: "2025-01-29", isPresent: true },
  { date: "2025-01-30", isPresent: true },
  { date: "2025-02-06", isPresent: true },
  { date: "2025-02-12", isPresent: true },
  { date: "2025-02-12", isPresent: true },
  { date: "2025-02-13", isPresent: true },
  { date: "2025-02-19", isPresent: true },
  { date: "2025-02-19", isPresent: true },
  { date: "2025-02-20", isPresent: true },
  { date: "2025-02-26", isPresent: true },
  { date: "2025-02-26", isPresent: true },
  { date: "2025-02-27", isPresent: true },
  { date: "2025-03-05", isPresent: false },
  { date: "2025-03-05", isPresent: false },
  { date: "2025-03-06", isPresent: true },
  { date: "2025-03-12", isPresent: true },
  { date: "2025-03-12", isPresent: true },
  { date: "2025-03-13", isPresent: true },
  { date: "2025-03-19", isPresent: true },
  { date: "2025-03-19", isPresent: true },
  { date: "2025-03-26", isPresent: true },
  { date: "2025-03-26", isPresent: true },
  { date: "2025-04-09", isPresent: true },
  { date: "2025-04-09", isPresent: true },
  { date: "2025-04-10", isPresent: true },
  { date: "2025-04-16", isPresent: true },
  { date: "2025-04-16", isPresent: false },
  { date: "2025-04-17", isPresent: true },
  { date: "2025-04-19", isPresent: false },
  { date: "2025-04-23", isPresent: true },
  { date: "2025-04-23", isPresent: true },
  { date: "2025-04-24", isPresent: true },
  { date: "2025-04-30", isPresent: false },
  { date: "2025-04-30", isPresent: true },
  { date: "2025-05-07", isPresent: true },
  { date: "2025-05-07", isPresent: false },
  { date: "2025-05-09", isPresent: true },
  { date: "2025-05-09", isPresent: true },
  { date: "2025-05-14", isPresent: false },
  { date: "2025-05-14", isPresent: false },
  { date: "2025-05-15", isPresent: true }
]

const labAttendances: AttendanceListType = [
  { date: "2025-01-31", isPresent: true },
  { date: "2025-02-07", isPresent: true },
  { date: "2025-02-14", isPresent: true },
  { date: "2025-02-21", isPresent: true },
  { date: "2025-02-28", isPresent: true },
  { date: "2025-03-07", isPresent: true },
  { date: "2025-03-14", isPresent: true },
  { date: "2025-04-11", isPresent: true },
  { date: "2025-04-18", isPresent: true },
  { date: "2025-04-25", isPresent: false },
  { date: "2025-04-26", isPresent: false },
  { date: "2025-05-09", isPresent: true },
  { date: "2025-05-16", isPresent: true }
]

const courseData = {
  name: "Parallel & Distributed Computing (CS-432)",
  instructor: "Dr. Khurram Shehzad"
}

type CourseClassType = "Lecture" | "Lab"

const LOGOS = {
  Lab: <svg className="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M5 19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1c0-.21-.07-.41-.18-.57L13 8.35V4h-2v4.35L5.18 18.43c-.11.16-.18.36-.18.57m1 3a3 3 0 0 1-3-3c0-.6.18-1.16.5-1.63L9 7.81V6a1 1 0 0 1-1-1V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1v1.81l5.5 9.56c.32.47.5 1.03.5 1.63a3 3 0 0 1-3 3zm7-6l1.34-1.34L16.27 18H7.73l2.66-4.61zm-.5-4a.5.5 0 0 1 .5.5a.5.5 0 0 1-.5.5a.5.5 0 0 1-.5-.5a.5.5 0 0 1 .5-.5"/></svg>,
  Lecture: <svg className="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0zM22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></g></svg>
}

export default function CoursePage() {
  
  const { name, instructor } = courseData

  const [selectedData, setSelectedData] = useState<CourseClassType>("Lecture")

  const attendancesMap: Record<CourseClassType, AttendanceListType>= {
    Lab: labAttendances,
    Lecture: lectureAttendances
  }

  const attendances = attendancesMap[selectedData]
  const total = attendances.length
  const attended = attendances.filter(a => a.isPresent).length
  const missed = total - attended
  const attendance = Math.round((attended / total)*100)

  return (
    <div className="flex flex-col gap-6 p-6">
      <Card>
        <CardContent className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex flex-col gap-4 justify-center">
            <div className="flex flex-col">
              <CardTitle className="text-3xl">{name}</CardTitle>
              <CardDescription className="text-xl">{instructor}</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-4 w-fit">
              <DropdownMenu>
                <DropdownMenuTrigger className={`${buttonVariants({variant: "secondary", size: "lg"})} font-bold capitalize w-24`}>
                  {LOGOS[selectedData]}
                  {selectedData}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup value={selectedData} onValueChange={(v) => setSelectedData(v as CourseClassType)}>
                    <DropdownMenuRadioItem value="Lecture">
                      {LOGOS.Lecture}
                      Lecture
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Lab">
                      {LOGOS.Lab}
                      Lab
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex gap-2 p-2 rounded-md bg-secondary">
                <p className="font-bold text-green-500">Attended:</p>
                <p className="font-light">{attended}</p>
              </div>
              <div className="flex gap-2 p-2 rounded-md bg-secondary">
                <p className="font-bold text-red-500">Missed:</p>
                <p className="font-light">{missed}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <AttendanceMap attendances={attendances} totalClasses={selectedData === "Lecture" ? 3*16 : 16} horizontal={selectedData === "Lab"} heading={"Lecture Attendance"} />
            <div className="flex gap-2 items-center">
              <AttendanceBar attendance={attendance} className="bg-muted-foreground" />
              <Label className="text-muted-foreground">{attendance}%</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({length: 5}, (_, i) => (
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
        ))}
      </div>
    </div>
  )
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

import { AttendanceBar } from "./AttendanceBar"
import { AttendanceType } from "@/lib/types"
import { Label } from "../ui/label"
import Link from "next/link"

export const CourseCard = ({courseName, courseCode, courseLink, attendance}: AttendanceType) => {
  return (
    <Link href={`${process.env.NEXT_PUBLIC_QALAM_URL}${courseLink}`}>
      <Card>
        <CardHeader>
          <CardTitle>{courseName}</CardTitle>
          <CardDescription>{courseCode}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Label>Attendance</Label>
            <Label>{`${attendance}%`}</Label>
          </div>
          <AttendanceBar attendance={attendance} />
        </CardContent>
      </Card>
    </Link>
  )
}

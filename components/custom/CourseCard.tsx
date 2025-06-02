import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

import { AttendanceBar } from "./AttendanceBar"
import { CourseInfoType } from "@/lib/types"
import { Label } from "../ui/label"
import Link from "next/link"

export const CourseCard = ({name, code, id, instructor, attendance}: CourseInfoType) => {

  return (
    <Link href={`/course/${id}`}>
      <Card className="h-full flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center flex-wrap">
            {name}
            <CardDescription>{code}</CardDescription>
          </CardTitle>
          <CardDescription>{instructor}</CardDescription>
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

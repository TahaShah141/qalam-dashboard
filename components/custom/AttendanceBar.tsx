import { useEffect, useState } from "react"

import { Progress } from "../ui/progress"

type AttendanceBarProps = {
  attendance: number
  className?: string
}

export const AttendanceBar = ({attendance, className=""}: AttendanceBarProps) => {

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(attendance), 500)
    return () => clearTimeout(timer)
  }, [attendance])

  return (
    <Progress value={progress} className={className} />
  )
}

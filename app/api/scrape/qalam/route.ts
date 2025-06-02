import { NextResponse } from "next/server"
import { getCourseAttendanceFromQalam } from "@/lib/scraping/courseAttendance"
import { getCourseGradesFromQalam } from "@/lib/scraping/courseGrades"
import { getCourseInfoFromQalam } from "@/lib/scraping/dashboard"
import { getUserData } from "@/lib/scraping/user"
import { initNode } from "@/lib/initNode"
import { login } from "@/lib/scraping/login"

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET() {
  const credentials = {
    login: process.env.QALAM_ID!,
    password: process.env.QALAM_PASSWORD!
  };

  try {
    const cookies = await login(credentials);

    // Fire-and-forget: user data
    getUserData(credentials, cookies)
      .then((user) =>
        initNode({ key: "qalam-user", value: JSON.stringify(user) })
      )
      .catch((err) => console.error("User data error:", err));

    // Dashboard (needed for later so async)
    const courses = await getCourseInfoFromQalam(credentials, cookies);
    initNode({ key: "courses", value: JSON.stringify(courses) })
      .catch((err) => console.error("Init node courses error:", err));

    const courseIDs = courses.map((c) => c.id);

    // Fire-and-forget attendance & grades
    courseIDs.forEach((id) => {
      getCourseAttendanceFromQalam(id, credentials, cookies)
        .then((attendances) =>
          initNode({
            key: `course-${id}-attendance`,
            value: JSON.stringify(attendances)
          })
        )
        .catch((err) =>
          console.error(`Attendance error for course ${id}:`, err)
        );

      getCourseGradesFromQalam(id, credentials, cookies)
        .then((grades) =>
          initNode({
            key: `course-${id}-grades`,
            value: JSON.stringify(grades)
          })
        )
        .catch((err) =>
          console.error(`Grades error for course ${id}:`, err)
        );
    });

    return NextResponse.json({ message: "Cron Job Executed" });
  } catch (error) {
    console.error("Main error:", error);
    return NextResponse.json({ error: error });
  }
}
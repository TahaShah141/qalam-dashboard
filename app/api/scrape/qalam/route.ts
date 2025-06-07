import { NextResponse } from "next/server"
import connectMongo from "@/lib/connectMongo"
import fetch from "node-fetch"
import { formatDate } from "date-fns"
import { getCourseAttendanceFromQalam } from "@/lib/scraping/courseAttendance"
import { getCourseGradesFromQalam } from "@/lib/scraping/courseGrades"
import { getCourseInfoFromQalam } from "@/lib/scraping/dashboard"
import { getUserData } from "@/lib/scraping/user"
import { initNode } from "@/lib/initNode"
import { login } from "@/lib/scraping/login"
import { notify } from "@/lib/notify"

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET() {
  const credentials = {
    login: process.env.QALAM_ID!,
    password: process.env.QALAM_PASSWORD!
  };

  try {
    const cookies = await login(credentials);

    await connectMongo()
    
    // Fire-and-forget: user data
    getUserData(credentials, cookies)
      .then((user) => initNode({ key: "qalam-user", value: JSON.stringify(user) }))
      .catch((err) => notify(`User data error: ${err}`));

    // Dashboard (needed for later so async)
    const courses = await getCourseInfoFromQalam(credentials, cookies);
    initNode({ key: "courses", value: JSON.stringify(courses) })
      .then(() => notify("Courses Saved Successfully"))
      .catch((err) => notify(`Init node courses error: ${err}`));

    const courseIDs = courses.map((c) => c.id);

    // Fire-and-forget attendance & grades
    courseIDs.forEach((id) => {
      getCourseAttendanceFromQalam(id, credentials, cookies)
        .then((attendances) => initNode({key: `course-${id}-attendance`, value: JSON.stringify(attendances)}))
        .catch((err) => notify(`Attendance error for course ${id}: ${err}`));

      getCourseGradesFromQalam(id, credentials, cookies)
        .then((grades) => initNode({key: `course-${id}-grades`, value: JSON.stringify(grades)}))
        .catch((err) => notify(`Grades error for course ${id}: ${err}`));
    });

    return NextResponse.json({ message: "Cron Job Executed", courses });
  } catch (error) {
    notify(`Main error: ${error}`);
    return NextResponse.json({ error: error });
  }
}
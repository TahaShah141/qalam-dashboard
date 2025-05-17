export type AttendanceType = {
  courseName: string;
  courseCode: string;
  courseLink: string;
  attendance: number;
};

export type CourseAttendanceType = {
  date: string,
  isPresent: boolean
}

export type AttendanceListType = CourseAttendanceType[]

export type UserType = {
  name: string;
  cms: string;
  pfp: string;
  department: string;
};

export type CredentialsType = {
  login: string
  password: string
}
export type CourseInfoType = {
  name: string;
  code: string;
  id: string;
  instructor: string
  creditHours: number
  attendance: number;
};

export type AttendanceType = {
  date: string,
  isPresent: boolean
}

export type AttendanceListType = AttendanceType[]

export type CourseAttendanceType = Record<string, AttendanceListType>

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

export type MarksType = {
  name: string
  maxMarks: number
  obtainedMarks: number
  averageMarks: number
}

export type GradingComponentType = {
  name: string
  weight: number
  components: MarksType[]
}

export type CourseGradeBookComponentType = {
  name: string
  components: GradingComponentType[]
}

export type CourseGradeBookType = CourseGradeBookComponentType[]
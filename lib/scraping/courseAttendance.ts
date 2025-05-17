import * as cheerio from "cheerio";

import { AttendanceListType, CourseAttendanceType, CredentialsType } from "../types";

import { login } from "./login";

export const getCourseAttendanceFromQalam = async (id: string, credentials: CredentialsType, cookies?: string): Promise<CourseAttendanceType> => {

  const url = process.env.QALAM_URL + "/student/course/attendance/" + id;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Cookie": cookies ? cookies : await login(credentials),
    },
  });

  const html = await response.text();

  const $ = cheerio.load(html);

  const tableNames: string[] = []

  $("ul.uk-tab:not(nav ul.uk-tab) li").each((_, el) => {
    tableNames.push($(el).text().trim());
  });

  const tableData: AttendanceListType[] = [];

  $(".uk-table").each((_, table) => {
    const rows: AttendanceListType = [];

    $(table)
      .find("tbody tr")
      .each((_, row) => {
        const tds = $(row).find("td");
        const dateText = tds.eq(1).text().trim();
        const statusText = tds.eq(2).text().trim().toLowerCase();
        const isPresent = statusText === "present";

        if (dateText) {
          rows.push({ date: dateText, isPresent });
        }
      });

    tableData.push(rows);
  });

  const toReturn: Record<string, AttendanceListType> = {};

  const attendanceArray: { name: string, data: AttendanceListType }[] = tableNames.map((name, idx) => ({
    name,
    data: tableData[idx] || []
  }));

  attendanceArray.sort((a, b) => b.data.length - a.data.length);

  attendanceArray.forEach(({ name, data }) => {
    toReturn[name] = data;
  });

  return toReturn;
};
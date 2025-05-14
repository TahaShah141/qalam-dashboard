import * as cheerio from "cheerio";

import { AttendanceType } from "./types";
import { login } from "./login";

export const getAttendanceFromQalam = async (): Promise<AttendanceType[]> => {
  const cookies = await login();

  const url = process.env.QALAM_URL + "/student/dashboard";
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Cookie": cookies,
    },
  });

  const html = await response.text();
  const $ = cheerio.load(html);

  const cards: AttendanceType[] = [];

  $("a:has(.card)").each((_, anchor) => {
    const courseLink = $(anchor).attr("href") ?? "";
    const card = $(anchor).find(".card");

    const courseName = card.find(".card-header").text().trim();
    const courseCode = card.find(".card-text .sub-heading").text().trim();

    const attendanceSpan = card.find(".uk-text-small span").first();
    const attendance = attendanceSpan.length ? parseFloat(attendanceSpan.text().trim()) : 0;

    cards.push({
      courseName,
      courseCode,
      courseLink,
      attendance,
    });
  });

  console.log(cards);
  return cards;
};
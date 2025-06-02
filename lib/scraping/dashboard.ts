import * as cheerio from "cheerio";

import { CourseInfoType, CredentialsType } from "../types";

import { login } from "./login";

export const getCourseInfoFromQalam = async (credentials: CredentialsType, cookies?: string): Promise<CourseInfoType[]> => {

  const url = process.env.QALAM_URL + "/student/dashboard";
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Cookie": cookies ? cookies : await login(credentials),
    },
  });

  const html = await response.text();
  const $ = cheerio.load(html);

  const cards: CourseInfoType[] = [];

  $("a:has(.card)").each((_, anchor) => {
    const courseLink = $(anchor).attr("href") ?? "";
    const instructor = $(anchor).find(".card-title").text().trim()
    const id = courseLink.split("/").slice(-1)[0]
    const card = $(anchor).find(".card");

    const name = card.find(".card-header").text().trim();
    const code = card.find(".card-text .sub-heading").text().trim();
    const creditHours = +(card.find(".card-text .md-list-heading").text().trim());

    const attendanceSpan = card.find(".uk-text-small span").first();
    const attendance = attendanceSpan.length ? parseFloat(attendanceSpan.text().trim()) : 0;

    cards.push({
      instructor,
      creditHours,
      name,
      code,
      id,
      attendance,
    });
  });

  return cards;
};
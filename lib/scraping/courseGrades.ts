import * as cheerio from "cheerio";

import { CourseGradeBookComponentType, CourseGradeBookType, CredentialsType, GradingComponentType, MarksType } from "../types";

import { login } from "./login";

export const getCourseGradesFromQalam = async (id: string, credentials: CredentialsType, cookies?: string): Promise<CourseGradeBookType> => {
  const url = process.env.QALAM_URL + "/student/course/gradebook/" + id;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Cookie": cookies ? cookies : await login(credentials),
    },
  });

  const html = await response.text();
  const $ = cheerio.load(html);

  const names: string[] = []

  $("ul.uk-tab:not(nav ul.uk-tab) li").each((_, el) => {
    names.push($(el).text().trim());
  });

  const tableNames = names.map(n => n.includes("Lab") ? "Lab" : "Lecture")

  const result: CourseGradeBookType = [];

  $("table.table_tree").each((i, table) => {
    const $table = $(table);
    const courseName = tableNames[i];
    const course: CourseGradeBookComponentType = {
      name: courseName,
      components: []
    };

    const rows = $table.find("tbody tr").toArray();
    let currentComponent: GradingComponentType | null = null;

    for (let i = 0; i < rows.length; i++) {
      const $row = $(rows[i]);

      if ($row.hasClass("table-parent-row")) {
        const name = $row.find("a").contents().filter(function () {
          return this.type === "text";
        }).text().trim();

        const weightText = $row.find("div.uk-badge").text().replace("%", "").trim();
        const weight = parseFloat(weightText);

        currentComponent = {
          name,
          weight: isNaN(weight) ? 0 : weight,
          components: []
        };

        course.components.push(currentComponent);
      } else if ($row.hasClass("table-child-row") && $row.find("td").length === 5 && currentComponent) {
        const tds = $row.find("td");

        const mark: MarksType = {
          name: tds.eq(0).text().trim(),
          maxMarks: parseFloat(tds.eq(1).text().trim()),
          obtainedMarks: parseFloat(tds.eq(2).text().trim()),
          averageMarks: parseFloat(tds.eq(3).text().trim())
        };

        currentComponent.components.push(mark);
      }
    }

    result.push(course);
  });

  console.log(result)

  return result;
};
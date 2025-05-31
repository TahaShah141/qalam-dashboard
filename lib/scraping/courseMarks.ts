import * as cheerio from "cheerio";

import { CourseAttendanceType, CourseGradeBookComponentType, CourseGradeBookType, CredentialsType, GradingComponentType, MarksType } from "../types";

import { login } from "./login";

export const getCourseMarksFromQalam = async (id: string, credentials: CredentialsType, cookies?: string): Promise<CourseGradeBookType> => {
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

const dummyMarks: CourseGradeBookType = 
[
  {
    "name": "Lab",
    "components": [
      {
        "name": "Lab Work",
        "weight": 70,
        "components": [
          {
            "name": "Lab Work 1",
            "maxMarks": 10,
            "obtainedMarks": 7,
            "averageMarks": 6.88
          },
          {
            "name": "Lab Work 3",
            "maxMarks": 10,
            "obtainedMarks": 8,
            "averageMarks": 7.19
          },
          {
            "name": "Lab Work 4",
            "maxMarks": 10,
            "obtainedMarks": 7,
            "averageMarks": 7.19
          },
          {
            "name": "Lab Work 5",
            "maxMarks": 10,
            "obtainedMarks": 7,
            "averageMarks": 7.21
          },
          {
            "name": "Lab Work 6",
            "maxMarks": 10,
            "obtainedMarks": 7,
            "averageMarks": 7.2
          },
          {
            "name": "Lab Work 7",
            "maxMarks": 10,
            "obtainedMarks": 7,
            "averageMarks": 7.01
          },
          {
            "name": "Lab Work 8",
            "maxMarks": 10,
            "obtainedMarks": 8,
            "averageMarks": 7.08
          },
          {
            "name": "Lab Work 9",
            "maxMarks": 10,
            "obtainedMarks": 5.5,
            "averageMarks": 7.23
          },
          {
            "name": "Lab Work10",
            "maxMarks": 10,
            "obtainedMarks": 8,
            "averageMarks": 6.63
          },
          {
            "name": "Lab Work11",
            "maxMarks": 10,
            "obtainedMarks": 7,
            "averageMarks": 7.13
          },
          {
            "name": "Lab Work 2",
            "maxMarks": 10,
            "obtainedMarks": 8,
            "averageMarks": 6.9
          }
        ]
      },
      {
        "name": "Lab Final",
        "weight": 20,
        "components": [
          {
            "name": "Lab Final 1",
            "maxMarks": 100,
            "obtainedMarks": 20.5,
            "averageMarks": 15.88
          }
        ]
      },
      {
        "name": "Lab Project",
        "weight": 10,
        "components": [
          {
            "name": "Lab12-OEL",
            "maxMarks": 10,
            "obtainedMarks": 7,
            "averageMarks": 6.87
          },
          {
            "name": "Quiz 1",
            "maxMarks": 10,
            "obtainedMarks": 10,
            "averageMarks": 7.62
          }
        ]
      }
    ]
  },
  {
    "name": "Lecture",
    "components": [
      {
        "name": "Assignments",
        "weight": 10,
        "components": [
          {
            "name": "Assignments 1",
            "maxMarks": 10,
            "obtainedMarks": 10,
            "averageMarks": 8.79
          },
          {
            "name": "Assignments 2",
            "maxMarks": 10,
            "obtainedMarks": 0,
            "averageMarks": 0
          }
        ]
      },
      {
        "name": "Final Term",
        "weight": 50,
        "components": [
          {
            "name": "Final Term 1",
            "maxMarks": 100,
            "obtainedMarks": 0,
            "averageMarks": 0
          }
        ]
      },
      {
        "name": "Quiz",
        "weight": 15,
        "components": [
          {
            "name": "Quiz 1",
            "maxMarks": 10,
            "obtainedMarks": 1,
            "averageMarks": 1.88
          },
          {
            "name": "Quiz 3",
            "maxMarks": 10,
            "obtainedMarks": 0,
            "averageMarks": 1.96
          },
          {
            "name": "Quiz 4",
            "maxMarks": 10,
            "obtainedMarks": 5,
            "averageMarks": 6.14
          },
          {
            "name": "Quiz 2",
            "maxMarks": 10,
            "obtainedMarks": 5,
            "averageMarks": 3.79
          }
        ]
      },
      {
        "name": "Mid Term",
        "weight": 25,
        "components": [
          {
            "name": "Mid Term 1",
            "maxMarks": 50,
            "obtainedMarks": 45.5,
            "averageMarks": 42.36
          }
        ]
      }
    ]
  }
]
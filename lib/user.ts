import * as cheerio from "cheerio";

import { CredentialsType, UserType } from "./types";

import { login } from "./login";

export const getUserData = async (credentials: CredentialsType, cookies?: string): Promise<UserType | null> => {
  try {

    const url = process.env.QALAM_URL + "/student/dashboard";
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Cookie": cookies ? cookies : await login(credentials),
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch dashboard: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const userDataDiv = $(".user_heading_dash");

    if (!userDataDiv.length) {
      console.warn("Could not find the .user_heading_dash element.");
      return null;
    }

    const nameElement = userDataDiv.find(".user_heading_content h2.heading_b span.uk-text-truncate").first();
    const cmsElement = userDataDiv.find(".user_heading_content h2.heading_b span.sub-heading").first();
    const departmentElement = userDataDiv.find(".user_heading_content h2.heading_b span.sub-heading").eq(1); // Assuming department is the second sub-heading
    const pfpURLElement = userDataDiv.find(".user_heading_avatar .thumbnail img").first();

    const user: UserType = {
      name: nameElement.text().trim(),
      cms: cmsElement.text().trim(),
      pfp: pfpURLElement.attr("src") || "",
      department: departmentElement.text().trim(),
    };

    console.log(user.name)
    return user;
  } catch (error) {
    console.error("Error fetching or parsing user data:", error);
    return null;
  }
};
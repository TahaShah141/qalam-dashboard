import fetch from "node-fetch";

export const login = async (): Promise<string> => {
  const loginUrl = process.env.QALAM_URL! + "/web/login";

  // Step 1: Get login page to extract CSRF and initial cookies
  const loginPageResponse = await fetch(loginUrl, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "text/html",
    },
  });

  const html = await loginPageResponse.text();
  const csrfMatch = html.match(/name="csrf_token"\s+value="([^"]+)"/);
  const csrfToken = csrfMatch?.[1];

  if (!csrfToken) throw new Error("CSRF token not found");

  const initialCookies = loginPageResponse.headers.raw()["set-cookie"]
    ?.map(cookie => cookie.split(";")[0])
    .join("; ");

  // Step 2: POST login with form data and cookies
  const formData = new URLSearchParams();
  formData.append("csrf_token", csrfToken);
  formData.append("login", process.env.QALAM_ID!);
  formData.append("password", process.env.QALAM_PASSWORD!);

  const loginResponse = await fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0",
      "Referer": loginUrl,
      "Cookie": initialCookies,
    },
    body: formData.toString(),
    redirect: "manual"
  });

  // Step 3: Get session cookies
  const sessionCookies = loginResponse.headers.raw()["set-cookie"]
    ?.map(cookie => cookie.split(";")[0])
    .join("; ");

  if (!sessionCookies) {
    throw new Error("Login failed — no session cookies received");
  }

  console.log("Login succeeded. Session cookies:", sessionCookies);
  return sessionCookies;
};
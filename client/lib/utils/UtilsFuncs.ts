import { FunctionJob, PingApiRes } from "./types/interfaces";

export const HandleApiCall = async (
  route: "ping" | "download",
  password: string,
  data?: {}
): Promise<FunctionJob> => {
  const URL = `https://go-ytdl.herokuapp.com/${route}`;
  if (IsEmptyString(password) || !IsValidURL(URL)) return;

  const PING = route === "ping";

  const ApiRes = await fetch(URL, {
    method: PING ? "GET" : "POST",
    body: !PING ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: password,
    },
  });

  if (!ApiRes.ok) return { success: false };

  if (PING) {
    const ResData: PingApiRes = await ApiRes.json();

    if (!ResData || !ResData?.success) return { success: false };
    return { success: true };
  }

  // Download
  if (!PING) {
  }
};

export const IsEmptyString = (str: string): boolean =>
  !str || typeof str !== "string" || str.trim().length <= 0;

export const IsValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const IsValidYoutubeUrl = (): boolean => false;
export const IsValidYoutubeID = (): boolean => false;

// Helpers
export const ParseCookies = (cookies: string) =>
  cookies
    .split("; ")
    .map((cookie) => {
      const [Key, Value] = cookie.split("=");
      return {
        [Key]: Value,
      };
    })
    .reduce((prev, curr) => ({ ...prev, ...curr }), {});

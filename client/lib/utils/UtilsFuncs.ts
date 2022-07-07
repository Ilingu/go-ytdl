import {
  DownloadPayloadShape,
  DownloadResShape,
  FunctionJob,
  PingApiRes,
  VideoInfosShape,
} from "./types/interfaces";

export const HandleApiCall = async (
  route: "ping" | "download",
  password: string,
  data?: DownloadPayloadShape
): Promise<FunctionJob<DownloadResShape>> => {
  const ApiUrl = `https://go-ytdl.herokuapp.com/${route}`;
  if (IsEmptyString(password) || !IsValidURL(ApiUrl)) return;

  const PING = route === "ping";

  const ApiRes = await fetch(ApiUrl, {
    method: PING ? "GET" : "POST",
    body: !PING ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: password,
    },
  });

  if (!ApiRes.ok) return { success: false };

  // /ping
  if (PING) {
    const ResData: PingApiRes = await ApiRes.json();

    if (!ResData || !ResData?.success) return { success: false };
    return { success: true };
  }

  // /download
  if (!PING) {
    const FileData = await ApiRes.blob(); // fetch file blob
    const DownloadableFileUrl = URL.createObjectURL(FileData); // store file

    const VideoInfo: VideoInfosShape = {
      title: ApiRes?.headers.get("Video-Title"),
      thumbnail: ApiRes?.headers.get("Video-Thumbnail"),
      author: ApiRes?.headers.get("Video-Author"),
      duration: ApiRes?.headers.get("Video-Duration"),
    };

    return {
      success: true,
      data: { FileUrl: DownloadableFileUrl, ...VideoInfo },
    };
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

export const ParseYoutubeUrl = (url: string): boolean | string => {
  const reg =
    /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/im;

  const matches = url.match(reg);
  if (!matches || IsEmptyString(matches[1]) || !IsValidYoutubeID(matches[1]))
    return false;

  return matches[1];
};
export const IsValidYoutubeID = (id: string): boolean => id.length === 11;

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

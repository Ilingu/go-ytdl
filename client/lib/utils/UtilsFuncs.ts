import { FunctionJob } from "./types/interfaces";

export const CallApi = async (
  path: string,
  resType: "json" | "file"
): Promise<FunctionJob> => {
  if (IsEmptyString(path)) return;

  const URL = `https://go-ytdl.herokuapp.com/${path}`;
  if (!IsValidURL(URL)) return;
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

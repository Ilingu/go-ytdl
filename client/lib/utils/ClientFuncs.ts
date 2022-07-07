import { IsLoggedIn } from "lib/store/store";
import { THEMES } from "./types/enums";
import { AlertArgsShape } from "./types/interfaces";
import { IsEmptyString, ParseCookies } from "./UtilsFuncs";

export const GetPassword = (): string => {
  const ParsedCookie = ParseCookies(document.cookie);

  if (!ParsedCookie || !ParsedCookie["UserPsw"]) return null;
  if (IsEmptyString(ParsedCookie["UserPsw"])) return null;

  return ParsedCookie["UserPsw"];
};
export const StorePassword = (password: string) => {
  if (IsEmptyString(password)) return;
  ClearPassword(false);

  document.cookie = `UserPsw=${password}; expires=${new Date(
    Date.now() + 7776000000 // 90d
  ).toISOString()}`;
  document.cookie = `SessionActive=yes; expires=${new Date(
    Date.now() + 153360000000
  ).toISOString()}`; // 153360000000 = 5y = Session Cookie
};
export const ClearPassword = (msg = true) => {
  document.cookie = "UserPsw=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = "SessionActive=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  window.sessionStorage.clear();
  SetIsLoggedIn(false);
  msg && PushAlert({ text: "Logged out successfully", type: "info" });
};

export const SetIsLoggedIn = (NewVal: boolean) => IsLoggedIn.set(NewVal);

export const PushAlert = (args: AlertArgsShape) => {
  const AlertEvent = new CustomEvent("ui-alert", { detail: args });
  document.dispatchEvent(AlertEvent);
};

export const HandleDownload = (
  DownloadableFileUrl: string,
  VideoID: string,
  ToMp3: boolean
) => {
  const filename = `GoYtdl-${VideoID}.${ToMp3 ? "mp3" : "mp4"}`;

  const DownloadElement = document.createElement("a");
  DownloadElement.setAttribute("href", DownloadableFileUrl);
  DownloadElement.setAttribute("download", filename);

  DownloadElement.style.display = "none";
  document.body.appendChild(DownloadElement);

  DownloadElement.click(); // Download file

  document.body.removeChild(DownloadElement);

  PushAlert({ text: "File Downloaded Successfully!", type: "success" });
};

export const ChangeTheme = (NewTheme: THEMES) => {
  if (IsEmptyString(NewTheme)) return;

  window.localStorage.setItem("app-theme", NewTheme);
  document.documentElement.setAttribute("data-theme", NewTheme);
};

import { IsLoggedIn } from "lib/store/store";
import { THEMES } from "./types/enums";
import { AlertArgsShape } from "./types/interfaces";
import { IsEmptyString } from "./UtilsFuncs";

export const GetPassword = (): string => {
  const ParsedCookie = ParseCookies(document.cookie);

  if (!ParsedCookie || !ParsedCookie["UserPsw"]) return null;
  if (IsEmptyString(ParsedCookie["UserPsw"])) return null;

  return ParsedCookie["UserPsw"];
};
export const StorePassword = (password: string) => {
  if (IsEmptyString(password)) return;
  ClearPassword();

  document.cookie = `UserPsw=${password}; expires=${new Date(
    Date.now() + 7776000000 // 90d
  ).toISOString()}`;
};
export const ClearPassword = () => {
  document.cookie = "UserPsw=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
};

export const SetIsLoggedIn = (NewVal: boolean) => IsLoggedIn.set(NewVal);

export const PushAlert = (args: AlertArgsShape) => {
  const AlertEvent = new CustomEvent("ui-alert", { detail: args });
  document.dispatchEvent(AlertEvent);
};

export const ChangeTheme = (NewTheme: THEMES) => {
  if (IsEmptyString(NewTheme)) return;

  window.localStorage.setItem("app-theme", NewTheme);
  document.documentElement.setAttribute("data-theme", NewTheme);
};

// Helpers
const ParseCookies = (cookies: string) =>
  cookies
    .split("; ")
    .map((cookie) => {
      const [Key, Value] = cookie.split("=");
      return {
        [Key]: Value,
      };
    })
    .reduce((prev, curr) => ({ ...prev, ...curr }), {});

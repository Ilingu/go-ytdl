import { HandleApiCall } from "./UtilsFuncs";

export const IsPasswordValid = async (password: string): Promise<boolean> =>
  (await HandleApiCall("ping", password))?.success;

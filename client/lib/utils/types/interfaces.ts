import type { AlertType } from "./types";

export interface FunctionJob<T = any> {
  success: boolean;
  data?: T;
}

export interface AlertArgsShape {
  text: string;
  type: AlertType;
  duration?: number;
}

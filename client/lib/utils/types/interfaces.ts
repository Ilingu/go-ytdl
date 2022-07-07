import type { AlertType } from "./types";

export interface FunctionJob<T> {
  success: boolean;
  data?: T;
}

export interface AlertArgsShape {
  text: string;
  type: AlertType;
  duration?: number;
}

export interface DownloadPayloadShape {
  videoID?: string;
  youtubeURL?: string;
  toMp3?: boolean;
}

export interface PingApiRes {
  success: boolean;
  data: "pong";
}

export interface DownloadResShape extends VideoInfosShape {
  FileUrl: string;
}

export interface VideoInfosShape {
  title: string;
  thumbnail?: string;
  author: string;
  duration: string;
}

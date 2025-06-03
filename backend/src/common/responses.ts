import { ResponseBody } from "./response-body";

export function successResponse<T>(data: T, message: string): ResponseBody<T> {
  return new ResponseBody<T>(true,  message ,data);
}

export function errorResponse(message: string): ResponseBody<null> {
  return new ResponseBody<null>(false, message,null);
}



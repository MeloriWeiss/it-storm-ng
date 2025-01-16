import {RequestTypes} from "./request-types";

export type RequestDataType = {
  name: string,
  phone: string,
  type: RequestTypes,
  service?: string
}

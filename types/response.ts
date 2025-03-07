import type { Credential } from "./credential";

export interface Response {
  status: string
  statusCode: number
  message: string
  data : Credential[] | Credential | string
}

export interface LoginForm {
  email: string
  password: string
}

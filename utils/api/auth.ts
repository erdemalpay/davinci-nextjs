import Cookies from "js-cookie";
import { post } from "./index";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

const baseURL = `${process.env.NEXT_PUBLIC_API_HOST}/auth/login`;

export async function login(payload: LoginCredentials) {
  const { token } = await post<LoginCredentials, LoginResponse>({
    path: "/auth/login",
    payload,
  });

  Cookies.set("jwt", token);
}

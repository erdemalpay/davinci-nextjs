import { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { post } from "./index";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function login(payload: LoginCredentials) {
  const response = await post<LoginCredentials, AxiosResponse<LoginResponse>>({
    path: "/auth/login",
    payload,
  });
  const { token } = response.data;
  Cookies.set("jwt", token);
  localStorage.setItem("jwt", token);
}

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

const baseURL = `${process.env.NEXT_PUBLIC_API_HOST}/auth/login`;

export async function login(payload: LoginCredentials) {
  console.log("TEST1");
  const response = await post<LoginCredentials, AxiosResponse<LoginResponse>>({
    path: "/auth/login",
    payload,
  });
  const { token } = response.data;
  console.log("TEST3");
  Cookies.set("jwt", token);
  console.log("TEST4");
  localStorage.setItem("jwt", token);
  console.log("TEST5");
}

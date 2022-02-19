import axios from "axios";

export interface LoginCredentials {
  username: string;
  password: string;
}

const baseURL = `${process.env.NEXT_PUBLIC_API_HOST}/auth/login`;

export async function login(payload: LoginCredentials) {
  return axios.post(baseURL, payload);
}

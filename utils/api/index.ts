import axios from "axios";

import { NextApiRequestCookies } from "next/dist/server/api-utils";

interface GetRequest {
  path: string;
  cookies?: NextApiRequestCookies;
}

interface PostRequest<P> {
  path: string;
  cookies?: NextApiRequestCookies;
  payload: P;
}

const baseURL = `${process.env.NEXT_PUBLIC_API_HOST}`;

export async function get<T>({ path, cookies }: GetRequest): Promise<T> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (cookies) {
    headers.Authorization = `Bearer ${cookies.jwt}`;
  }
  const { data } = await axios.get<T>(
    `${process.env.NEXT_PUBLIC_API_HOST}${path}`,
    {
      headers,
    }
  );

  return data;
}

// P = payload, R = ResponseType
export async function post<P, R>({
  path,
  cookies,
  payload,
}: PostRequest<P>): Promise<R> {
  const headers: HeadersInit = {};
  if (cookies) {
    headers.Authorization = `Bearer ${cookies.jwt}`;
  }
  return axios.post(`${baseURL}${path}`, {
    headers,
    payload,
  });
}

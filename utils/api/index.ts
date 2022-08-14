import axios from "axios";
import { getToken, PossibleContext } from "../token";

interface BaseRequest extends PossibleContext {
  path: string;
}

interface RequestWithPayload<P> extends BaseRequest {
  payload: P;
}

export interface UpdatePayload<P> {
  id: number;
  updates: Partial<P>;
}

const baseURL = `${process.env.NEXT_PUBLIC_API_HOST}`;

function printStackTrace() {
  const error = new Error();
  const stack = error.stack
    ?.split("\n")
    .slice(2)
    .map((line: string) => line.replace(/\s+at\s+/, ""))
    .join("\n");
  console.log(stack);
}

// T = ResponseType
export async function get<T>({ path, context }: BaseRequest): Promise<T> {
  const token = getToken({ context });
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
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
  payload,
}: RequestWithPayload<P>): Promise<R> {
  const headers: HeadersInit = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return axios.post(`${baseURL}${path}`, payload, {
    headers,
  });
}

// P = payload, R = ResponseType
export async function put<P, R>({
  path,
  payload,
}: RequestWithPayload<P>): Promise<R> {
  const headers: HeadersInit = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return axios.put(`${baseURL}${path}`, payload, {
    headers,
  });
}

// P = payload, R = ResponseType
export async function patch<P, R>({
  path,
  payload,
}: RequestWithPayload<P>): Promise<R> {
  const headers: HeadersInit = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return axios.patch(`${baseURL}${path}`, payload, {
    headers,
  });
}

// R = ResponseType
export async function remove<R>({ path }: BaseRequest): Promise<R> {
  const headers: HeadersInit = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return axios.delete(`${baseURL}${path}`, {
    headers,
  });
}

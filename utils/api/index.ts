import axios from "axios";
import { getToken, PossibleContext } from "../token";

interface BaseRequest extends PossibleContext {
  path: string;
}

interface RequestWithPayload<P> extends BaseRequest {
  payload: P;
}

const baseURL = `${process.env.NEXT_PUBLIC_API_HOST}`;

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

// P = payload, R = ResponseType
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

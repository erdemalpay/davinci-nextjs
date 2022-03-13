import axios from "axios";
import { getToken, PossibleContext } from "../serverUtils/index";

interface GetRequest extends PossibleContext {
  path: string;
}

interface PostRequest<P> extends PossibleContext {
  path: string;
  payload: P;
}

const baseURL = `${process.env.NEXT_PUBLIC_API_HOST}`;

export async function get<T>({ path, context }: GetRequest): Promise<T> {
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
}: PostRequest<P>): Promise<R> {
  const headers: HeadersInit = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return axios.post(`${baseURL}${path}`, payload, {
    headers,
  });
}

import { NextApiRequestCookies } from "next/dist/server/api-utils";

interface GetUser {
	path: string,
	cookies?: NextApiRequestCookies,
}

export interface User {
	name: string;
	role: string;
}

export async function get({path, cookies}: GetUser): Promise<User> {
	const headers:HeadersInit = {'Content-Type':'application/json'};
	if (cookies) {
		headers.Cookie = `jwt=${cookies.jwt}`
	}
	console.log({headers});
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${path}`, {
		headers,
		credentials: 'include',
		mode: 'cors'
	});
	
	const data = await res.json();
	const { name, role } = data;
	return {
		name,
		role
	};
}
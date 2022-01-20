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
	const headers:HeadersInit = {};
	if (cookies) {
		headers.Cookie = `jwt=${cookies.jwt}`
	}
	console.log(`${process.env.API_HOST}${path}`);
	const res = await fetch(`${process.env.API_HOST}${path}`, {
		headers
});
	
	const data = await res.json();
	const { name, role } = data;
	return {
		name,
		role
	};
}
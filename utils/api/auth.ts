export interface LoginCredentials {
	username: string;
	password: string;
}

export async function login(payload: LoginCredentials) {
	return fetch(`${process.env.API_HOST}/auth/login`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}
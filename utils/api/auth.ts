export interface LoginCredentials {
	username: string;
	password: string;
}

export async function login(payload: LoginCredentials) {
	return fetch(`${process.env.NEXT_PUBLIC_API_HOST}/auth/login`, {
		method: "POST",
		body: JSON.stringify(payload),
		headers: {
			'Content-Type':'application/json'
		},
	});
}
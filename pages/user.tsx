import { GetServerSideProps } from "next";

import { get } from "../utils/api/user";
import type { User } from "../utils/api/user";

export const getServerSideProps: GetServerSideProps<User> = async ({ req }) => {
		const {cookies} = req;
		
		const { name, role }= await get({path: '/user/profile', cookies });
		
		return {
			props: {
				name,
				role,
			},
		};
}

export default function User({ name, role }: User) {
	return (
		<div>
			<h1>Name: {name}</h1>
			<h2>Role: {role}</h2>
		</div>
	);
}

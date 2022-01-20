import { GetServerSideProps } from "next";

interface UserProps {
	name: string;
	role: string;
}

export const getServerSideProps: GetServerSideProps<UserProps> = async (context) => {
		const { req } = context;
    const {cookies} = req
		
		const res = await fetch(`https://apiv2.davinciboardgame.com/user/profile`, {
		headers: {
			Cookie: `jwt=${cookies.jwt}`
		}});
		
		const data = await res.json();
		const { name, role } = data;
		return {
			props: {
				name,
				role,
			},
		};
}

export default function User({ name, role }: UserProps) {
	return (
		<div>
			<h1>Name: {name}</h1>
			<h2>Role: {role}</h2>
		</div>
	);
}

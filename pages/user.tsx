import { GetServerSideProps } from "next";
import useSWR, { SWRConfig } from 'swr'

import { get } from "../utils/api/user";
import type { User } from "../utils/api/user";

const path = '/user/profile';

export const getServerSideProps: GetServerSideProps = async (context) => {
	const {req} = context;
	const {cookies} = req;
	console.dir(req.headers);
	const { name, role } = await get({path, cookies });

	return {
		props: {
			fallback: {
				[path]: {
					name,
					role,
				}
			}
		},
	};
}

function UserComponent() {
	const { data, error } = useSWR(path);
	if (error) return <p>An error has occurred.</p>;
  if (!data) return <p>Loading...</p>;
	const {name, role} = data;
	return (
		<div>
			<h1>Name: {name}</h1>
			<h2>Role: {role}</h2>
		</div>
	);
}

export default function Page({ fallback }: { fallback: {[path]: User }}) {
  return (
    <SWRConfig value={{ fallback }}>
      <UserComponent />
    </SWRConfig>
  )
}
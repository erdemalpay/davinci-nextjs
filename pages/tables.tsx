import { NextPage } from "next";
import { DateInput } from "../components/DateInput";
import { InputWithLabel } from '../components/InputWithLabel';
const TablesPage:NextPage = () => {
	return (
		<div className="m-8">
			<div className="mb-8">
				<label htmlFor="date" className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2">
						Date
					</label>
				<DateInput id="date"/>
			</div>
			<div>
				<div className="flex">
				<InputWithLabel label='Active Table' type="number" className='w-full' />
				<InputWithLabel label='Total Table' type="number" readOnly className='w-full'/>
				</div>
			</div>
		</div>
	);
}

export default TablesPage;
import { NextPage } from "next";
import { DateInput } from "../components/DateInput";
import { Header } from "../components/Header";
import { InputWithLabel } from '../components/InputWithLabel';
const TablesPage:NextPage = () => {
	return (
		<>
		<Header />
		<div className="w-full h-full py-12 ">
				{/* Remove class [ h-64 ] when adding a card block */}
				<div className="container mx-auto px-6 h-64">
						<div className="flex w-full h-full flex-wrap">
							<div className="container mx-auto pb-10 h-64 -mt-8">
									<div className="bg-white rounded shadow w-full h-full">
									<div className="mb-8">
										<DateInput id="date"/>
									</div>
									<div>
										<div className="flex">
										<InputWithLabel label='Active Table' type="number" className='w-full' />
										<InputWithLabel label='Total Table' type="number" readOnly className='w-full'/>
										</div>
									</div>
									</div>
							</div>
						</div>
				</div>
		</div>
	</>
	);
}

export default TablesPage;
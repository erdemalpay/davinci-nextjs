import DatePicker from 'react-datepicker';
import { useState } from 'react';

export function DateInput ({...props}) {
	const [date, setDate] = useState(new Date());
	return (
		<DatePicker
			{...props}
			className="border-0 border-b-2"
			selected={date}
			onChange={(date) => setDate(date as Date)}
			nextMonthButtonLabel=">"
			previousMonthButtonLabel="<"
			popperClassName="react-datepicker-left"
		/>
	);
}
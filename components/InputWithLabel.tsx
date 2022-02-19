import { DateInput } from "./DateInput";

export type InputType = 'date' | 'autocomplete' | 'text' | 'number';

export interface LabelWrapperProps {
	label: string;
	type: InputType;
	id?: string;
	readOnly?: boolean;
	className?: string;
}

export function InputWithLabel({ label, type, id = label.toLowerCase(), ...props }:LabelWrapperProps) {
	return (
		<div className="relative md:mr-16 mt-10">
			<input id={id} {...props} type={type} className="peer placeholder-transparent text-gray-600 border-0 border-b-[1px] dark:text-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 text-base border-gray-300 rounded" placeholder='' />
			<label htmlFor={id} className="text-gray-800 dark:text-gray-100 text-xs absolute left-0 -top-3.5 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-xs">
				{label}
			</label>
		</div>
	);
}
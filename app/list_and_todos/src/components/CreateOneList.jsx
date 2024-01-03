import { useState } from "react";
import { createOneList } from "../GraphQL/Mutations";
import { useMutation } from "@apollo/client";

const CreateOneList = () => {
	const [info, setInfo] = useState({ isDone: false });
	const [createOneList, { error }] = useMutation(createOneList);

	const submit = () => {
		createOneList({
			variables: {},
		});
	};

	// const [isCheck, setIsCheck] = useState(true);
	// const [isCheck2, setIsCheck2] = useState(false);
	const infoToBeSubmitted = (e) => {
		setInfo({
			...info,
			[e.target.name]: e.target.value,
			// isDone: isCheck || isCheck2,
		});
	};

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					<label htmlFor="">Title</label>
					<input
						type="text"
						name="title"
						onChange={(e) => infoToBeSubmitted(e)}
					/>
				</div>
				<div>
					<label htmlFor="">Description</label>
					<input
						type="text"
						name="description"
						onChange={(e) => infoToBeSubmitted(e)}
					/>
				</div>
				<div>
					<label htmlFor="">Is Done</label>
					<input
						type="radio"
						name="isDone"
						defaultChecked={true}
						value="false"
						// checked={isCheck}
						onChange={(e) => infoToBeSubmitted(e)}
					/>{" "}
					<label
					// onClick={() => {
					// 	setIsCheck(true), setIsCheck2(false);
					// }}
					>
						no
					</label>
					<input
						type="radio"
						name="isDone"
						value="true"
						// checked={isCheck2}
						onChange={(e) => infoToBeSubmitted(e)}
					/>
					<label
					// onClick={() => {
					// 	setIsCheck(false), setIsCheck2(true);
					// }}
					>
						yes
					</label>
				</div>
				<button></button>
			</form>
		</div>
	);
};

export default CreateOneList;

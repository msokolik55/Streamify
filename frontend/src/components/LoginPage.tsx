import { useForm } from "react-hook-form";

import { apiLoginUrl } from "../urls";

type FormLabelProps = {
	title: string;
	for: string;
};
const FormLabel = (props: FormLabelProps) => {
	return (
		<label
			htmlFor={props.for}
			className="leading-6 font-medium text-sm block"
		>
			{props.title}
		</label>
	);
};

type Inputs = {
	username: string;
	password: string;
};

const LoginPage = () => {
	const { register, handleSubmit } = useForm<Inputs>();

	const onSubmit = async (data: Inputs) => {
		const res = await fetch(apiLoginUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const resData = await res.json();
		const loginSuccess = resData.data;
		console.log(loginSuccess);
	};

	return (
		<div>
			<h1 className="tracking-tight font-bold text-2xl leading-8 text-center mt-10 m-0">
				Sign in to your account
			</h1>
			<div className="max-w-sm w-full mx-auto mt-10">
				<form
					className="flex flex-col gap-3"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div>
						<FormLabel title="Username" for="username" />
						<div className="mt-2">
							<input
								{...register("username", { required: true })}
								id="username"
								name="username"
								type="text"
								required={true}
								className="leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800"
							/>
						</div>
					</div>

					<div>
						<FormLabel title="Password" for="password" />
						<div className="mt-2">
							<input
								{...register("password", { required: true })}
								id="password"
								name="password"
								type="password"
								required={true}
								className="leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800"
							/>
						</div>
					</div>

					<div>
						<button
							className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center w-full flex bg-gray-500 mt-2 hover:bg-gray-600"
							type="submit"
						>
							Sign in
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;

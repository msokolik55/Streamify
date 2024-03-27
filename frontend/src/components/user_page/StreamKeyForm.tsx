import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { logInfo } from "../../../logger";
import { LoggedUserIdAtom } from "../../atom";
import { IDataUser } from "../../models/IDataUser";
import fetcher from "../../models/fetcher";
import { StreamKeyInputs } from "../../models/form";
import { apiLiveUrl, apiStreamUrl, apiUserUrl } from "../../urls";
import MainWindowError from "../errors/MainWindowError";
import FormLabel from "../login_page/FormLabel";

const StreamKeyForm = () => {
	const LoggedUserId = useRecoilValue(LoggedUserIdAtom);

	const { data } = useSWR<IDataUser, Error>(
		`${apiUserUrl}/${LoggedUserId}`,
		fetcher,
	);
	const user = data?.data;

	if (!user) {
		return (
			<MainWindowError message="Cannot find user with given username." />
		);
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<StreamKeyInputs>();

	const { mutate } = useSWRConfig();

	const setUserLive = async () => {
		logInfo("Fetching: StreamKeyForm.setUserLive");

		await fetch(apiLiveUrl, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: user.id,
				live: true,
			}),
		});
	};

	const createStream = async (name: string) => {
		logInfo("Fetching: StreamKeyForm.createStream");

		await fetch(apiStreamUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: name,
				username: user.username,
			}),
		});
	};

	const onSubmit = async (data: StreamKeyInputs) => {
		await setUserLive();
		await createStream(data.name);

		mutate(apiLiveUrl);
		mutate(`${apiUserUrl}/${LoggedUserId}`);
	};

	return (
		<form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
			<div>
				<FormLabel
					title="Stream name"
					for="name"
					required={true}
					minLength={3}
				/>
				<div className="mt-2">
					<input
						{...register("name", {
							required: true,
							minLength: 3,
						})}
						id="name"
						name="name"
						type="text"
						required={true}
						minLength={3}
						className="leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800"
						aria-invalid={errors.name ? "true" : "false"}
					/>
				</div>
			</div>

			<button
				className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
				type="submit"
			>
				Go live
			</button>
		</form>
	);
};

export default StreamKeyForm;

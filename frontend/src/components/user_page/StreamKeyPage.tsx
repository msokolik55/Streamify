import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { loggedUserAtom } from "../../atom";
import { IDataUser } from "../../models/IDataUser";
import fetcher from "../../models/fetcher";
import { StreamKeyInputs } from "../../models/form";
import { apiLiveUrl, apiStreamUrl, apiUserUrl } from "../../urls";
import MainWindowError from "../errors/MainWindowError";
import FormLabel from "../login_page/FormLabel";

const StreamKeyPage = () => {
	const loggedUser = useRecoilValue(loggedUserAtom);

	const { data, error } = useSWR<IDataUser, Error>(
		`${apiUserUrl}/${loggedUser}`,
		fetcher,
	);
	const user = data?.data;

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<StreamKeyInputs>();

	if (error) {
		return <MainWindowError message={error.message} />;
	}

	if (!user) {
		return (
			<MainWindowError message="Cannot find user with given username." />
		);
	}

	const { mutate } = useSWRConfig();

	const createStream = async (name: string) => {
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

	const onSubmit = async (data: StreamKeyInputs | null = null) => {
		await fetch(apiLiveUrl, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: user.id,
				live: user.streamKey === null,
			}),
		});

		if (user.streamKey === null && data !== null) {
			await createStream(data.name);
		} else {
			await fetch(apiStreamUrl, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					filePath: user.streamKey,
				}),
			});

			mutate(`${apiUserUrl}/${loggedUser}`);
		}

		mutate(apiLiveUrl);
		mutate(`${apiUserUrl}/${loggedUser}`);
	};

	const copyStreamKey = () => {
		navigator.clipboard.writeText(user.streamKey ?? "");
		window.alert("Stream key copied to clipboard.");
	};

	return (
		<div className="flex flex-col gap-4">
			{user.streamKey === null ? (
				<form
					className="flex flex-col gap-3"
					onSubmit={handleSubmit(onSubmit)}
				>
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
			) : (
				<>
					<table>
						<tbody>
							<tr>
								<td>Name:</td>
								<td>
									{
										user.streams.filter(
											(stream) =>
												stream.path === user.streamKey,
										)[0].name
									}
								</td>
							</tr>
							<tr>
								<td>Key:</td>
								<td>{user.streamKey}</td>
								<td>
									<button
										className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
										onClick={copyStreamKey}
									>
										Copy
									</button>
								</td>
							</tr>
						</tbody>
					</table>

					<button
						className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
						onClick={async () => await onSubmit()}
					>
						End live
					</button>
				</>
			)}
		</div>
	);
};

export default StreamKeyPage;

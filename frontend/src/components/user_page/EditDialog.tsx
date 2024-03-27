import { SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { useSWRConfig } from "swr";

import { logInfo } from "../../../logger";
import { LoggedUserIdAtom } from "../../atom";
import { IStream } from "../../models/IStream";
import { StreamEditInputs } from "../../models/form";
import { apiStreamUrl, apiUserUrl } from "../../urls";

type EditDialogProps = {
	setShow: (value: SetStateAction<boolean>) => void;
	stream: IStream;
};

const EditDialog = (props: EditDialogProps) => {
	const LoggedUserId = useRecoilValue(LoggedUserIdAtom);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<StreamEditInputs>();

	const { mutate } = useSWRConfig();
	const onSubmit = async (data: StreamEditInputs | null = null) => {
		if (data === null) return;

		logInfo("Fetching: EditDialog.onSubmit");

		await fetch(apiStreamUrl, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: data.id,
				name: data.name,
			}),
		});

		mutate(`${apiUserUrl}/${LoggedUserId}`);
		props.setShow(false);
	};

	return (
		<div
			className="relative z-10"
			aria-labelledby="modal-title"
			role="dialog"
			aria-modal="true"
		>
			<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

			<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ml-72">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
							<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
								<div className="sm:flex sm:items-start">
									<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
										<svg
											className="h-6 w-6 text-yellow-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												d="M20.1497 7.93997L8.27971 19.81C7.21971 20.88 4.04971 21.3699 3.27971 20.6599C2.50971 19.9499 3.06969 16.78 4.12969 15.71L15.9997 3.84C16.5478 3.31801 17.2783 3.03097 18.0351 3.04019C18.7919 3.04942 19.5151 3.35418 20.0503 3.88938C20.5855 4.42457 20.8903 5.14781 20.8995 5.90463C20.9088 6.66146 20.6217 7.39189 20.0997 7.93997H20.1497Z"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<path
												d="M21 21H12"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</div>
									<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
										<h3
											className="text-base font-semibold leading-6 text-gray-900"
											id="modal-title"
										>
											Edit video
										</h3>
										<div className="mt-2 text-black">
											<input
												{...register("id", {
													required: true,
												})}
												defaultValue={props.stream.id}
												type="hidden"
											/>
											<label>*Name (min. 3): </label>
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
												aria-invalid={
													errors.name
														? "true"
														: "false"
												}
												defaultValue={props.stream.name}
												className="border px-2 rounded-md"
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
								<button
									type="submit"
									className="inline-flex w-full justify-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 sm:ml-3 sm:w-auto"
								>
									Edit
								</button>
								<button
									onClick={() => props.setShow(false)}
									type="button"
									className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
								>
									Cancel
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditDialog;

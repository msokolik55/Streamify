import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { Dispatch, SetStateAction } from "react";

interface ITextFieldProps {
	label: string;
	name: string;
	accept?: string;
	disabled?: boolean;
	picture: any;
	setFile: Dispatch<SetStateAction<File | undefined>>;
}

const PictureUploadField = (props: ITextFieldProps) => {
	return (
		<div className="flex flex-col gap-2">
			<label htmlFor={props.name}>{props.label}</label>
			<FileUpload
				mode="basic"
				id={props.name}
				name={props.name}
				accept={props.accept}
				disabled={props.disabled}
				onClear={() => {
					props.setFile(undefined);
				}}
				onSelect={(e) => {
					console.log(e.files[0]);
					props.setFile(e.files[0]);
				}}
			/>

			{props.picture && (
				<Image
					src={props.picture.objectURL}
					alt="Profile picture"
					imageClassName="w-32"
				/>
			)}
		</div>
	);
};

export default PictureUploadField;

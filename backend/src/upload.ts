import { randomUUID } from "crypto";
import fs from "fs";
import multer from "multer";

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		const uploadFolder = "uploads";
		if (!fs.existsSync(uploadFolder)) {
			fs.mkdirSync(uploadFolder);
		}
		cb(null, uploadFolder);
	},
	filename: (_req, file, cb) => {
		cb(null, `${randomUUID()}-${file.originalname}`);
	},
});

const fileFilter = (_req: any, file: any, cb: any) => {
	for (let i = 0; i < file.length; i++) {
		console.log(file[i]);

		if (!file[i].type.includes("image")) {
			cb(new Error("Only .jpeg, .png, or .gif formats allowed!"), false);
			return;
		}
	}

	cb(null, true);
};

export const upload = multer({ storage: storage, fileFilter: fileFilter });

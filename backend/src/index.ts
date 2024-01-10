import express from "express";
import cors from "cors";
import router from "./router";

const api = express();
const port = process.env.PORT ?? 4000;

api.use(express.json());
api.use(cors());
api.use("/", router);

api.listen(port, () => console.log(`Example app listening on port ${port}`));

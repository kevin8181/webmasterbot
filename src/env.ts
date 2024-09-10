
import dotenv from "dotenv";
dotenv.config();

import { cleanEnv, str } from "envalid";

const env = cleanEnv(process.env, {
	TOKEN: str(),
	GUILD_ID: str(),
});
export default env;

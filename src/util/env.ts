
import dotenv from "dotenv";
dotenv.config();

import { cleanEnv, str } from "envalid";

const env = cleanEnv(process.env, {
	TOKEN: str(),
	GUILD_ID: str(),

	ROLE_OA_ACCESS_ID: str(),
	OA_ADMONITION: str(),
});
export default env;

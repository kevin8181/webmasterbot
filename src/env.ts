import dotenv from "dotenv";
dotenv.config({
	quiet: true,
});

import { z } from "zod";

const envSchema = z.object({
	TOKEN: z.string().min(1),
	GUILD_ID: z.string().min(1),

	ROLE_OA_ACCESS_ID: z.string().min(1),
	OA_ADMONITION: z.string().min(1),
});

export const env = envSchema.parse(process.env);

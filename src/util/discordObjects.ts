import env from "./env.js";
import { container } from "@sapphire/framework";
import { Role } from "discord.js";

export const GUILD = async () =>
	await container.client.guilds.fetch(env.GUILD_ID);

// ROLES //
async function fetchRole(id: string) {
	const role = (await GUILD()).roles.fetch(id);
	if (role === null) {
		throw new Error("Role not found");
	}
	return role as Promise<Role>;
}
export const ROLE_OA_ACCESS = async () =>
	await fetchRole(env.ROLE_OA_ACCESS_ID);

// CHANNELS //
// async function fetchChannel<T extends ChannelType>(
// 	id: string,
// 	type: T
// ): Promise<Channel & { type: T }> {
// 	const channel = await container.client.channels.fetch(id);
// 	if (!channel) throw new Error(`Channel ${id} not found`);
// 	if (channel.type !== type)
// 		throw new Error(`Channel ${id} is not of type ${type}`);
// 	return channel as Channel & { type: T };
// }

// export const CHANNEL_INTRODUCTIONS = async () =>
// 	await fetchChannel<ChannelType.GuildText>(
// 		env.CHANNEL_INTRODUCTIONS_ID,
// 		ChannelType.GuildText
// 	);

//todo attach this to container for clean import
//make it an object instead of individual exports/imports

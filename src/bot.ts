import {
	ApplicationCommandRegistries,
	RegisterBehavior,
	SapphireClient,
} from "@sapphire/framework";
import "@sapphire/plugin-hmr/register";

import { ActivityType, Events, GatewayIntentBits } from "discord.js";

import { env } from "#env";

//delete all existing commands and repopulate each time the bot starts
//https://sapphirejs.dev/docs/Guide/commands/application-commands/application-command-registry/advanced/setting-global-behavior-when-not-identical
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
	RegisterBehavior.BulkOverwrite,
);

const client = new SapphireClient({
	intents: [
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
	],
	presence: {
		activities: [
			{
				name: "playing a game with a purpose",
				type: ActivityType.Playing,
			},
		],
	},
	allowedMentions: {
		parse: ["users"],
		repliedUser: true,
	},
	hmr: {
		enabled: process.env["NODE_ENV"] !== "production",
	},
});

//todo this can be removed, just has to run once
//all commands are global, so clear any guild-scoped ones left over from older versions.
//sapphire's bulk overwrite only touches guilds it has guild commands for
client.once(Events.ClientReady, async (readyClient) => {
	await Promise.all(
		readyClient.guilds.cache.map((guild) => guild.commands.set([])),
	);
});

await client.login(env.TOKEN);

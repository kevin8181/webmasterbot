import {
	ApplicationCommandRegistries,
	RegisterBehavior,
	SapphireClient,
} from "@sapphire/framework";
import { ActivityType, GatewayIntentBits } from "discord.js";

import env from "./env.js";

//delete all existing commands and repopulate each time the bot starts
//https://sapphirejs.dev/docs/Guide/commands/application-commands/application-command-registry/advanced/setting-global-behavior-when-not-identical
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
	RegisterBehavior.BulkOverwrite
);

//only register commands in the home guild
//https://sapphirejs.dev/docs/Guide/commands/application-commands/application-command-registry/globally-configuring-guildids
ApplicationCommandRegistries.setDefaultGuildIds([env.GUILD_ID]);

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
			//todo figure out how to set custom status with no activity type
			{
				name: "a game with a purpose",
				type: ActivityType.Playing,
			},
		],
	},
	allowedMentions: {
		parse: ["users"],
		repliedUser: true,
	},
});

await client.login(env.TOKEN);
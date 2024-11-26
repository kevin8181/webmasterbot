import { Command } from "@sapphire/framework";
import env from "../util/env.js";
import { ROLE_OA_ACCESS, GUILD } from "../util/discordObjects.js";

export class OaAccessCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
		});
	}
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName("admonition")
				.setDescription("Give the admonition to get access to the OA channel.")
				.addStringOption((option) =>
					option.setName("admonition").setRequired(true)
				);
		});
	}

	public override async chatInputRun(
		interaction: Command.ChatInputCommandInteraction
	) {
		const input = interaction.options
			.getString("admonition", true)
			.toUpperCase();

		if (input !== env.OA_ADMONITION) {
			return interaction.reply({
				content: "That is not the admonition.",
				ephemeral: true,
			});
		}

		const role = await ROLE_OA_ACCESS();
		const guild = await GUILD();

		if (!interaction.member) throw new Error("Member not found");

		const member = await guild.members.fetch(interaction.user.id);

		await member.roles.add(role);

		return interaction.reply({
			content: "You have been given OA access.",
			ephemeral: true,
		});
	}
}

import { Command } from "@sapphire/framework";
import {
	ApplicationIntegrationType,
	EmbedBuilder,
	InteractionContextType,
	MessageFlags,
} from "discord.js";
import {
	listItems,
	search,
	SCOUTING411_URL,
	type SearchItem,
} from "#lib/scouting411";

// discord caps autocomplete at 25 choices, and choice names and values at 100 characters
const MAX_CHOICES = 25;
const MAX_CHOICE_LENGTH = 100;

const TYPE_LABELS: Record<SearchItem["type"], string> = {
	page: "Page",
	hub: "Hub",
	feed: "News Source",
	resource: "Resource",
	rank: "Rank",
	meritBadge: "Merit Badge",
	adventure: "Cub Scout Adventure",
	award: "Award",
};

/** the autocomplete value for an item. a few ids are too long, so they're cut off */
const choiceValue = (item: SearchItem) => item.id.slice(0, MAX_CHOICE_LENGTH);

export class LookupCommand extends Command {
	public constructor(context: Command.LoaderContext, options: Command.Options) {
		super(context, {
			...options,
		});
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName("lookup")
				.setIntegrationTypes(
					ApplicationIntegrationType.GuildInstall,
					ApplicationIntegrationType.UserInstall,
				)
				.setContexts(
					InteractionContextType.Guild,
					InteractionContextType.BotDM,
					InteractionContextType.PrivateChannel,
				)
				.setDescription(
					"Look up a rank, merit badge, adventure, award, or resource on Scouting411.",
				)
				.addStringOption((option) =>
					option
						.setName("query")
						.setDescription("What to look up.")
						.setRequired(true)
						.setAutocomplete(true),
				);
		});
	}

	public override async autocompleteRun(
		interaction: Command.AutocompleteInteraction,
	) {
		const query = interaction.options.getFocused().trim();
		if (!query) return interaction.respond([]);

		const results = await search(query, MAX_CHOICES);

		return interaction.respond(
			results.map((item) => ({
				name: `${item.name} (${TYPE_LABELS[item.type]})`.slice(
					0,
					MAX_CHOICE_LENGTH,
				),
				value: choiceValue(item),
			})),
		);
	}

	public override async chatInputRun(
		interaction: Command.ChatInputCommandInteraction,
	) {
		const value = interaction.options.getString("query", true);

		const items = await listItems();
		const item = items.find((item) => choiceValue(item) === value);

		if (!item) {
			return interaction.reply({
				content: "Pick one of the suggested results.",
				flags: MessageFlags.Ephemeral,
			});
		}

		return interaction.reply({ embeds: [renderItem(item)] });
	}
}

function renderItem(item: SearchItem) {
	const url = item.external ? item.url : `${SCOUTING411_URL}${item.url}`;

	const embed = new EmbedBuilder()
		.setTitle(item.name)
		.setURL(url)
		.setFooter({ text: `${TYPE_LABELS[item.type]} · Scouting411` });

	if (item.description) embed.setDescription(item.description);
	if (item.image) embed.setThumbnail(item.image);
	if (item.color) embed.setColor(item.color);

	return embed;
}

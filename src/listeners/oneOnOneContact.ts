import { Events, Listener } from "@sapphire/framework";
import type { GuildMember, VoiceBasedChannel, VoiceState } from "discord.js";
import { env } from "#env";
import { CHANNEL_LEADERS_LOG } from "#util/discordObjects";

// enforces the youth protection "no one-on-one contact" rule in voice channels

const GRACE_PERIOD_SECONDS = 30;

/**
 * voice channels that are currently one-on-one, mapped to their grace period timer
 */
const flaggedChannels = new Map<string, NodeJS.Timeout>();

export class OneOnOneContactListener extends Listener<
	typeof Events.VoiceStateUpdate
> {
	public constructor(
		context: Listener.LoaderContext,
		options: Listener.Options,
	) {
		super(context, { ...options, event: Events.VoiceStateUpdate });
	}

	public override async run(oldState: VoiceState, newState: VoiceState) {
		// the channel they left, if they left or moved
		if (oldState.channel && oldState.channelId !== newState.channelId) {
			await checkChannel(oldState.channel);
		}

		// the channel they're in now
		if (newState.channel) {
			await checkChannel(newState.channel);
		}
	}
}

/** re-check a channel whose state has changed */
async function checkChannel(channel: VoiceBasedChannel) {
	const alreadyFlagged = flaggedChannels.has(channel.id);
	const isViolation = checkForViolation(channel);

	if (isViolation && alreadyFlagged) return;
	if (!isViolation && !alreadyFlagged) return;

	if (!isViolation && alreadyFlagged) {
		unflagChannel(channel);
		return;
	}

	await flagChannel(channel);
}

/** handle a channel that has become in violation */
async function flagChannel(channel: VoiceBasedChannel) {
	const timer = setTimeout(() => {
		disconnectMembers(channel).catch(console.error);
	}, GRACE_PERIOD_SECONDS * 1000);

	flaggedChannels.set(channel.id, timer);

	await sendWarning(channel);
}

/** handle a channel that is no longer in violation */
function unflagChannel(channel: VoiceBasedChannel) {
	const flag = flaggedChannels.get(channel.id);

	if (!flag) throw new Error("channel passed to unflagChannel is not flagged");

	clearTimeout(flag);

	flaggedChannels.delete(channel.id);
}

/** tell the members in the channel and the leaders that a one-on-one was detected */
async function sendWarning(channel: VoiceBasedChannel) {
	const members = mentionMembers(getMembersInVoiceChannel(channel));

	await channel.send(
		`${members}: one-on-one contact between an adult and a youth isn't allowed. ` +
			`Add another person or leave within ${GRACE_PERIOD_SECONDS} seconds, or you'll both be disconnected.`,
	);

	await logToLeaders(
		`One-on-one contact detected between ${members} in ${channel}.`,
	);
}

/** disconnect everyone in a voice channel */
async function disconnectMembers(channel: VoiceBasedChannel) {
	// if the users have changed their roles since they got the warning, they may now be in compliance
	if (!checkForViolation(channel)) return;

	const members = getMembersInVoiceChannel(channel);
	for (const member of members) {
		await member.voice.disconnect("One-on-one contact in voice");
	}

	await logToLeaders(
		`Disconnected ${mentionMembers(members)} in ${channel} for one-on-one contact.`,
	);
}

// HELPERS //

/** true if the voice channel has one youth and one adult in it */
function checkForViolation(channel: VoiceBasedChannel) {
	const members = getMembersInVoiceChannel(channel);

	if (members.length !== 2) {
		return false;
	}

	const bothAdults = members.every((member) =>
		member.roles.cache.has(env.ROLE_ADULT_ID),
	);

	const bothYouth = members.every((member) =>
		member.roles.cache.has(env.ROLE_YOUTH_ID),
	);

	if (bothAdults || bothYouth) return false;

	return true;
}

/** get the list of guild members in a voice channel, not including bots */
function getMembersInVoiceChannel(channel: VoiceBasedChannel) {
	return [...channel.members.values()].filter((member) => !member.user.bot);
}

/** mention members as "@a and @b" */
function mentionMembers(members: GuildMember[]) {
	return members.map((member) => member.toString()).join(" and ");
}

async function logToLeaders(content: string) {
	const channel = await CHANNEL_LEADERS_LOG();
	await channel.send(content);
}

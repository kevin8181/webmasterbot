<div align="center">

# 🤖 Webmaster

**Scouting utilities for Discord.**

[![CI](https://github.com/scouting-commons/webmasterbot/actions/workflows/ci.yml/badge.svg)](https://github.com/scouting-commons/webmasterbot/actions/workflows/ci.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue)](LICENSE)

[Report an issue](https://github.com/scouting-commons/webmasterbot/issues)

</div>

> [!IMPORTANT]
> **Webmaster is unofficial.** It is a [Scouting Commons](https://github.com/scouting-commons) community project and is not affiliated with, endorsed by, or speaking for Scouting America. Webmaster helps enforce Youth Protection rules on Discord, but it is not a substitute for Safeguarding Youth Training or adult supervision. For the official policies, see [scouting.org](https://www.scouting.org/training/safeguarding-youth/).

## 🏕️ Why

More and more units and Scouting communities run a Discord server. Webmaster takes care of the Scouting-specific jobs a general-purpose bot can't. The name is a nod to the troop webmaster position.

## 🧭 What it does

| Feature                   | What it is                                                                                                                                                                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No one-on-one contact** | Watches voice channels for exactly one adult and one youth alone together. It warns them in the channel's chat and in the leaders' log channel. If nobody else joins and neither of them leaves within 30 seconds, it disconnects both and logs it. |
| **OA channel access**     | `/admonition` grants an OA access role to anyone who enters the correct admonition. The reply is only visible to the person who ran it.                                                                                                             |

More utilities, such as quick requirements lookups, are planned.

## 🛠️ Running your own

Each instance of Webmaster serves one Discord server.

### 1. Create the Discord application

1. Create an application and a bot in the [Discord Developer Portal](https://discord.com/developers/applications).
2. Under **Bot**, turn on the **Server Members** and **Message Content** privileged intents.
3. Invite the bot to your server with the `bot` and `applications.commands` scopes, plus these permissions: View Channels, Send Messages, Manage Roles, and Move Members.
4. In your server's role list, drag the bot's role above the OA access role, or it won't be able to assign it.

### 2. Configure

Create a `.env` file in the project root:

```sh
TOKEN=            # the bot's token
GUILD_ID=         # your server's ID

ROLE_OA_ACCESS_ID=  # role given by /admonition
OA_ADMONITION=      # the admonition, in ALL CAPS (input is uppercased before comparing)

ROLE_YOUTH_ID=      # role worn by youth members
ROLE_ADULT_ID=      # role worn by adult members
CHANNEL_LOGS_ID=    # text channel where leaders get warnings and disconnect logs
```

To copy IDs, turn on **Developer Mode** in Discord's advanced settings, then right-click a server, role, or channel and choose **Copy ID**. The bot checks every variable at startup and won't start if one is missing.

### 3. Run

Requires Node.js (current LTS) and pnpm.

```sh
pnpm install
pnpm build
NODE_ENV=production pnpm start
```

Slash commands are registered to your server each time the bot starts.

## 💻 Development

Webmaster is built with [Sapphire](https://sapphirejs.dev) on top of [discord.js](https://discord.js.org), in TypeScript. Commands live in `src/commands/` and event listeners in `src/listeners/`. Sapphire loads both automatically.

| Command       | Description                                                      |
| ------------- | ---------------------------------------------------------------- |
| `pnpm dev`    | Build, then rebuild on change and reload the bot with hot reload |
| `pnpm build`  | Compile to `dist/`                                               |
| `pnpm start`  | Run the compiled bot                                             |
| `pnpm check`  | Run `format`, `types`, and `knip`. Run before committing         |
| `pnpm format` | Format all files with Prettier                                   |
| `pnpm types`  | Type-check without emitting                                      |
| `pnpm knip`   | Find unused files, exports, and dependencies with Knip           |

CI checks formatting, type-checks, builds, and runs Knip on every push and pull request.

## 🤝 Contributing

Bug reports, feature ideas, and pull requests are all welcome on the [issue tracker](https://github.com/scouting-commons/webmasterbot/issues). To report a security issue, see [SECURITY.md](https://github.com/scouting-commons/.github/blob/main/SECURITY.md). Our [code of conduct](https://github.com/scouting-commons/.github/blob/main/CODE_OF_CONDUCT.md) is short: follow the Scout Oath and Scout Law.

---

<div align="center">

<sub>Webmaster is an independent community project and is not affiliated with or endorsed by Scouting America. Licensed under [AGPL-3.0](LICENSE).</sub>

<sub>_Be Prepared. Do a Good Turn Daily._</sub>

</div>

import { AWW_COMMAND, INVITE_COMMAND } from "./commands";
import {
	Routes,
	RouteBases,
	RESTPutAPIApplicationGuildCommandsResult,
} from "discord-api-types/v10";
import { Env } from "./utils/env";

/**
 * Register all commands with a specific guild/server. Useful during initial
 * development and testing.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function registerGuildCommands(env: Env) {
	if (!env.DISCORD_TEST_GUILD_ID) {
		throw new Error(
			"The DISCORD_TEST_GUILD_ID environment variable is required."
		);
	}
	const res = await registerCommands(
		`${RouteBases.api}${Routes.applicationGuildCommands(
			env.DISCORD_APPLICATION_ID,
			env.DISCORD_TEST_GUILD_ID
		)}`,
		env.DISCORD_TOKEN
	);
	const data = (await res.json()) as RESTPutAPIApplicationGuildCommandsResult;
	data.forEach(async (cmd) => {
		const response = await fetch(
			`${RouteBases.api}${Routes.applicationGuildCommand(
				env.DISCORD_APPLICATION_ID,
				env.DISCORD_TEST_GUILD_ID,
				cmd.id
			)}`
		);
		if (!response.ok) {
			console.error(`Problem removing command ${cmd.id}`);
		}
	});
}

/**
 * Register all commands globally.  This can take o(minutes), so wait until
 * you're sure these are the commands you want.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function registerGlobalCommands(env: Env) {
	await registerCommands(
		`${RouteBases.api}${Routes.applicationCommands(
			env.DISCORD_APPLICATION_ID
		)}`,
		env.DISCORD_TOKEN
	);
}

async function registerCommands(url: string, token: string) {
	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bot ${token}`,
		},
		method: "PUT",
		body: JSON.stringify([AWW_COMMAND, INVITE_COMMAND]),
	});

	if (response.ok) {
		console.log("Registered all commands");
	} else {
		console.error("Error registering commands");
		const text = await response.text();
		console.error(text);
	}
	return response;
}

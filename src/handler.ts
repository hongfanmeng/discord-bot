import {
	InteractionResponseType,
	InteractionType,
	RouteBases,
	Routes,
} from "discord-api-types/v10";
import { Router } from "itty-router";
import { AWW_COMMAND, INVITE_COMMAND } from "./commands";
import { JsonResponse } from "./utils";

const router = Router();

router.get("/", (request, env) => {
	return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

router.post("/", async (request, env) => {
	const message = await request.json?.();
	console.log(message);
	if (message.type === InteractionType.Ping) {
		console.log("Handling Ping request");
		return JsonResponse({
			type: InteractionResponseType.Pong,
		});
	}

	if (message.type === InteractionType.ApplicationCommand) {
		// Most user commands will come as `ApplicationCommand`.
		switch (message.data.name.toLowerCase()) {
			case AWW_COMMAND.name.toLowerCase(): {
				console.log("handling cute request");
				return JsonResponse({
					type: 4,
					data: {
						content: "aww",
					},
				});
			}
			case INVITE_COMMAND.name.toLowerCase(): {
				const applicationId = env.DISCORD_APPLICATION_ID as string;
				const INVITE_URL =
					`${RouteBases.api}${Routes.oauth2Authorization()}?` +
					`client_id=${applicationId}&scope=applications.commands`;
				return JsonResponse({
					type: 4,
					data: {
						content: INVITE_URL,
						flags: 64,
					},
				});
			}
			default:
				console.error("Unknown Command");
				return JsonResponse({ error: "Unknown Type" }, { status: 400 });
		}
	}

	console.error("Unknown Type");
	return JsonResponse({ error: "Unknown Type" }, { status: 400 });
});

router.all("*", () => new Response("Not Found.", { status: 404 }));

export const handleRequest = (request: Request) => router.handle(request);
import {
	InteractionResponseType,
	InteractionType,
} from "discord-api-types/v10";
import { Router } from "itty-router";
import { AWW_COMMAND, INVITE_COMMAND } from "./commands";
import { registerGlobalCommands } from "./register";
import { JsonResponse } from "./utils";
import { Env } from "./utils/env";

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
				return AWW_COMMAND.handler(request, env);
			}
			case INVITE_COMMAND.name.toLowerCase(): {
				return INVITE_COMMAND.handler(request, env);
			}
			default:
				console.error("Unknown Command");
				return JsonResponse({ error: "Unknown Type" }, { status: 400 });
		}
	}

	console.error("Unknown Type");
	return JsonResponse({ error: "Unknown Type" }, { status: 400 });
});

router.get("/register", async (request: Request, env: Env) => {
	if (env.DEBUG?.toLowerCase() == "true") {
		await registerGlobalCommands(env);
		return JsonResponse({ details: "success" });
	}
	return JsonResponse({ details: "fail" });
});

router.all("*", () => new Response("Not Found.", { status: 404 }));

export default router;

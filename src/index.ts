import { Env } from "./utils/env";
import router from "./router";
import { verify } from "./utils";
import { registerGlobalCommands } from "./register";

const worker = {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		// verify only POST
		if (request.method == "POST") {
			// Using the incoming headers, verify this request actually came from discord.
			const signature = request.headers.get("x-signature-ed25519");
			const timestamp = request.headers.get("x-signature-timestamp");
			console.log(signature, timestamp, env.DISCORD_PUBLIC_KEY);
			if (!signature || !timestamp || !(await verify(request, env))) {
				console.error("Invalid Request");
				return new Response("Bad request signature.", { status: 401 });
			}
		}
		// Dispatch the request to the appropriate route
		return router.handle(request, env);
	},
	async scheduled(event: Event, env: Env, ctx: ExecutionContext) {
		ctx.waitUntil(registerGlobalCommands(env));
	},
};

export default worker;

import { Request } from "itty-router";
import { JsonResponse } from "../utils";
import { Env } from "../utils/env";

export default async function invite(
	request: Request,
	env: Env
): Promise<Response> {
	return JsonResponse({
		type: 4,
		data: {
			content: "invite",
		},
	});
}

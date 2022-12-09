import { Request } from "itty-router";
import { JsonResponse } from "../utils";

export default async function invite(request: Request): Promise<Response> {
	return JsonResponse({
		type: 4,
		data: {
			content: "invite",
		},
	});
}

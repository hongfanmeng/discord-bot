// from https://gist.github.com/devsnek/77275f6e3f810a9545440931ed314dc1

"use strict";

import { Env } from "./env";

function hex2bin(hex: string) {
	const buf = new Uint8Array(Math.ceil(hex.length / 2));
	for (let i = 0; i < buf.length; i++) {
		buf[i] = parseInt(hex.substr(i * 2, 2), 16);
	}
	return buf;
}

export async function verify(request: Request, env: Env) {
	const signature = hex2bin(request.headers.get("X-Signature-Ed25519")!);
	const timestamp = request.headers.get("X-Signature-Timestamp");
	const unknown = await request.clone().text();

	const PUBLIC_KEY = await crypto.subtle.importKey(
		"raw",
		hex2bin(env.DISCORD_PUBLIC_KEY),
		{
			name: "NODE-ED25519",
			namedCurve: "NODE-ED25519",
		},
		true,
		["verify"]
	);

	const encoder = new TextEncoder();

	return await crypto.subtle.verify(
		"NODE-ED25519",
		PUBLIC_KEY,
		signature,
		encoder.encode(timestamp + unknown)
	);
}

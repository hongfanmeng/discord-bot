import aww from "./aww";
import invite from "./invite";

export const AWW_COMMAND = {
	name: "awwww",
	description: "Drop some cuteness on this channel.",
	handler: aww,
};

export const INVITE_COMMAND = {
	name: "invite",
	description: "Get an invite link to add the bot to your server",
	handler: invite,
};

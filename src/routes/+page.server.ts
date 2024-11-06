import canSeeRepliesFor from "$lib/can-see-replies-for";
import prisma from "$lib/server/prisma";
import type { Prompt } from "$lib/types";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ locals }) => {
	const session = await locals.auth();

	// This overcomplicated code is required for type inference to work for replies
	let prompts: Prompt[];
	if (session?.user) {
		prompts = await prisma.prompt.findMany({
			select: {
				id: true,
				content: true,
				prompter: { select: { name: true, image: true } },
				locked: true,
				replies: {
					select: {
						content: true,
						replier: { select: { name: true, image: true } },
					},
				},
			},
		});
	} else {
		prompts = await prisma.prompt.findMany({
			select: {
				id: true,
				content: true,
				prompter: { select: { name: true, image: true } },
				locked: true,
			},
		});
	}

	// Redact replies the user can't see
	if (session?.user) {
		for (const prompt of prompts) {
			if (!canSeeRepliesFor(session, prompt)) {
				prompt.replies = undefined;
			}
		}
	}

	return { session, prompts };
};

import prisma from "$lib/server/prisma";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async (event) => {
	return {
		session: await event.locals.auth(),
		prompts: await prisma.prompt.findMany({
			select: {
				id: true,
				content: true,
				prompter: { select: { name: true, image: true } },
				locked: true,
			},
		}),
	};
};

import ablyServer from "$lib/server/ably-server";
import prisma from "$lib/server/prisma";
import { json } from "@sveltejs/kit";

// Authenticates a user with Ably by returning a "token request" which the
// client can use to request an Ably token via the Ably API
export const GET = async ({ locals }) => {
	const capability: { [key: string]: ["subscribe"] } = {
		prompts: ["subscribe"],
	};
	const session = await locals.auth();
	if (session?.user?.id) {
		const userId = +session.user.id;
		const prompts = await prisma.prompt.findMany({
			where: {
				OR: [
					{ locked: true },
					{ prompterId: userId },
					{ replies: { some: { replierId: userId } } },
				],
			},
			select: { id: true },
		});
        // TODO: Figure out how to allow users to subscribe to prompts they've received access to after authenticating with Ably
		for (const prompt of prompts) {
			capability[`prompts:${prompt.id}:replies`] = ["subscribe"];
		}
	}
	return json(await ablyServer.auth.createTokenRequest({ capability }));
};

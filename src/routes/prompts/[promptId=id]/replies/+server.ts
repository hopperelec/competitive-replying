import canSeeRepliesFor from "$lib/can-see-replies-for";
import ablyServer from "$lib/server/ably-server";
import prisma from "$lib/server/prisma";
import { Prisma } from "@prisma/client";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, params }) => {
	const session = await locals.auth();
	if (!session) error(401, "Unauthorized");
	if (!session.user?.id)
		error(500, "Your session is not associated with a valid user");
	const promptId = +params.promptId;

	let prompt = await prisma.prompt.findFirst({
		where: { id: promptId },
		select: {
			locked: true,
			prompter: { select: { name: true } },
			replies: {
				select: {
					content: true,
					replier: { select: { name: true, image: true } },
				},
			},
		},
	});

	if (prompt == null) error(404, "Could not find a prompt by the given ID");
	if (!canSeeRepliesFor(session, prompt))
		error(400, "You do not have access to the replies to this prompt yet!");
	return json(prompt.replies);
};

export const POST: RequestHandler = async ({ request, locals, params }) => {
	const session = await locals.auth();
	if (!session) error(401, "Unauthorized");
	if (!session.user?.id)
		error(500, "Your session is not associated with a valid user");
	const promptId = +params.promptId;

	const prompt = await prisma.prompt.findFirst({
		where: { id: promptId },
		select: {
			replies: {
				where: {
					promptId: promptId,
					replierId: +session.user.id,
				},
				select: { promptId: true }, // Need to select something
			},
		},
	});
	if (!prompt) error(404, "Could not find a prompt by the given ID");
	if (prompt.replies.length > 0)
		error(400, "You have already submitted a reply to this prompt");

	const content = await request.text();
	let res: { replier: { image: string | null } };
	try {
		res = await prisma.reply.create({
			data: {
				promptId: promptId,
				replierId: +session.user.id,
				content,
			},
			select: {
				replier: {
					select: {
						image: true,
					},
				},
			},
		});
	} catch (e) {
		if (
			e instanceof Prisma.PrismaClientKnownRequestError &&
			e.code === "P2002"
		) {
			error(
				400,
				"Looks like someone else beat you to it because this reply has already been submitted!",
			);
		}
		console.error(e);
		error(500, "An unexpected error occurred while submitting your reply");
	}
	ablyServer.channels
		.get(`prompts:${params.promptId}:replies`)
		.publish("new-reply", {
			content,
			replier: {
				name: session.user.name,
				image: res.replier.image,
			},
		})
		.then();
	return new Response();
};

import ablyServer from "$lib/server/ably-server";
import prisma from "$lib/server/prisma";
import { Prisma } from "@prisma/client";
import { type RequestHandler, error } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth();
	if (!session) error(401, "Unauthorized");
	if (!session.user?.id)
		error(500, "Your session is not associated with a valid user");
    const content = await request.text();
    let res: {
        id: number,
        prompter: { image: string | null }
    };
	try {
		res = await prisma.prompt.create({
			data: {
				prompter: { connect: { id: +session.user.id } },
				content,
			},
            select: {
                id: true,
                prompter: {
                    select: {
                        image: true,
                    }
                }
            }
		});
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === "P2002")
				error(400, "This prompt has already been submitted");
		}
		console.error(e);
		error(500, "An unexpected error occurred while submitting your prompt");
	}
    ablyServer.channels.get("prompts").publish("new-prompt", {
        id: res.id,
        content,
        prompter: {
            name: session.user.name,
            image: res.prompter.image,
        }
    }).then();
	return new Response();
};
